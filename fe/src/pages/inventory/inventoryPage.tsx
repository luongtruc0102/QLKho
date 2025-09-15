"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllInventory } from "../../services/inventoryService";
import { InventoryItem } from "../../types";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

const InventoryPage = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [gotoPage, setGotoPage] = useState("");
  const itemsPerPage = 10;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawData: InventoryItem[] = await getAllInventory();
        setInventory(rawData);
      } catch (error) {
        console.error("Lỗi khi load tồn kho:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <p className="text-center text-[#6B7280] mt-[40px] text-[16px] animate-pulse">
        Đang tải dữ liệu...
      </p>
    );

  const filteredData = inventory.filter(
    (item) =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleGotoPage = () => {
    const pageNum = parseInt(gotoPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
    setGotoPage("");
  };

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

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-[32px] font-sans">
      {/* Header */}
      <div className="max-w-[1200px] mx-auto bg-white rounded-[16px] shadow-[0_4px_24px_rgba(123,104,238,0.08)] border border-[#E5E7EB] overflow-hidden">
        <div className="bg-gradient-to-r from-[#7B68EE] to-[#9370DB] px-[32px] py-[24px] flex justify-between items-center">
          <h1 className="text-[#fff] text-[24px] font-[700] flex items-center gap-[8px] m-0 font-arial">
            📦 Tồn kho
          </h1>
          <button
            onClick={() => router.push("http://localhost:4000/")}
            className="flex items-center cursor-pointer px-[18px] py-[10px] rounded-[8px] bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#ffffff] font-[600] text-[15px] shadow-[0_2px_6px_rgba(123,104,238,0.3)] transition-all"
            >
            <ArrowLeft size={20} className="mr-[6px] text-[#ffffff]"/> Quay lại trang chủ
          </button>
        </div>

        {/* Search */}
        <div className="p-[24px] border-b border-[#E5E7EB] flex gap-[10px]">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm sản phẩm hoặc kho..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-[44px] px-[16px] text-[14px] rounded-[8px] border border-[#D1D5DB] focus:border-[#7B68EE] focus:ring-[1px] focus:ring-[#7B68EE] outline-none shadow-sm transition"
          />
          <button
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="px-[16px] py-[10px] bg-[#ef4444] hover:bg-[#dc2626] text-[#fff] flex items-center cursor-pointer rounded-[8px] text-[14px] font-[500] transition"
          >
            <X size={20}/> Reset
          </button>
        </div>

        {/* Table */}
        <div className="p-[24px]">
          <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_4px_rgba(123,104,238,0.04)]">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6]">
                  <th className="px-[24px] py-[16px] text-left text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                    🏷️ Tên sản phẩm
                  </th>
                  <th className="px-[24px] py-[16px] text-left text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                    🏪 Kho
                  </th>
                  <th className="px-[24px] py-[16px] text-center text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                    📊 Số lượng hiện có
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((item, index) => {
                    let color = "text-[#065F46] bg-[#D1FAE5]";
                    let icon = "✅";

                    if (item.quantity === 0) {
                      color = "text-[#B91C1C] bg-[#FEE2E2]";
                      icon = "❌";
                    } else if (item.quantity < 50) {
                      color = "text-[#92400E] bg-[#FEF3C7]";
                      icon = "⚠️";
                    }

                    return (
                      <tr
                        key={index}
                        className="border-b border-[#F3F4F6] transition-all hover:bg-gradient-to-r hover:from-[#EEF2FF] hover:to-[#F3E8FF]"
                      >
                        <td className="px-[24px] py-[16px] text-[#1F2937] font-[500]">
                          {item.product}
                        </td>
                        <td className="px-[24px] py-[16px]">
                          <span className="inline-flex items-center px-[12px] py-[4px] rounded-full text-[14px] font-[500] bg-[#ede9fe] text-[#7B68EE]">
                            {item.warehouse}
                          </span>
                        </td>
                        <td className="px-[24px] py-[16px] text-center">
                          <span
                            className={`inline-flex items-center justify-center min-w-[60px] h-[32px] rounded-[8px] text-[14px] font-[500] ${color}`}
                          >
                            {item.quantity} {icon}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-[24px] py-[16px] text-center text-[#6B7280]"
                    >
                      Không có dữ liệu tồn kho
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-[32px] flex flex-col items-center gap-[24px]">
              {/* Page numbers */}
              <div className="flex items-center gap-[8px]">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-[16px] py-[12px] flex items-center rounded-[8px] text-[14px] font-[500] bg-[#7B68EE] text-[#fff] transition-all duration-200 
                    ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#6A5ACD] cursor-pointer"}`}
                >
                  <ArrowLeft size={18}/> Trang trước
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
                  className={`px-[16px] py-[12px] flex items-center rounded-[8px] text-[14px] font-[500] bg-[#7B68EE] text-[#fff] transition-all duration-200 
                    ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#6A5ACD] cursor-pointer"
                    }`}
                >
                  Trang sau <ArrowRight size={18}/>
                </button>
              </div>

              {/* Go to page */}
              <div className="flex items-center gap-[12px]">
                <span className="text-[#4B5563] font-[500] text-[14px]">
                  Đến trang
                </span>
                <input
                  type="number"
                  value={gotoPage}
                  onChange={(e) => setGotoPage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleGotoPage();
                  }}
                  className="w-[80px] h-[40px] text-[16px] text-center border-2 border-[#D1D5DB] rounded-[8px] focus:border-[#7B68EE] focus:outline-none transition-all duration-200"
                  min={1}
                  max={totalPages}
                  placeholder="1"
                />
                <button
                  onClick={handleGotoPage}
                  className="px-[20px] py-[12px] bg-[#059669] text-[#fff] rounded-[8px] font-[500] text-[14px] transition-all duration-200 hover:bg-[#047857]"
                >
                  Đi
                </button>
              </div>

              {/* Page info */}
              <div className="text-[#6B7280] text-[12px]">
                Trang {currentPage} / {totalPages} • Tổng {filteredData.length} sản phẩm
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
