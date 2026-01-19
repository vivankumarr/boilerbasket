'use client';

import { useRef } from 'react';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function PredictionLineChart ({arrangement}) {
    const chartRef = useRef(null);

    const labels = arrangement.label.slice(0, 12);
    const lower = arrangement.lower.slice(0, 12);
    const upper = arrangement.upper.slice(0, 12);
    const actual = arrangement.actual.slice(0, 12);

    const data = {
        labels,
        datasets: [{
            label: 'Lower Bound',
            data: upper,
            borderColor: 'rgba(179, 128, 255, 0.3)',
            backgroundColor: 'rgba(179, 128, 255, 0.1)',
            borderWidth: 1,
            pointRadius: 0,
            fill: '+1',
            order: 2,
        },
        {
            label: 'Upper Bound',
            data: lower,
            borderColor: 'rgba(179, 128, 255, 0.3)',
            backgroundColor: 'rgba(179, 128, 255, 0.1)',
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            order: 2,
        },
        {
            label: 'Predicted Visitors',
            data: actual,
            borderColor: 'rgb(179, 128, 255)',
            backgroundColor: 'rgba(179, 128, 255, 1)',
            borderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.2,
            fill: false,
            order: 1,
        }

    ]}

    const options = {
        plugins: {
            title : {
                display: true,
                text: 'Predicted # of Visitors for Next 12 Days',
                font: {
                    size: 20,
                    family: "Inter"
                },
                padding: {
                    left: 100,
                    bottom: 20,
                },

            },
            legend: {
                display: true,
                position: 'bottom',
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Date",
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Predicted Frequency"
                }
            }
        },
    }

    return ( <Line ref = {chartRef} data = {data} options = {options}></Line>)
}