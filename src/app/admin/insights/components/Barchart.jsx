import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const labels = ['1', '2-3', '4-7', '8-15', '15+'];
const data = {
  labels,
  datasets: [
    {
      label: "Dataset",
      data: [65, 42, 33, 12, 15],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(201, 203, 207, 0.2)",
      ],
      borderColor: [
        "rgb(255, 99, 132)",
        "rgb(255, 159, 64)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(54, 162, 235)",
        "rgb(153, 102, 255)",
        "rgb(201, 203, 207)",
      ],
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false, 
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
      text: "blahblahblah",
    },
  },
  scales: {
    x: {
        title: {
            display: true,
            text: "Number of Visits"

        }
    },
    y: {
        title: {
            display: true,
            text: "Number of Clients"

        }

    }
  }
};

export default function BarChart() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Bar data={data} options={options} />
    </div>
  );
}