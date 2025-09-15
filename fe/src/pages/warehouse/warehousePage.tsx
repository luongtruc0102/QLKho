"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../services/api";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

interface SubWarehouseSummary {
  name: string;
  quantity: number;
}

interface WarehouseDisplay {
  warehouse: string;
  total_quantity: number;
  sub_warehouses: SubWarehouseSummary[];
}

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<WarehouseDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const res = await api.get<any[]>("../warehouses/summary");
      const rawData = res.data;

      const grouped: Record<string, WarehouseDisplay> = {};
      rawData.forEach((item: any) => {
        if (!grouped[item.warehouse]) {
          grouped[item.warehouse] = {
            warehouse: item.warehouse,
            total_quantity: Number(item.quantity_in_warehouse),
            sub_warehouses: [],
          };
        }
        grouped[item.warehouse].sub_warehouses.push({
          name: item.sub_name || "Không có kho con",
          quantity: Number(item.quantity_in_sub || 0),
        });
      });

      let filtered = Object.values(grouped);
      if (debouncedSearch.trim() !== "") {
        const keyword = debouncedSearch.toLowerCase();
        filtered = filtered
          .map((w) => ({
            ...w,
            sub_warehouses: w.sub_warehouses.filter((sub) =>
              sub.name.toLowerCase().includes(keyword)
            ),
          }))
          .filter(
            (w) =>
              w.warehouse.toLowerCase().includes(keyword) ||
              w.sub_warehouses.length > 0
          );
      }

      setWarehouses(filtered);
      setCurrentPage(1);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu kho");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, [debouncedSearch]);

  // Pagination
  const totalPages = Math.ceil(warehouses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentWarehouses = warehouses.slice(indexOfFirstItem, indexOfLastItem);

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2);
      if (currentPage > 3) pages.push("...");
      if (currentPage > 2 && currentPage < totalPages - 1) pages.push(currentPage);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages - 1, totalPages);
    }
    return pages;
  };

  if (loading)
    return (
      <p className="text-center text-[#6B7280] mt-[40px] text-[16px] animate-pulse">
        Đang tải dữ liệu...
      </p>
    );

  if (error)
    return (
      <p className="text-center text-[#dc2626] mt-[40px] text-[16px] font-medium">
        {error}
      </p>
    );

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-[32px] font-sans">
      {/* Header */}
      <div className="max-w-[1200px] mx-auto bg-white rounded-[16px] shadow-[0_4px_24px_rgba(123,104,238,0.08)] border border-[#E5E7EB] overflow-hidden">
        <div className="bg-gradient-to-r from-[#7B68EE] to-[#9370DB] px-[32px] py-[24px] flex justify-between items-center">
          <h1 className="text-[#fff] text-[24px] font-[700] flex items-center gap-[8px] m-0 font-arial">
            🏪 Danh sách kho
          </h1>
          <button
            onClick={() => router.push("http://localhost:4000/")}
            className="flex items-center cursor-pointer px-[18px] py-[10px] rounded-[8px] bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#fff] font-[600] text-[15px] shadow-[0_2px_6px_rgba(37,99,235,0.3)] transition-all"
          >
            <ArrowLeft size={20} className="mr-[6px]" /> Quay lại Dashboard
          </button>
        </div>

        {/* Search */}
        <div className="p-[24px] border-b border-[#E5E7EB] flex gap-[12px]">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm kho hoặc kho con..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[44px] px-[16px] text-[14px] rounded-[8px] border border-[#D1D5DB] focus:border-[#7B68EE] focus:ring-[1px] focus:ring-[#7B68EE] outline-none shadow-sm transition"
          />
          <button
            onClick={() => setSearch("")}
            className="px-[16px] py-[10px] bg-[#ef4444] hover:bg-[#dc2626] text-[#fff] flex items-center cursor-pointer rounded-[8px] text-[14px] font-[500] transition"
          >
            <X size={20} /> Reset
          </button>
        </div>

        {/* Table */}
        <div className="p-[24px]">
          <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_4px_rgba(37,99,235,0.08)]">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6]">
                  <th className="px-[24px] py-[16px] text-left text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#2563eb4D]">
                    🏬 Kho
                  </th>
                  <th className="px-[24px] py-[16px] text-center text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#2563eb4D]">
                    📊 Tổng số lượng
                  </th>
                  <th className="px-[24px] py-[16px] text-left text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#2563eb4D]">
                    📦 Kho con
                  </th>
                  <th className="px-[24px] py-[16px] text-center text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#2563eb4D]">
                    🔢 SL sản phẩm kho con
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentWarehouses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-[24px] py-[16px] text-center text-[#6B7280]"
                    >
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  currentWarehouses.map((w) =>
                    w.sub_warehouses.map((sub, idx) => (
                      <tr
                        key={w.warehouse + idx}
                        className="border-b border-[#F3F4F6] hover:bg-gradient-to-r hover:from-[#EEF2FF] hover:to-[#F3E8FF] transition"
                      >
                        <td className="px-[24px] py-[14px] text-[#1F2937] font-[500]">
                          {w.warehouse}
                        </td>
                        <td className="px-[24px] py-[14px] text-center text-[#1e3a8a] font-[600]">
                          {w.total_quantity}
                        </td>
                        <td className="px-[24px] py-[14px] text-[#374151]">
                          <span className="inline-flex items-center px-[12px] py-[4px] rounded-full text-[13px] font-[500] bg-[#ede9fe] text-[#7B68EE]">
                            {sub.name}
                          </span>
                        </td>
                        <td className="px-[24px] py-[14px] text-center text-[#059669] font-[600]">
                          {sub.quantity}
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-[32px] flex items-center justify-center gap-[12px]">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-[16px] py-[10px] flex items-center gap-[5px] rounded-[8px] text-[14px] font-[500] bg-[#7B68EE] text-[#fff] transition-all duration-200
                  ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#6A5ACD] cursor-pointer"
                  }`}
              >
                <ArrowLeft size={18} /> Trang trước
              </button>

              {renderPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span key={i} className="px-[12px] text-[#9CA3AF]">
                    ...
                  </span>
                ) : (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(page as number)}
                    className={`w-[40px] h-[40px] rounded-[8px] text-[14px] font-[600] transition-all duration-200
                      ${
                        currentPage === page
                          ? "bg-[#7B68EE] text-[#fff] shadow-lg"
                          : "bg-[#fff] text-[#4B5563] border border-[#D1D5DB] hover:bg-[#F5F3FF] hover:border-[#7B68EE]"
                      }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-[16px] py-[10px] flex items-center gap-[5px] rounded-[8px] text-[14px] font-[500] bg-[#7B68EE] text-[#fff] transition-all duration-200
                  ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#6A5ACD] cursor-pointer"
                  }`}
              >
                Trang sau <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
