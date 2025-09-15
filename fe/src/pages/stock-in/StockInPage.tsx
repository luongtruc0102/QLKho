"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

export interface StockInItem {
  stock_in_id: number;
  product: string;
  warehouse: string | null;
  quantity: number;
  date_in: string;
  manufacturer: string | null;
  note: string;
}

export default function StockInPage() {
  const router = useRouter();
  const [stockIns, setStockIns] = useState<StockInItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [sort, setSort] = useState<"asc" | "desc">("desc");

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchStockIns = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4001/stock-in?search=${debouncedSearch}&sort=${sort}`
      );
      if (!res.ok) throw new Error("Failed to fetch data");
      const data: StockInItem[] = await res.json();
      setStockIns(data);
      setCurrentPage(1); // reset page khi search/sort
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockIns();
  }, [debouncedSearch, sort]);

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa phiếu nhập này?")) return;

    const res = await fetch(`http://localhost:4001/stock-in/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      alert("Xóa thất bại");
    } else {
      setStockIns(stockIns.filter((s) => s.stock_in_id !== id));
    }
  };

  // Phân trang logic
  const totalPages = Math.ceil(stockIns.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStockIns = stockIns.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-[36px] h-[36px] flex items-center justify-center rounded-[8px] transition-all ${
            i === currentPage
              ? "bg-[#7B68EE] text-[#ffffff] font-[600]"
              : "text-[#333333] font-[500] hover:bg-[#F3E8FF] hover:text-[#7B68EE]"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  if (loading) return <p className="p-[12px] text-[16px] text-[#333333]">Loading...</p>;
  if (error) return <p className="p-[12px] text-[16px] text-[#ff0000]">Error: {error}</p>;

  return (
    <div className="container min-h-screen flex flex-col mb-[10px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7B68EE] to-[#9370DB] rounded-[16px] shadow-[0_4px_20px_rgba(123,104,238,0.15)] mb-[32px]">
        <h1
          className="text-center text-[28px] font-[800] py-[24px] text-[#ffffff] tracking-[1px]"
          style={{ fontFamily: "'Montserrat', 'Segoe UI', Arial, sans-serif" }}
        >
          📥 Quản lý phiếu nhập
        </h1>
      </div>

      {/* Search & Sort & Add */}
      <div className="flex gap-[20px] mb-[20px]">
        <input
          type="text"
          placeholder="🔍 Tìm kiếm..."
          className="px-[20px] py-[10px] text-[16px] font-[400] text-[#222222] outline-none rounded-[8px] border border-[#E5E7EB] focus:ring-[3px] focus:ring-[#7B68EE] flex-1 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="px-[16px] py-[10px] text-[16px] font-[500] text-[#333333] outline-none cursor-pointer rounded-[8px] border border-[#E5E7EB] focus:ring-[3px] focus:ring-[#7B68EE] shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
          onChange={(e) => setSort(e.target.value as "asc" | "desc")}
        >
          <option value="desc">⬇️ Mới nhất</option>
          <option value="asc">⬆️ Cũ nhất</option>
        </select>
        <button
          className="flex items-center px-[18px] py-[10px] rounded-[8px] bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#ffffff] font-[600] text-[15px] shadow-[0_2px_6px_rgba(123,104,238,0.3)] transition-all"
          onClick={() => router.push("create")}
        >
          <Plus size={20} className="mr-[6px] text-[#ffffff]" /> Thêm phiếu nhập
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#ffffff] rounded-[16px] border border-[#E5E7EB] shadow-[0_4px_16px_rgba(0,0,0,0.05)] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6]">
              <th className="px-[16px] py-[14px] text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D] w-[6%]">
                🆔 ID
              </th>
              <th className="px-[16px] py-[14px] text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D] w-[18%]">
                🏷️ Sản phẩm
              </th>
              <th className="px-[16px] py-[14px] text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D] w-[12%]">
                🏬 Kho
              </th>
              <th className="px-[16px] py-[14px] text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D] w-[10%]">
                📊 Số lượng
              </th>
              <th className="px-[16px] py-[14px] text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D] w-[16%]">
                📅 Ngày nhập
              </th>
              <th className="px-[16px] py-[14px] text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D] w-[14%]">
                🏭 Nhà sản xuất
              </th>
              <th className="px-[16px] py-[14px] text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D] w-[14%]">
                📝 Ghi chú
              </th>
              <th className="px-[16px] py-[14px] text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D] w-[10%]">
                ⚙️ Hành động
              </th>
            </tr>
          </thead>
          <tbody className="text-[14px] font-[400] text-[#222222]">
            {currentStockIns.map((s) => (
              <tr
                key={s.stock_in_id}
                className="border-b border-[#F3F4F6] transition-all hover:bg-gradient-to-r hover:from-[#EEF2FF] hover:to-[#F3E8FF]"
              >
                <td className="text-center px-[16px] py-[12px] font-[500]">{s.stock_in_id}</td>
                <td className="px-[16px] py-[12px] font-[500]">{s.product}</td>
                <td className="px-[16px] py-[12px]">{s.warehouse ?? "-"}</td>
                <td className="text-center px-[16px] py-[12px]">
                  <span className="inline-flex items-center justify-center w-[48px] h-[28px] rounded-[8px] bg-[#FDE68A] text-[#92400E] font-[500] text-[14px]">
                    {s.quantity}
                  </span>
                </td>
                <td className="px-[16px] py-[12px] text-[#4B5563] font-[500] text-[14px]">
                  {new Date(s.date_in).toLocaleDateString("vi-VN")} •{" "}
                  {new Date(s.date_in).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-[16px] py-[12px]">{s.manufacturer ?? "-"}</td>
                <td className="px-[16px] py-[12px]">{s.note ?? "-"}</td>
                <td className="px-[16px] py-[12px] flex gap-[8px] justify-center">
                  <button
                    className="px-[12px] py-[6px] rounded-[6px] bg-[#059669] hover:bg-[#047857] text-[#ffffff] text-[14px] font-[500] transition-all"
                    onClick={() => router.push(`/stock-in/${s.stock_in_id}`)}
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    className="px-[12px] py-[6px] rounded-[6px] bg-[#DC2626] hover:bg-[#B91C1C] text-[#ffffff] text-[14px] font-[500] transition-all"
                    onClick={() => handleDelete(s.stock_in_id)}
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-[20px] flex justify-center">
        <div className="flex items-center gap-[8px]">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-[4px] px-[14px] py-[8px] text-[14px] font-[500] bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#ffffff] rounded-[8px] disabled:opacity-50 transition-all"
          >
            <ChevronLeft size={18} /> Trang trước
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-[4px] px-[14px] py-[8px] text-[14px] font-[500] bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#ffffff] rounded-[8px] disabled:opacity-50 transition-all"
          >
            Trang sau <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
