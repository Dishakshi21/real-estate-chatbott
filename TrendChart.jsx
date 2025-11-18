import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function TrendChart({ chartData }) {
  if (!chartData || !chartData.labels) return null;

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Avg Price",
        data: chartData.price,
        tension: 0.3,
        borderColor: "blue",
        backgroundColor: "lightblue",
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: { mode: "index", intersect: false },
    scales: { y: { beginAtZero: false } },
  };

  return (
    <div style={{ height: 320 }}>
      <Line data={data} options={options} />
    </div>
  );
}
