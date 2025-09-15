"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface MonthlyReport {
  month: number;
  total_quantity: number;
}

export default function MonthlyReportPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [stockInReport, setStockInReport] = useState<MonthlyReport[]>([]);
  const [stockOutReport, setStockOutReport] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReports();
  }, [year]);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const [inRes, outRes] = await Promise.all([
        axios.get<MonthlyReport[]>(`http://localhost:4001/stock-in/report/monthly?year=${year}`),
        axios.get<MonthlyReport[]>(`http://localhost:4001/stock-out/report/monthly?year=${year}`),
      ]);
      setStockInReport(inRes.data);
      setStockOutReport(outRes.data);
    } catch (err: any) {
      setError(err.message || "Lỗi khi lấy dữ liệu báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const chartData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const inQty = stockInReport.find((r) => r.month === month)?.total_quantity || 0;
    const outQty = stockOutReport.find((r) => r.month === month)?.total_quantity || 0;
    return {
      month: `Tháng ${month}`,
      Nhập: inQty,
      Xuất: outQty,
      difference: inQty - outQty,
    };
  });

  const totalIn = chartData.reduce((acc, cur) => acc + cur.Nhập, 0);
  const totalOut = chartData.reduce((acc, cur) => acc + cur.Xuất, 0);
  const totalDiff = totalIn - totalOut;

  // Màu nhạt hơn cho các cột bảng
  const inBg = "bg-[#bbf7d0]"; // xanh lá nhạt
  const inText = "text-[#16a34a]";
  const outBg = "bg-[#fecaca]"; // đỏ nhạt
  const outText = "text-[#dc2626]";
  const diffBg = "bg-[#dbeafe]"; // xanh dương nhạt
  const diffText = "text-[#2563eb]";

  return (
    <div className="p-[30px] font-sans">
      <h1 className="text-[28px] mb-[20px] font-[700]">
        📊 Báo cáo nhập/xuất theo tháng - {year}
      </h1>

      {/* Button quay về */}
      <button
        onClick={() => (window.location.href = "http://localhost:4000/")}
        className="mb-[20px] px-[16px] py-[10px] bg-[#2563eb] text-[#fff] rounded-[6px] border-0 text-[14px] cursor-pointer hover:bg-[#1d4ed8] transition"
      >
        ⬅️ Quay về trang chủ
      </button>

      <div className="mb-[20px]">
        <label className="mr-[10px] font-[600]">Chọn năm:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-[12px] py-[6px] rounded-[6px] border border-[#ccc] w-[100px]"
        />
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p className="text-[#dc2626]">{error}</p>}

      {!loading && !error && (
        <>
          {/* Summary Cards */}
          <div className="flex gap-[20px] mb-[30px]">
            <div className="flex-1 bg-[#16a34a] text-[#fff] p-[20px] rounded-[12px]">
              <p className="font-[500]">Tổng nhập</p>
              <p className="text-[24px] font-[700]">{totalIn}</p>
            </div>
            <div className="flex-1 bg-[#dc2626] text-[#fff] p-[20px] rounded-[12px]">
              <p className="font-[500]">Tổng xuất</p>
              <p className="text-[24px] font-[700]">{totalOut}</p>
            </div>
            <div className="flex-1 bg-[#2563eb] text-[#fff] p-[20px] rounded-[12px]">
              <p className="font-[500]">Chênh lệch</p>
              <p className="text-[24px] font-[700]">{totalDiff}</p>
            </div>
          </div>

          {/* Bảng dữ liệu */}
          <div className="overflow-x-auto mb-[40px]">
            <table className="w-full border-collapse text-center shadow-md">
              <thead className="bg-[#f3f4f6]">
                <tr>
                  <th className="px-[12px] py-[12px] font-[600]">Tháng</th>
                  <th className={`px-[12px] py-[12px] ${inBg} ${inText} font-[600]`}>
                    Nhập
                  </th>
                  <th className={`px-[12px] py-[12px] ${outBg} ${outText} font-[600]`}>
                    Xuất
                  </th>
                  <th className={`px-[12px] py-[12px] ${diffBg} ${diffText} font-[600]`}>
                    Chênh lệch
                  </th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((d, idx) => (
                  <tr
                    key={d.month}
                    className={idx % 2 === 0 ? "bg-[#f9fafb]" : "bg-[#ffffff]"}
                  >
                    <td className="px-[12px] py-[12px] font-[600]">{d.month}</td>
                    <td className={`px-[12px] py-[12px] ${inText} font-[500]`}>
                      {d.Nhập}
                    </td>
                    <td className={`px-[12px] py-[12px] ${outText} font-[500]`}>
                      {d.Xuất}
                    </td>
                    <td className={`px-[12px] py-[12px] font-[600]`}>
                      {d.difference > 0
                        ? <span className="text-[#16a34a]">↗️ {Math.abs(d.difference)}</span>
                        : d.difference < 0
                        ? <span className="text-[#dc2626]">↘️ {Math.abs(d.difference)}</span>
                        : <span className={diffText}>➡️ {Math.abs(d.difference)}</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Biểu đồ cột */}
          <h2 className="mb-[20px] text-[20px] font-[600]">
            📊 Biểu đồ nhập/xuất theo tháng
          </h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend verticalAlign="top" />
              <Bar dataKey="Nhập" fill="#16a34a" />
              <Bar dataKey="Xuất" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
