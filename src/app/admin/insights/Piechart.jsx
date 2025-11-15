import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export const data = {
    labels: ['Student', 'Staff', 'Other'],
    datasets: [{
        data: [300, 100, 200],
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

//optional options if you'd like :)
export const options = {
    plugins: {
        title: {
            display: true,
            text: 'Client Distribution',
        }
    }
}

export default function Piechart () {
    return (
        <Doughnut data={data}/>
    )
}