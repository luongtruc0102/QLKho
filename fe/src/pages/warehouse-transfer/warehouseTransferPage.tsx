"use client";

import { useEffect, useState } from "react";
import {
  getAllWarehouse,
  Warehouse,
  getAllSubWarehouse,
  SubWarehouse,
} from "@/services/subWarehouseService";
import {
  getAllTransfers,
  createTransfer,
  WarehouseTransfer,
} from "@/services/warehousetransferService";
import { getAllProducts, Product } from "@/services/productService";
import { ArrowLeft, ArrowRight, Plus, X } from "lucide-react";

export default function WarehouseTransferPage() {
  const [transfers, setTransfers] = useState<WarehouseTransfer[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [subWarehouses, setSubWarehouses] = useState<SubWarehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState({
    productId: 0,
    fromWarehouseId: 0,
    toSubWarehouseId: 0,
    quantity: 0,
    note: "",
  });
  const [showForm, setShowForm] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  // Search & Sort
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [gotoPage, setGotoPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [t, w, s, p] = await Promise.all([
        getAllTransfers(),
        getAllWarehouse(),
        getAllSubWarehouse(),
        getAllProducts(),
      ]);
      setTransfers(t);
      setWarehouses(w);
      setSubWarehouses(s);
      setProducts(p);
    } catch (error) {
      console.error("Lỗi fetch data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.productId ||
      !formData.fromWarehouseId ||
      !formData.toSubWarehouseId ||
      formData.quantity <= 0
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      await createTransfer({
        product_id: formData.productId,
        from_warehouse_id: formData.fromWarehouseId,
        to_sub_warehouse_id: formData.toSubWarehouseId,
        quantity: formData.quantity,
        note: formData.note,
      });
      setShowForm(false);
      setFormData({
        productId: 0,
        fromWarehouseId: 0,
        toSubWarehouseId: 0,
        quantity: 0,
        note: "",
      });
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Lỗi tạo chuyển kho");
    }
  };

  // Filter & Sort
  const sortedTransfers = [...transfers].sort((a, b) => {
    const dateA = new Date(a.transfer_date).getTime();
    const dateB = new Date(b.transfer_date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const filteredTransfers = sortedTransfers.filter(
    (t) =>
      t.product.name.toLowerCase().includes(search.toLowerCase()) ||
      t.fromWarehouse.name.toLowerCase().includes(search.toLowerCase()) ||
      t.toSubWarehouse.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransfers.length / rowsPerPage);
  const currentData = filteredTransfers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const renderPageNumbers = () => {
    let pages: (number | "...")[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  const handleGotoPage = () => {
    let page = Math.min(Math.max(Number(gotoPage), 1), totalPages);
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-[32px] font-sans">
      {/* Container */}
      <div className="max-w-[1200px] mx-auto bg-[#fff] rounded-[16px] shadow-[0_4px_24px_rgba(123,104,238,0.08)] border border-[#E5E7EB] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7B68EE] to-[#9370DB] px-[32px] py-[24px] flex justify-between items-center">
          <h1 className="text-[#fff] text-[24px] font-[700] flex items-center gap-[8px] m-0 font-arial">
            🔄 Chuyển sản phẩm từ kho chính sang kho con
          </h1>
          <button
            onClick={() => (window.location.href = "http://localhost:4000/")}
            className="flex items-center cursor-pointer px-[24px] py-[12px] rounded-[10px] bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#fff] font-[600] text-[16px] shadow-[0_2px_6px_rgba(37,99,235,0.3)] transition-all"
          >
            <ArrowLeft size={20} className="mr-[8px]" /> Quay lại trang chủ
          </button>
        </div>

        {/* Search & Sort */}
        <div className="p-[24px] border-b border-[#E5E7EB] flex gap-[16px]">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm sản phẩm / kho..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-[48px] px-[20px] text-[15px] font-[500] rounded-[10px] border border-[#D1D5DB] focus:border-[#7B68EE] focus:ring-[2px] focus:ring-[#7B68EE] outline-none shadow-sm transition"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="px-[20px] py-[12px] border border-[#D1D5DB] rounded-[10px] text-[15px] font-[500] focus:border-[#7B68EE] focus:ring-[2px] focus:ring-[#7B68EE]"
          >
            <option value="desc">⬇ Mới nhất → Cũ nhất</option>
            <option value="asc">⬆ Cũ nhất → Mới nhất</option>
          </select>
        </div>

        {/* Add Transfer Button */}
        <div className="px-[24px] py-[16px]">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-[5px] cursor-pointer px-[24px] py-[12px] rounded-[10px] bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#fff] font-[600] text-[16px] shadow-[0_2px_6px_rgba(37,99,235,0.3)] transition-all"
          >
            <Plus size={20} /> Thêm chuyển kho
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mx-[24px] mb-[24px] p-[24px] border border-[#E5E7EB] rounded-[16px] shadow-sm bg-[#F9FAFB] space-y-[18px]"
          >
            <div className="grid grid-cols-2 gap-[24px]">
              <div>
                <label className="font-[600] mb-[6px] block text-[15px]">Sản phẩm</label>
                <select
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData({ ...formData, productId: Number(e.target.value) })
                  }
                  className="w-full border px-[14px] py-[10px] rounded-[8px] text-[14px] font-[500] focus:border-[#7B68EE] focus:ring-[1px] focus:ring-[#7B68EE]"
                >
                  <option value={0}>Chọn sản phẩm</option>
                  {products.map((p) => (
                    <option key={p.product_id} value={p.product_id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-[600] mb-[6px] block text-[15px]">Kho chính</label>
                <select
                  value={formData.fromWarehouseId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      fromWarehouseId: Number(e.target.value),
                    })
                  }
                  className="w-full border px-[14px] py-[10px] rounded-[8px] text-[14px] font-[500] focus:border-[#7B68EE] focus:ring-[1px] focus:ring-[#7B68EE]"
                >
                  <option value={0}>Chọn kho chính</option>
                  {warehouses
                    .filter((w) => w.is_main)
                    .map((w) => (
                      <option key={w.warehouse_id} value={w.warehouse_id}>
                        {w.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="font-[600] mb-[6px] block text-[15px]">Kho con</label>
                <select
                  value={formData.toSubWarehouseId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      toSubWarehouseId: Number(e.target.value),
                    })
                  }
                  className="w-full border px-[14px] py-[10px] rounded-[8px] text-[14px] font-[500] focus:border-[#7B68EE] focus:ring-[1px] focus:ring-[#7B68EE]"
                >
                  <option value={0}>Chọn kho con</option>
                  {subWarehouses.map((s) => (
                    <option key={s.sub_id} value={s.sub_id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-[600] mb-[6px] block text-[15px]">Số lượng</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: Number(e.target.value) })
                  }
                  className="w-full border px-[14px] py-[10px] rounded-[8px] text-[14px] font-[500] focus:border-[#7B68EE] focus:ring-[1px] focus:ring-[#7B68EE]"
                />
              </div>
            </div>

            <div>
              <label className="font-[600] mb-[6px] block text-[15px]">Ghi chú</label>
              <input
                type="text"
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full border px-[14px] py-[10px] rounded-[8px] text-[14px] font-[500] focus:border-[#7B68EE] focus:ring-[1px] focus:ring-[#7B68EE]"
              />
            </div>

            <div className="flex gap-[12px]">
              <button
                type="submit"
                className="bg-[#059669] hover:bg-[#047857] text-[#fff] px-[24px] py-[10px] rounded-[8px] font-[600] shadow"
              >
                Lưu
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-[#DC2626] hover:bg-[#B91C1C] text-[#fff] px-[20px] py-[10px] rounded-[8px] font-[600] shadow flex items-center gap-[6px]"
              >
                <X size={16} /> Hủy
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className="px-[24px] pb-[24px]">
          <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB] shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6]">
                  <th className="px-[16px] py-[12px] text-left font-[600] text-[#374151] border-b border-[#E5E7EB]">
                    ID
                  </th>
                  <th className="px-[16px] py-[12px] text-left font-[600] text-[#374151] border-b border-[#E5E7EB]">
                    Sản phẩm
                  </th>
                  <th className="px-[16px] py-[12px] text-left font-[600] text-[#374151] border-b border-[#E5E7EB]">
                    Kho chính
                  </th>
                  <th className="px-[16px] py-[12px] text-left font-[600] text-[#374151] border-b border-[#E5E7EB]">
                    Kho con
                  </th>
                  <th className="px-[16px] py-[12px] text-center font-[600] text-[#374151] border-b border-[#E5E7EB]">
                    SL
                  </th>
                  <th className="px-[16px] py-[12px] text-center font-[600] text-[#374151] border-b border-[#E5E7EB]">
                    Ngày chuyển
                  </th>
                  <th className="px-[16px] py-[12px] text-left font-[600] text-[#374151] border-b border-[#E5E7EB]">
                    Ghi chú
                  </th>
                </tr>
              </thead>
              <tbody className="text-[14px] font-[500]">
                {currentData.map((t) => (
                  <tr
                    key={t.transfer_id}
                    className="border-b border-[#F3F4F6] hover:bg-gradient-to-r hover:from-[#EEF2FF] hover:to-[#F3E8FF] transition"
                  >
                    <td className="px-[16px] py-[10px]">{t.transfer_id}</td>
                    <td className="px-[16px] py-[10px]">{t.product.name}</td>
                    <td className="px-[16px] py-[10px]">{t.fromWarehouse.name}</td>
                    <td className="px-[16px] py-[10px]">{t.toSubWarehouse.name}</td>
                    <td className="px-[16px] py-[10px] text-center font-[600] text-[#2563EB]">
                      {t.quantity}
                    </td>
                    <td className="px-[16px] py-[10px] text-center text-[#6B7280]">
                      {new Date(t.transfer_date).toLocaleString()}
                    </td>
                    <td className="px-[16px] py-[10px] text-[#374151]">
                      {t.note || "-"}
                    </td>
                  </tr>
                ))}
                {currentData.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-[16px] py-[16px] text-center text-[#6B7280] font-[500]"
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
            <div className="mt-[32px] flex items-center justify-center gap-[12px]">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-[16px] py-[10px] flex items-center gap-[6px] rounded-[8px] text-[14px] font-[600] bg-[#7B68EE] text-[#fff] transition-all duration-200
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
                className={`px-[16px] py-[10px] flex items-center gap-[6px] rounded-[8px] text-[14px] font-[600] bg-[#7B68EE] text-[#fff] transition-all
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
