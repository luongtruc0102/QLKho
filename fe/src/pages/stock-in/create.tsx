"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Box, Check, Component, Factory, SquarePen, Warehouse } from "lucide-react";

interface Product {
  product_id: number;
  name: string;
}

interface Warehouse {
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
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

  const [formData, setFormData] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: 1,
    from_manufacturer: "",
    note: "",
  });

  useEffect(() => {
    axios
      .get<Product[]>("http://localhost:4001/products")
      .then((res) => setProducts(res.data));
    axios
      .get<Warehouse[]>("http://localhost:4001/warehouses")
      .then((res) => setWarehouses(res.data));
    axios
      .get<Manufacturer[]>("http://localhost:4001/manufacturers")
      .then((res) => setManufacturers(res.data));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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
        from_manufacturer: formData.from_manufacturer
          ? Number(formData.from_manufacturer)
          : undefined,
        note: formData.note,
      };

      await axios.post("http://localhost:4001/stock-in", payload);
      alert("Tạo phiếu nhập thành công!");
      router.push("/stock-in/StockInPage"); // Quay về danh sách
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra!");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      {/* Button Quay lại */}
      <button
        className="mb-4 bg-gray-300 text-black px-3 py-2 rounded hover:bg-gray-400"
        onClick={() => router.push("/stock-in/StockInPage")}
      >
        ← Quay lại
      </button>

      <h2 className="text-2xl font-bold mb-4">Tạo phiếu nhập kho</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Chọn sản phẩm */}
        <div>
          <label className="block mb-1 font-medium">Sản phẩm</label>
          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            className="w-full border rounded p-2"
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

            {/* Số lượng và Kho - 2 cột */}
            <div className="flex md:flex-cols-2 justify-between gap-[48px]">
              <div className="group ">
                <label className="block text-[14px] font-[600] text-[#374151] mb-[8px] group-focus-within:text-[#7B68EE] transition-colors">
                  <span className="flex items-center gap-[5px]">
                    <Component />
                    Số lượng <span className="text-[#ef4444] ml-[4px]">*</span>
                  </span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min={1}
                  placeholder="Nhập số lượng"
                  className="w-full p-[16px] text-[#374151] bg-[#f9fafb] border-[2px] border-[#e5e7eb] rounded-[12px] focus:border-[#7B68EE] focus:bg-[#fff] focus:ring-[4px] focus:ring-[#7B68EE1A] transition-all duration-[200ms] outline-none"
                  required
                />
              </div>

              <div className="group w-full ">
                <label className="block text-[14px] font-[600] text-[#374151] mb-[8px] group-focus-within:text-[#7B68EE] transition-colors">
                  <span className="flex items-center gap-[5px]">
                    <Warehouse />
                    Kho <span className="text-[#ef4444] ml-[4px]">*</span>
                  </span>
                </label>
                <select
                  name="warehouse_id"
                  value={formData.warehouse_id}
                  onChange={handleChange}
                  className="w-full p-[16px] text-[#374151] bg-[#f9fafb] border-[2px] border-[#e5e7eb] rounded-[12px] focus:border-[#7B68EE] focus:bg-[#fff] focus:ring-[4px] focus:ring-[#7B68EE1A] transition-all duration-[200ms] outline-none"
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
            <div className="group">
              <label className="block text-[14px] font-[600] text-[#374151] mb-[8px] group-focus-within:text-[#7B68EE] transition-colors">
                <span className="flex items-center gap-[5px]">
                <Factory />
                  Nhà sản xuất
                </span>
              </label>
              <select
                name="from_manufacturer"
                value={formData.from_manufacturer}
                onChange={handleChange}
                className="w-full p-[16px] text-[#374151] bg-[#f9fafb] border-[2px] border-[#e5e7eb] rounded-[12px] focus:border-[#7B68EE] focus:bg-[#fff] focus:ring-[4px] focus:ring-[#7B68EE1A] transition-all duration-[200ms] outline-none"
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
            <div className="group">
              <label className="block text-[14px] font-[600] text-[#374151] mb-[8px] group-focus-within:text-[#7B68EE] transition-colors">
                <span className="flex items-center gap-[5px]">
                <SquarePen />
                  Ghi chú
                </span>
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={4}
                placeholder="Nhập ghi chú thêm (tùy chọn)..."
                className="w-full p-[16px] mr-[5px] text-[#374151] bg-[#f9fafb] border-[2px] border-[#e5e7eb] rounded-[12px] focus:border-[#7B68EE] focus:bg-[#fff] focus:ring-[4px] focus:ring-[#7B68EE1A] transition-all duration-[200ms] outline-none resize-none"
              />
            </div>

            {/* Submit button */}
            <div className="pt-[16px]">
              <button
                type="submit"
                className="w-full cursor-pointer bg-gradient-to-r from-[#7B68EE] to-[#9370DB] hover:from-[#6A5ACD] hover:to-[#7B68EE] text-[#fff] font-[600] py-[16px] px-[24px] rounded-[12px] shadow-lg hover:shadow-xl transform hover:-translate-y-[2px] transition-all duration-[200ms] flex items-center justify-center group"
              >
                <Check className="w-[20px] h-[20px] mr-[8px] group-hover:scale-110 transition-transform" />
                Lưu phiếu nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
