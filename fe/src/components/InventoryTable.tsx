import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

interface InventoryItem {
  product: string;
  warehouse: string;
  quantity: number;
}

interface InventoryTableProps {
  data: InventoryItem[];
  rowsPerPage?: number;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  data,
  rowsPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState("");
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleJump = () => {
    const page = parseInt(jumpPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setJumpPage("");
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pageNumbers.push(i);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) pageNumbers.push(i);
      }
    }

    return pageNumbers.map((num, idx) => (
      <button
        key={idx}
        onClick={() => handlePageChange(Number(num))}
        className={`w-[40px] h-[40px] rounded-[8px] text-[14px] font-[600] transition-all duration-200
          ${
            Number(num) === currentPage
              ? "bg-[#7B68EE] text-[#fff] shadow-lg"
              : "bg-[#fff] text-[#4B5563] border border-[#D1D5DB] hover:bg-[#F5F3FF] hover:border-[#7B68EE]"
          }`}
        style={{
          marginLeft: idx === 0 ? 0 : 4,
          marginRight: 4,
        }}
      >
        {num}
      </button>
    ));
  };

  return (
    <div className="max-w-[1200px] mx-auto bg-white rounded-[16px] shadow-[0_4px_24px_0_rgba(123,104,238,0.08)] border border-[#E5E7EB] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7B68EE] to-[#9370DB] px-[32px] py-[24px]">
        <h1 className="text-[#fff] text-[24px] font-[700] text-center m-0 font-arial">📦 Quản Lý Kho Hàng</h1>
      </div>

      {/* Table Container */}
      <div className="p-[32px]">
        <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_4px_0_rgba(123,104,238,0.04)]">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6]">
                <th className="px-[24px] py-[16px] text-left text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                  🏷️ Sản phẩm
                </th>
                <th className="px-[24px] py-[16px] text-left text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                  🏪 Kho
                </th>
                <th className="px-[24px] py-[16px] text-center text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                  📊 Số lượng
                </th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, idx) => (
                <tr
                  key={startIndex + idx}
                  className="border-b border-[#F3F4F6] transition-all cursor-pointer hover:bg-gradient-to-r hover:from-[#EEF2FF] hover:to-[#F3E8FF]"
                >
                  <td className="px-[24px] py-[16px] text-[#1F2937] font-[500]">{item.product}</td>
                  <td className="px-[24px] py-[16px] text-[#4B5563]">
                    <span className="inline-flex items-center px-[12px] py-[4px] rounded-full text-[14px] font-[500] bg-[#ede9fe] text-[#7B68EE]">
                      {item.warehouse}
                    </span>
                  </td>
                  <td className="px-[24px] py-[16px] text-center">
                    <span className="inline-flex items-center justify-center w-[48px] h-[32px] rounded-[8px] bg-[#D1FAE5] text-[#065F46] font-[500] text-[14px]">
                      {item.quantity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-[32px] flex flex-col items-center gap-[24px]">
            {/* Navigation buttons and page numbers */}
            <div className="flex items-center justify-center gap-[8px]">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center gap-[8px] px-[16px] py-[12px] bg-[#7B68EE] text-[#fff] rounded-[8px] font-[500] text-[14px] border-0 transition-all duration-200
                  ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#6A5ACD] cursor-pointer"}`}
              >
                <ChevronLeft className="w-[16px] h-[16px]" />
                Trang trước
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-[8px] px-[16px] py-[12px] bg-[#7B68EE] text-[#fff] rounded-[8px] font-[500] text-[14px] border-0 transition-all duration-200
                  ${currentPage === totalPages ? "opacity-[50%] cursor-not-allowed" : "hover:bg-[#6A5ACD] cursor-pointer"}`}
              >
                Trang sau
                <ChevronRight className="w-[16px] h-[16px]" />
              </button>
            </div>

            {/* Jump to page */}
            <div className="flex items-center gap-[12px]">
              <span className="text-[#4B5563] font-[500] text-[14px]">Đến trang</span>
              <input
                type="number"
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") handleJump();
                }}
                className="w-[80px] h-[40px] text-[16px] text-center border-2 border-[#D1D5DB] rounded-[8px] focus:border-[#7B68EE] focus:outline-none transition-all duration-200"
                min={1}
                max={totalPages}
                placeholder="1"
              />
              <button
                onClick={handleJump}
                className="px-[20px] py-[12px] bg-[#059669] text-[#fff] rounded-[8px] font-[500] text-[14px] transition-all duration-200 hover:bg-[#047857]"
              >
                Đi
              </button>
            </div>

            {/* Page info */}
            <div className="text-[#6B7280] text-[12px]">
              Trang {currentPage} / {totalPages} • Tổng {data.length} sản phẩm
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryTable;
