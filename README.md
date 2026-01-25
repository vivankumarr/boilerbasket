# 🧺 BoilerBasket 

[![Production](https://img.shields.io/badge/status-production-green)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A full-stack visitor management and data analytics platform built for the **ACE Campus Food Pantry** at Purdue University. [BoilerBasket](boilerbasket.com) has replaced the pantry's paper-based operations with a centralized platform that handles student/faculty/staff appointments as well as visitor traffic management and insights for staff.

## What's included?

### Appointment Bookings
- The public-facing landing page (`/src/app/book`) allows visitors of the pantry to schedule pantry visits in advance and receive an instant confirmation email via the [Resend API](https://resend.com). 
- All time slots are validated in real time to prevent overbooking.
- Middleware that ensures strict separation between public and staff routes.

### Day-to-Day Admin Operations
- The admin dashboard (`/admin`) provides pantry staff with control over day-to-day logistics.
  - Secure login handling via [Supabase Auth](https://supabase.com/auth).
  - Full CRUD capabilities (using Next.js Server Actions) for managing appointments as well as client records and history.
  - Automated generation of Excel reports for compliance and  auditing.
  - Interface to manage holiday closures.

### Intelligence & Analytics

We leverage historical data to inform the pantry's restocking schedules and volunteer allocation.
- **Insights Page**
  - Interactive charts (`/admin/insights`) visualizing appointment trends and demographic distributions.
- **Visitor Count Predictions**
  - **Model:** Utilizes Meta's [Prophet](https://facebook.github.io/prophet/) model for time-series forecasting, predicting foot traffic for upcoming weeks, tuned with yearly and weekly seasonality.
  - **Data:** Our pipeline currently merges a synthetic dataset with live appointment data from Supabase, ensuring the model self-corrects as real usage grows. We began with a synthetic dataset due to the lack of long-term data collected by the pantry; this dataset was created using a Python script that took Purdue's academic calendar and the pantry's past visitor trends into account.
  - The script (`predict.py`) handles the full ETL process: fetching data, retraining, generating 60-day forecasts with confidence intervals, and syncing results back to the production database. It runs weekly via a GitHub Actions workflow.

## Architecture

* **Frontend:** [Next.js](https://nextjs.org) (App Router), Tailwind CSS
* **Backend and Authentication:** Supabase
* **Data Science:** Python (Pandas/Prophet) for forecasting
* **CI/CD:** GitHub Actions for automated execution of Prophet pipeline

## Installation

To run BoilerBasket locally:

#### 1. Clone the Repository

```bash
git clone https://github.com/vivankumarr/boilerbasket.git
cd boilerbasket
```

#### 2. Install Dependencies

This project requires Node.js for the application and Python for the prediction script.

```bash
# Install Node dependencies
npm install

# (Optional) Install Python if working with the prediction script
pip install -r scripts/requirements.txt
```

#### 3. Environment Files

Create a `.env.local` file in the root directory.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_key     # If working with Resend emails
```

> [!WARNING]
> **Database Setup Required**
>
> You will have to replicate the database schema in Supabase for the app to function as intended.
>
> <details>
> <summary><strong>Click here for our SQL schema</strong></summary>
>
> ```sql
> create type appointment_status as enum ('Scheduled', 'Completed', 'Cancelled', 'No Show');
>
> create table clients (
>   id uuid default gen_random_uuid() primary key, created_at timestamptz default now(),
>   full_name text not null, email text unique not null, puid text unique not null,
>   role text not null, total_visits int default 0, last_visit date
> );
>
> create table appointments (
>   id uuid default gen_random_uuid() primary key, created_at timestamptz default now(),
>   client_id uuid references clients(id), appointment_time timestamptz not null,
>   status appointment_status default 'Scheduled', check_in_time timestamptz,
>   check_out_time timestamptz, edit_token uuid default gen_random_uuid()
> );
>
> create table predictions (
>   id uuid default gen_random_uuid() primary key, created_at timestamptz default now(),
>   prediction_date date not null, predicted_count int, confidence_lower int, confidence_upper int
> );
>
> create table profiles (
>   id uuid primary key references auth.users(id), email text,
>   role text check (role in ('admin', 'volunteer')), created_at timestamptz default now()
> );
>
> create table blocked_periods (
>   id uuid default gen_random_uuid() primary key, start_date date not null, end_date date not null, reason text
> );
> ```
> </details>

#### 4. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

#### 5. (Optional) Run Predictions

To test the Prophet model locally:

```bash
python3 scripts/predict.py
```

## Contributing

This project was built by a team at Purdue Momentum over the Fall 2025 semester. While it is not currently open for public contribution, we welcome feedback and suggestions via the Issues tab.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
