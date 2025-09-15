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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDataItem {
  product: string;
  total_quantity: number;
}

interface MonthlyChartProps {
  data: ChartDataItem[];
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((d) => d.product),
    datasets: [
      {
        label: "Tổng số lượng sản phẩm",
        data: data.map((d) => d.total_quantity),
        backgroundColor: "#36A2EB", // xanh dương nhạt
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#374151", // chữ legend màu xám đậm
          font: { size: 14, weight: 500 as const },
        },
      },
      title: {
        display: true,
        text: "Tổng sản phẩm tồn kho hàng tháng",
        font: { size: 18, weight: 600 as const },
        color: "#7B68EE", // tiêu đề màu tím
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#374151",
          font: { size: 13 },
        },
        grid: {
          color: "#E5E7EB",
        },
      },
      y: {
        ticks: {
          color: "#374151",
          font: { size: 13 },
        },
        grid: {
          color: "#E5E7EB",
        },
      },
    },
  };

  return (
    <div className="w-full max-w-[900px] mx-auto p-[24px] bg-[#ffffff] rounded-[16px] shadow">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MonthlyChart;
