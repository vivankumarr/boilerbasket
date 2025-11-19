"use client";
import { useState } from "react";

import "@/app/globals.css";
import { CalendarCheck2Icon, Settings2Icon, InfoIcon, DownloadIcon } from "lucide-react";

// https://react-spectrum.adobe.com/react-aria/DateRangePicker.html
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Button,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DateRangePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Label,
  Popover,
  RangeCalendar
} from "react-aria-components";

const contentDiv = 'h-full p-2 overflow-scroll \
					mx-[10px]' // + ' justify-center grid grid-rows-2'
const cardDiv = 'bg-white m-4 p-2 \
				border rounded-md'

// const cardDiv = 'm-0 pt-4 pb-0 \
// 				flex flex-wrap \
// 				items-center \
// 				justify-evenly' // + ' bg-gray-100 border border-gray-400'
// https://preline.co/docs/tables.html
// const CustomDatePicker = () => {
//   const [startDate, setStartDate] = useState(new Date());
//   return <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />;
// };

// TODO: Add options to clear all, select all
/* Checkbox functional component */
function Checkbox({ label }) {
	// Set as checked by default
	const [isChecked, setChecked] = useState(true);

	const handleChange = () => {
		setChecked(!isChecked);
	}

	return (
		<label className='flex gap-2 ml-1 mr-2 checkbox select-none'>
			<input
				type='checkbox'
				checked={isChecked}
				onChange={handleChange}
			/>
			<span>{label}</span>
		</label>
	);
}

const page = () => {
	return (
		<div className={`${contentDiv}`}>
			{/* Start Export by Time Period */}
			<div className={`${cardDiv} grid w-[380px]`}>
				<select className='border border-gray-400 mb-1.5 \
					  bg-white font-bold \
						text-xl w-[165px]' 
						defaultValue='This Week'>
					<option>Today</option>
					<option>This Week</option>
					<option>This Month</option>
					<option>Past 6 Months</option>
					<option>Past Year</option>
					<option>All Time</option>
				</select>
				<div className='flex relative ml-1'>
					<span className='text-sm'>
						<span className='font-semibold text-red-500'>
							NUM
						</span> appointments from <span className='italic font-medium'>
							Oct 6 - 12, 2025
						</span>
					</span>
					<CalendarCheck2Icon 
						className='bg-fuchsia-100 size-12 p-2 rounded-md \
									absolute right-0 bottom-1.5'
					/>
				</div>
				
				<div className='bg-yellow-500 text-white border rounded-sm \
								flex items-center justify-center gap-2 p-1 mt-2 \
								w-[180px]'>
					<DownloadIcon />
					<span>Download Excel</span>
				</div>
			</div> {/* End Export by Time Period */}

			{/* Start Custom Export */}
			<div className='rounded-lg bg-white \
							m-4 [&>*]:px-2 w-300px \
							border [&>div]:py-2'>
				<div className='flex gap-2 pb-2 border-b'>
					<Settings2Icon
						className='bg-blue-200 mt-1 size-10 rounded-md shadow-xs'
					/>
					<div className='grid'>
						<span className='font-bold'>Custom Export</span>
						<span className='text-sm'>Customize your export parameters</span>
					</div>
				</div> {/* Custom Export Header */}

				<div className='bg-red-100'>
					<DateRangePicker>
						<Label className='font-bold'>Date Range</Label>
						<Group className='border w-58 flex gap-1 text-gray-600 border-black'>
							<DateInput slot="start">
								{(segment) => <DateSegment segment={segment} />}
							</DateInput>
							<span aria-hidden="true">–</span>
							<DateInput slot="end">
								{(segment) => <DateSegment segment={segment} />}
							</DateInput>
							<Button>
								<ChevronDown size={20} />
							</Button>
						</Group>
						<Popover>
							<Dialog>
								<RangeCalendar className='bg-white border'>
									<header>
										<Button slot="previous">
											<ChevronLeft size={20} />
										</Button>
										<Heading />
										<Button slot="next">
											<ChevronRight size={20} />
										</Button>
									</header>
									<CalendarGrid>
										{(date) => <CalendarCell date={date} />}
									</CalendarGrid>
								</RangeCalendar>
							</Dialog>
						</Popover>
					</DateRangePicker>
				</div> {/* Select Date Range */}

				<div className=''>
					<label className='font-bold'>Client Role</label>
					<div>
						<select className='border border-black bg-white text-gray-600'>
							<option>All Roles</option>
							<option>Student</option>
							<option>Faculty</option>
							<option>Staff</option>
						</select>
					</div>
				</div> {/* Select Client Role */}

				<table className='table-fixed border-separate'>
					<thead>
						<tr className='font-bold text-left'>
							<th colSpan='4'>Include Fields</th>
						</tr>
					</thead>
					<tbody className=''>
						<tr>
							<td>
								<Checkbox
									label='Client Name' 
								/>
							</td>
							<td>
								<Checkbox
									label='Email' 
								/>
							</td>
							<td>
								<Checkbox
									label='PUID' 
								/>
							</td>
							<td>
								<Checkbox
									label='Role' 
								/>
							</td>
						</tr>
						<tr>
							<td>
								<Checkbox
									label='Appointment Date' 
								/>
							</td>
							<td>
								<Checkbox
									label='Time Slot' 
								/>
							</td>
							<td>
								<Checkbox
									label='Status' 
								/>
							</td>
						</tr>
					</tbody>
				</table>

				<div className='bg-red-100 border-b'>
					TODO: Select Export Format?
				</div>
				
				<div className='flex items-center relative gap-2 my-1'>
					<InfoIcon />
					<span>Estimated Records: <span className='font-semibold text-red-500'>NUM</span> Appointments</span>
					<div className='bg-emerald-700 text-white rounded-sm \
									flex items-center justify-center gap-2 p-1 \
									absolute right-2
									w-[150px]'>
						<DownloadIcon />
						<span>Export (.xlsx)</span>
						{/* TODO: Make sure button doesn't cover text when resizing screen */}
					</div>
				</div>
			</div> {/* End Custom Export */}
		</div> // contentDiv
	)
};

export default page;