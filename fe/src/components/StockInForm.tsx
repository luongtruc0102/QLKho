"use client";
import { useState, useEffect } from "react";
import { StockInItem } from "../pages/stock-in/StockInPage";

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingItem: StockInItem | null;
}

export default function StockInForm({ show, onClose, onSubmit, editingItem }: Props) {
  const [animate, setAnimate] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: 1,
    from_manufacturer: "",
    note: "",
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        product_id: editingItem.product,
        warehouse_id: editingItem.warehouse ?? "",
        quantity: editingItem.quantity,
        from_manufacturer: editingItem.manufacturer ?? "",
        note: editingItem.note ?? "",
      });
    } else {
      setFormData({
        product_id: "",
        warehouse_id: "",
        quantity: 1,
        from_manufacturer: "",
        note: "",
      });
    }
  }, [editingItem]);

  useEffect(() => {
    if (show) {
      setTimeout(() => setAnimate(true), 50);
    } else {
      setAnimate(false);
    }
  }, [show]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[50] transition-opacity duration-300 ${
        animate ? "bg-[rgba(0,0,0,0.5)]" : "bg-transparent"
      }`}
      onClick={onClose}
    >
      <form
        className={`bg-[#ffffff] p-[32px] rounded-[16px] shadow-[0_4px_20px_rgba(123,104,238,0.15)] w-[440px] transform transition-all duration-300 ${
          animate ? "scale-100 translate-y-0 opacity-[100%]" : "scale-90 -translate-y-6 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className="text-[20px] font-[700] text-[#1F2937] mb-[24px]">
          {editingItem ? "✏️ Sửa phiếu nhập" : "➕ Thêm phiếu nhập"}
        </h2>

        {/* Product ID */}
        <label className="block text-[14px] font-[500] text-[#374151] mb-[6px]">Mã sản phẩm</label>
        <input
          className="border border-[#E5E7EB] rounded-[8px] p-[12px] w-full mb-[16px] text-[15px] text-[#1F2937] focus:ring-[3px] focus:ring-[#7B68EE] focus:outline-none"
          placeholder="Nhập ID sản phẩm"
          value={formData.product_id}
          onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
          required
        />

        {/* Warehouse */}
        <label className="block text-[14px] font-[500] text-[#374151] mb-[6px]">Kho</label>
        <input
          className="border border-[#E5E7EB] rounded-[8px] p-[12px] w-full mb-[16px] text-[15px] text-[#1F2937] focus:ring-[3px] focus:ring-[#7B68EE] focus:outline-none"
          placeholder="Nhập ID kho"
          value={formData.warehouse_id}
          onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })}
          required
        />

        {/* Quantity */}
        <label className="block text-[14px] font-[500] text-[#374151] mb-[6px]">Số lượng</label>
        <input
          type="number"
          className="border border-[#E5E7EB] rounded-[8px] p-[12px] w-full mb-[16px] text-[15px] text-[#1F2937] focus:ring-[3px] focus:ring-[#7B68EE] focus:outline-none"
          placeholder="Nhập số lượng"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
          required
        />

        {/* Manufacturer */}
        <label className="block text-[14px] font-[500] text-[#374151] mb-[6px]">Nhà sản xuất</label>
        <input
          className="border border-[#E5E7EB] rounded-[8px] p-[12px] w-full mb-[16px] text-[15px] text-[#1F2937] focus:ring-[3px] focus:ring-[#7B68EE] focus:outline-none"
          placeholder="Nhập ID nhà sản xuất"
          value={formData.from_manufacturer}
          onChange={(e) => setFormData({ ...formData, from_manufacturer: e.target.value })}
        />

        {/* Note */}
        <label className="block text-[14px] font-[500] text-[#374151] mb-[6px]">Ghi chú</label>
        <textarea
          className="border border-[#E5E7EB] rounded-[8px] p-[12px] w-full mb-[20px] text-[15px] text-[#1F2937] focus:ring-[3px] focus:ring-[#7B68EE] focus:outline-none"
          placeholder="Thêm ghi chú..."
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-[12px] mt-[20px]">
          <button
            type="button"
            className="px-[20px] py-[10px] border border-[#D1D5DB] rounded-[8px] text-[#6B7280] text-[14px] font-[500] transition-all duration-200 hover:bg-[#F9FAFB]"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-[20px] py-[10px] bg-[#7B68EE] text-[#ffffff] rounded-[8px] font-[600] text-[14px] transition-all duration-200 hover:bg-[#6A5ACD]"
          >
            {editingItem ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </form>
    </div>
  );
}
