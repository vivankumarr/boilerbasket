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






export default function Linechart({ordering}) {

    const chartRef = useRef(null);

    const labels = ordering.month;

    const canceledData = ordering.canceled;
    const completedData = ordering.completed;
    const totalData = ordering.total;

    const data = {
        labels, 
        datasets: [{
            label: "Completed",
            data: completedData,
            fill: true,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.2,
        },
        {
            label: "Canceled",
            data: canceledData,
            fill: true,
            borderColor: 'rgb(245, 139, 73)',
            backgroundColor: 'rgba(245, 139, 73, 0.2)',
            tension: 0.2,
        },
        {
            label: "Total",
            data: totalData,
            fill: true,
            borderColor: 'rgb(78, 242, 187)',
            backgroundColor: 'rgba(78, 242, 187, 0.2)',
            tension: 0.2,
        }
    ]
    }

    const options = {
        plugins: {
            title : {
                display: true,
                text: 'Appointment Trends for the Last 12 Months',
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
                    text: "Month",
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Frequency"
                }
            }
        },
        animations: {
            tension: {
              duration: 1000,
              easing: 'linear',
              from: 0.3,
              to: 0.2,
              loop: true
            }
        },
    }

    return (
        <Line ref = {chartRef} data = {data} options = {options}></Line>
    )
}