'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { useRef } from "react";
ChartJS.register(ArcElement, Tooltip, Legend, Title);

//optional options if you'd like :)
export const options = {
    plugins: {
        title: {
            display: true,
            text: 'Client Distribution',
        }
    }
}

export default function Piechart ({q_data}) {
    const chartRef = useRef(null);

    let data = {
        labels: ['Student', 'Staff', 'Faculty'],
        datasets: [{
            data: q_data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(245, 139, 73, 0.5)',
                'rgba(78, 242, 187, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(245, 139, 73, 0.8)',
                'rgba(78, 242, 187, 0.8)',
            ],
            borderWidth: 2,
        }]
    };

    const options = {
        reponsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: "Client Role Distribution",
                font: {
                    size: 20,
                    family: "Inter",
                },
                padding: {
                    left: 100,
                    bottom: 20,
                },
            },
            legend: {
                display:true,
                position: 'bottom',
            }
        }
    }

    return (
        <Doughnut ref = {chartRef} data={data} options={options}/>
    )
}