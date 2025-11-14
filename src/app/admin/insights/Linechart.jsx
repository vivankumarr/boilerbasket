/* This is a template graph for the Linechart visible on the Figma */

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


//template for the data, fill in with actual data from supabase
export const data = {
    labels, 
    datasets: [{
        label: "Visiter Count",
        data: [100, 200, 69],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
    }]
}


export default function Linechart() {
    return (
        <Line data={data}></Line>
    )
}