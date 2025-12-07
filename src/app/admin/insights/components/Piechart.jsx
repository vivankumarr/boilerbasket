'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
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
                'rgba(255, 99, 132, 0.2)',
                'rgba(245, 139, 73, 0.2)',
                'rgba(78, 242, 187, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 132, 0.2)',
                'rgba(255, 99, 132, 0.2)',
            ],
            borderWidth: 1,
        }]
    };

    const options = {
        reponsive: true,
        maintainAspectRatio: false,
    }

    return (
        <Doughnut ref = {chartRef} data={data} options={options}/>
    )
}