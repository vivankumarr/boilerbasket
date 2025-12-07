/* This is a template graph for the Linechart visible on the Figma */

'use client';

import { useRef } from 'react';

//necessary imports (don't change)
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

//maybe make the data be visible for only the next couple of months
const labels = ['January', 'February', 'March'];




export default function Linechart({ordering}) {
    const chartRef = useRef(null);

    const labels = ordering.month;
    const actual_data = ordering.month_data;

    const data = {
        labels, 
        datasets: [{
            label: "Visiter Count",
            data: [12, 14, 16, 44, 31, 5, 16, 7, 88, 18, 25, 65],
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            cubicInterpolationMode: 'monotone'
        }]
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false, 
    }

    return (
        <Line ref = {chartRef}data={data} options = {options}></Line>
    )
}