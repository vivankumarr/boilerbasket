import pandas as pd
from prophet import Prophet
import os
import sys
from supabase import create_client, Client
from datetime import date, timedelta

# Env variables
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

if not url or not key:
    sys.exit(1)

supabase: Client = create_client(url, key)

def get_pantry_holidays():
    """
    Generates a DataFrame of closure dates for the current year and next year.
    Uses the same logic that was used in the synthetic data generation script.
    """
    today = date.today()
    years = [today.year, today.year + 1]
    holiday_dates = []

    for year in years:
        # Loop through every day of the year to check if it's a closure
        d = date(year, 1, 1)
        end_of_year = date(year, 12, 31)

        while d <= end_of_year:
            m = d.month
            day = d.day
            is_holiday = False
                        
            # Single-day holidays
            if m == 1 and 15 <= day <= 21 and d.weekday() == 0: is_holiday = True # MLK
            elif m == 5 and day >= 25 and d.weekday() == 0: is_holiday = True # Memorial
            elif m == 6 and day == 19: is_holiday = True # Juneteenth
            elif m == 7 and day == 4: is_holiday = True # July 4
            elif m == 9 and day <= 7 and d.weekday() == 0: is_holiday = True # Labor Day
            
            # Winter Break
            elif (m == 12 and day >= 10) or (m == 1 and day < 10):
                is_holiday = True
            
            # Spring Break
            elif m == 3 and 14 <= day <= 23:
                is_holiday = True
            
            # Late Summer Closure
            elif (m == 7 and day >= 30) or (m == 8) or (m == 9 and day <= 1):
                is_holiday = True
            
            # Thanksgiving Break
            elif m == 11 and 23 <= day <= 30:
                is_holiday = True
            
            if is_holiday:
                holiday_dates.append(d)
            
            d += timedelta(days=1)

    return pd.DataFrame({
        'holiday': 'pantry_closed',
        'ds': pd.to_datetime(holiday_dates),
        'lower_window': 0,
        'upper_window': 1,
    })

# Ingestion Part 1: Load synthetic data from CSV
try:
    df_history = pd.read_csv('scripts/historical_data.csv')
    df_history['ds'] = pd.to_datetime(df_history['ds'])
except FileNotFoundError:
    sys.exit(1)

# Ingestion Part 2: Load real data from Supabase
response = supabase.table('appointments').select('appointment_time').execute()

if response.data:
    df_real = pd.DataFrame(response.data)
    df_real['ds'] = pd.to_datetime(df_real['appointment_time'], format='mixed', utc=True).dt.tz_localize(None).dt.normalize()
    # Count appointments per day
    df_real_counts = df_real.groupby('ds').size().reset_index(name='y')

    # Merge synthetic with real; real data overrides synthetic for matching dates (defensive coding)
    df_training = pd.concat([df_history, df_real_counts]).drop_duplicates(subset=['ds'], keep='last')
else:
    df_training = df_history

# Generate holidays dynamically (at runtime), then train Prophet model
dynamic_holidays = get_pantry_holidays()
m = Prophet(holidays=dynamic_holidays, weekly_seasonality=True, yearly_seasonality=True)
m.fit(df_training)

# Make future dataframe for next 2 weeks, then make predictions
future = m.make_future_dataframe(periods=14)
forecast = m.predict(future)

today = pd.Timestamp.now().normalize()
future_days = forecast[forecast['ds'] > today].copy()
future_days['weekday'] = future_days['ds'].dt.dayofweek

try:
    next_tue = future_days[future_days['weekday'] == 1].iloc[0]
    next_sun = future_days[future_days['weekday'] == 6].iloc[0]
except IndexError:
    sys.exit(1)

# Send predictions to Supabase table
predictions = [
    {
        "prediction_date": next_tue['ds'].strftime('%Y-%m-%d'),
        "predicted_count": int(round(next_tue['yhat'])),
        "confidence_lower": int(max(0, round(next_tue['yhat_lower']))),
        "confidence_upper": int(round(next_tue['yhat_upper']))
    },
    {
        "prediction_date": next_sun['ds'].strftime('%Y-%m-%d'),
        "predicted_count": int(round(next_sun['yhat'])),
        "confidence_lower": int(max(0, round(next_sun['yhat_lower']))),
        "confidence_upper": int(round(next_sun['yhat_upper']))
    }
]

# Wipe the old predictions and insert the new ones
supabase.table('predictions').delete().neq('id', '00000000-0000-0000-0000-000000000000').execute()
supabase.table('predictions').insert(predictions).execute()