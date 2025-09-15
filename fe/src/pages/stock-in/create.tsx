"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Box, Check, Component, Factory, SquarePen, Warehouse } from "lucide-react";

interface Product {
  product_id: number;
  name: string;
}

interface WarehouseType {
  warehouse_id: number;
  name: string;
}

interface Manufacturer {
  manufacturer_id: number;
  name: string;
}

export default function CreateStockIn() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: 1,
    from_manufacturer: "",
    note: "",
  });

  useEffect(() => {
    axios.get<Product[]>("http://localhost:4001/products").then((res) => setProducts(res.data));
    axios.get<WarehouseType[]>("http://localhost:4001/warehouses").then((res) => setWarehouses(res.data));
    axios.get<Manufacturer[]>("http://localhost:4001/manufacturers").then((res) => setManufacturers(res.data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        product_id: Number(formData.product_id),
        warehouse_id: Number(formData.warehouse_id),
        quantity: Number(formData.quantity),
        from_manufacturer: formData.from_manufacturer ? Number(formData.from_manufacturer) : undefined,
        note: formData.note,
      };

      await axios.post("http://localhost:4001/stock-in", payload);
      alert("Tạo phiếu nhập thành công!");
      router.push("/stock-in/StockInPage");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] min-h-[100%] py-[32px] px-[24px]">
      <div className="max-w-[900px] mx-auto rounded-[16px] shadow-[6px] border border-[#e5e7eb] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#7B68EE] to-[#9370DB] px-[20px] py-[16px]">
          <button
            className="flex items-center absolute top-1/2 -translate-y-1/2 z-[5] gap-[6px] text-[#fff] border-0 cursor-pointer font-[600] bg-transparent text-[16px] transition-all"
            onClick={() => router.push("/stock-in/StockInPage")}
            type="button"
          >
            <ArrowLeft size={18} /> Quay lại
          </button>
          <h1 className="w-full text-center text-[#fff] text-[20px] font-[700] pointer-events-none select-none font-arial">
            📦 Tạo Phiếu Nhập Kho
          </h1>
        </div>

       
        {/* Form */}
        <div className="p-[32px]">
          <form onSubmit={handleSubmit} className="space-y-[24px]">
            {/* Chọn sản phẩm */}
            <div>
              <label className="block mb-[8px] text-[15px] font-[600] text-[#374151]">
                <span className="flex items-center gap-[6px]">
                  <Box size={18} />
                  Sản phẩm <span className="text-[#ff0000] ml-[4px]">*</span>
                </span>
              </label>
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="w-full p-[14px] border-[2px] border-[#cbd5e1] rounded-[8px] text-[15px] bg-[#f9fafb] focus:border-[#2563eb] focus:bg-[#fff] focus:ring-[2px] focus:ring-[#2563eb40] outline-none transition-all"
                required
              >
                <option value="">-- Chọn sản phẩm --</option>
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Số lượng + Kho */}
            <div className="flex md:flex-cols-2 gap-[60px]">
              <div>
                <label className="block mb-[8px] text-[15px] font-[600] text-[#374151]">
                  <span className="flex items-center gap-[6px]">
                    <Component size={18} />
                    Số lượng <span className="text-[#ff0000] ml-[2px]">*</span>
                  </span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min={1}
                  className="w-full p-[14px] border-[2px] border-[#cbd5e1] rounded-[8px] text-[15px] bg-[#f9fafb] focus:border-[#2563eb] focus:bg-[#fff] focus:ring-[2px] focus:ring-[#2563eb40] outline-none transition-all"
                  required
                />
              </div>

              <div className="w-full">
                <label className="block mb-[8px] text-[15px] font-[600] text-[#374151]">
                  <span className="flex items-center gap-[6px]">
                    <Warehouse size={18} />
                    Kho <span className="text-[#ff0000] ml-[4px]">*</span>
                  </span>
                </label>
                <select
                  name="warehouse_id"
                  value={formData.warehouse_id}
                  onChange={handleChange}
                  className="w-full p-[14px] border-[2px] border-[#cbd5e1] rounded-[8px] text-[15px] bg-[#f9fafb] focus:border-[#2563eb] focus:bg-[#fff] focus:ring-[2px] focus:ring-[#2563eb40] outline-none transition-all"
                  required
                >
                  <option value="">-- Chọn kho --</option>
                  {warehouses.map((w) => (
                    <option key={w.warehouse_id} value={w.warehouse_id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nhà sản xuất */}
            <div>
              <label className="block mb-[8px] text-[15px] font-[600] text-[#374151]">
                <span className="flex items-center gap-[6px]">
                  <Factory size={18} />
                  Nhà sản xuất <span className="text-[#ff0000] ml-[4px]">*</span>
                </span>
              </label>
              <select
                name="from_manufacturer"
                value={formData.from_manufacturer}
                onChange={handleChange}
                className="w-full p-[14px] border-[2px] border-[#cbd5e1] rounded-[8px] text-[15px] bg-[#f9fafb] focus:border-[#2563eb] focus:bg-[#fff] focus:ring-[2px] focus:ring-[#2563eb40] outline-none transition-all"
              >
                <option value="">-- Chọn nhà sản xuất --</option>
                {manufacturers.map((m) => (
                  <option key={m.manufacturer_id} value={m.manufacturer_id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ghi chú */}
            <div>
              <label className="block mb-[8px] text-[15px] font-[600] text-[#374151]">
                <span className="flex items-center gap-[6px]">
                  <SquarePen size={18} />
                  Ghi chú
                </span>
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={4}
                className="w-full flex py-[14px] border-[2px] border-[#cbd5e1] rounded-[8px] text-[15px] bg-[#f9fafb] focus:border-[#2563eb] focus:bg-[#fff] focus:ring-[2px] focus:ring-[#2563eb40] outline-none transition-all"
                placeholder="Nhập ghi chú thêm (tùy chọn)..."
              />
            </div>

            {/* Submit */}
            <div className="pt-[8px]">
              <button
                type="submit"
                className="w-full text-[16px] cursor-pointer bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#fff] font-[700] py-[16px] px-[24px] rounded-[8px] shadow-[6px] hover:shadow-[8px] transition-all flex items-center justify-center"
              >
                <Check className="w-[20px] h-[20px] mr-[8px]" />
                Lưu phiếu nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
