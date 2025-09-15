"use client";
import { useEffect, useState } from "react";
import {
  getAllSubWarehouse,
  createSubWarehouse,
  updateSubWarehouse,
  deleteSubWarehouse,
  getAllWarehouse,
  SubWarehouse,
  Warehouse,
  CreateSubWarehouseDto,
  UpdateSubWarehouseDto,
} from "@/services/subWarehouseService";
import {
  ArrowLeft,
  Warehouse as WarehouseIcon,
  Home,
  MapPin,
  Plus,
  Save,
  X,
  Edit,
  Trash2,
  ArrowRight,
} from "lucide-react";

export default function SubWarehousePage() {
  const [subWarehouses, setSubWarehouses] = useState<SubWarehouse[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SubWarehouse | null>(null);
  const [formData, setFormData] = useState<CreateSubWarehouseDto>({
    warehouse_id: 0,
    name: "",
    address: "",
  });

  // phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [gotoPage, setGotoPage] = useState("");

  useEffect(() => {
    fetchWarehouses();
    fetchSubWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const data = await getAllWarehouse();
      setWarehouses(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kho cha:", error);
    }
  };

  const fetchSubWarehouses = async () => {
    try {
      const data = await getAllSubWarehouse();
      setSubWarehouses(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách kho con:", error);
    }
  };

  const handleEdit = (item: SubWarehouse) => {
    setEditingItem(item);
    setFormData({
      warehouse_id: item.warehouse.warehouse_id,
      name: item.name,
      address: item.address || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa kho con này?")) {
      await deleteSubWarehouse(id);
      fetchSubWarehouses();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const payload: UpdateSubWarehouseDto = { ...formData };
        await updateSubWarehouse(editingItem.sub_id, payload);
      } else {
        await createSubWarehouse(formData);
      }
      setShowForm(false);
      setEditingItem(null);
      setFormData({ warehouse_id: 0, name: "", address: "" });
      fetchSubWarehouses();
    } catch (error) {
      console.error("Lỗi khi lưu kho con:", error);
    }
  };

  // ================= Phân trang =================
  const totalPages = Math.ceil(subWarehouses.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = subWarehouses.slice(indexOfFirst, indexOfLast);

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

  const handleGotoPage = () => {
    let page = Number(gotoPage);
    if (!isNaN(page)) {
      if (page < 1) page = 1;
      if (page > totalPages) page = totalPages;
      setCurrentPage(page);
      setGotoPage("");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-[32px] font-sans">
      <div className="max-w-[1200px] mx-auto bg-white rounded-[16px] shadow-[0_4px_24px_rgba(123,104,238,0.08)] border border-[#E5E7EB] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7B68EE] to-[#9370DB] px-[32px] py-[24px] flex justify-between items-center">
          <h1 className="text-[#fff] text-[24px] font-[700] flex items-center gap-[8px] m-0 font-arial">
            🏬 Quản lý Kho Con
          </h1>
          <div className="flex gap-[12px]">
            <button
              onClick={() => (window.location.href = "http://localhost:4000/")}
              className="flex items-center cursor-pointer px-[18px] py-[10px] rounded-[8px] bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#ffffff] font-[600] text-[15px] shadow-[0_2px_6px_rgba(123,104,238,0.3)] transition-all"
            >
              <ArrowLeft size={20} className="mr-[6px] text-[#ffffff]" />
              Quay lại
            </button>
            <button
              onClick={() => {
                setShowForm(true);
                setEditingItem(null);
                setFormData({ warehouse_id: 0, name: "", address: "" });
              }}
              className="flex items-center cursor-pointer px-[18px] py-[10px] rounded-[8px] bg-[#10B981] hover:bg-[#059669] text-[#ffffff] font-[600] text-[15px] shadow-[0_2px_6px_rgba(16,185,129,0.3)] transition-all"
            >
              <Plus size={18} className="mr-[6px]" /> Thêm kho con
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="p-[24px] border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <form onSubmit={handleSubmit} className="space-y-[16px]">
              <div>
                <label className="block text-[15px] font-[600] mb-[6px] text-[#374151]">
                  <WarehouseIcon size={16} className="inline mr-[6px]" />
                  Kho cha
                </label>
                <select
                  value={formData.warehouse_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      warehouse_id: Number(e.target.value),
                    })
                  }
                  className="w-full h-[44px] px-[16px] text-[14px] rounded-[8px] border border-[#D1D5DB] focus:border-[#7B68EE] focus:ring-[1px] focus:ring-[#7B68EE] outline-none shadow-sm transition"
                  required
                >
                  <option value={0}>-- Chọn kho cha --</option>
                  {warehouses.map((w) => (
                    <option key={w.warehouse_id} value={w.warehouse_id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[15px] font-[600] mb-[6px] text-[#374151]">
                  <Home size={16} className="inline mr-[6px]" />
                  Tên kho con
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full h-[44px] px-[16px] text-[14px] rounded-[8px] border border-[#D1D5DB] focus:border-[#7B68EE] focus:ring-[1px] focus:ring-[#7B68EE] outline-none shadow-sm transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[15px] font-[600] mb-[6px] text-[#374151]">
                  <MapPin size={16} className="inline mr-[6px]" />
                  Địa chỉ
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full h-[44px] px-[16px] text-[14px] rounded-[8px] border border-[#D1D5DB] focus:border-[#7B68EE] focus:ring-[1px] focus:ring-[#7B68EE] outline-none shadow-sm transition"
                />
              </div>

              <div className="flex gap-[12px]">
                <button
                  type="submit"
                  className="flex items-center px-[20px] py-[10px] cursor-pointer rounded-[8px] bg-[#059669] hover:bg-[#047857] text-[#ffffff] font-[600] text-[15px] shadow-md transition-all"
                >
                  <Save size={18} className="mr-[6px]" /> Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)} 
                  className="flex items-center px-[20px] py-[10px] cursor-pointer rounded-[8px] bg-[#6B7280] hover:bg-[#4B5563] text-[#ffffff] font-[600] text-[15px] shadow-md transition-all"
                >
                  <X size={18} className="mr-[6px]" /> Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="p-[24px]">
          <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_4px_rgba(123,104,238,0.04)]">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6]">
                  <th className="px-[24px] py-[16px] text-left text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                    ID
                  </th>
                  <th className="px-[24px] py-[16px] text-left text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                    Tên kho con
                  </th>
                  <th className="px-[24px] py-[16px] text-left text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                    Kho cha
                  </th>
                  <th className="px-[24px] py-[16px] text-left text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                    Địa chỉ
                  </th>
                  <th className="px-[24px] py-[16px] text-center text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((sw) => (
                    <tr
                      key={sw.sub_id}
                      className="border-b border-[#F3F4F6] transition-all hover:bg-gradient-to-r hover:from-[#EEF2FF] hover:to-[#F3E8FF]"
                    >
                      <td className="px-[24px] py-[16px] text-[#1F2937] font-[500]">
                        {sw.sub_id}
                      </td>
                      <td className="px-[24px] py-[16px] text-[#1F2937] font-[500]">
                        {sw.name}
                      </td>
                      <td className="px-[24px] py-[16px] text-[#1F2937] font-[500]">
                        {sw.warehouse.name}
                      </td>
                      <td className="px-[24px] py-[16px] text-[#1F2937] font-[500]">
                        {sw.address || "-"}
                      </td>
                      <td className="px-[24px] py-[16px] text-center flex gap-[8px] justify-center">
                        <button
                          className="inline-flex items-center px-[14px] py-[6px] rounded-[6px] cursor-pointer bg-[#F59E0B] hover:bg-[#D97706] text-[#fff] font-[600] text-[14px] shadow transition-all"
                          onClick={() => handleEdit(sw)}
                        >
                          <Edit size={16} className="mr-[4px]" /> Sửa
                        </button>
                        <button
                          className="inline-flex items-center px-[14px] py-[6px] rounded-[6px] cursor-pointer bg-[#EF4444] hover:bg-[#DC2626] text-[#fff] font-[600] text-[14px] shadow transition-all"
                          onClick={() => handleDelete(sw.sub_id)}
                        >
                          <Trash2 size={16} className="mr-[4px]" /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-[24px] py-[16px] text-center text-[#6B7280]"
                    >
                      Không có dữ liệu
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
                  className={`px-[16px] py-[12px] flex items-center gap-[5px] rounded-[8px] text-[14px] font-[500] bg-[#7B68EE] text-[#fff] transition-all duration-200 
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
                  className={`px-[16px] py-[12px] flex items-center gap-[5px] rounded-[8px] text-[14px] font-[500] bg-[#7B68EE] text-[#fff] transition-all duration-200 
                    ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-[#6A5ACD] cursor-pointer"
                    }`}
                >
                  Trang sau <ArrowRight size={18} />
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
                Trang {currentPage} / {totalPages} • Tổng {subWarehouses.length} kho con
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
