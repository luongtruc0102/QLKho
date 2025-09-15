import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

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
interface StockIn {
  stock_in_id: number;
  product_id: number;
  warehouse_id: number;
  quantity: number;
  from_manufacturer: number;
  note: string;
}

export default function DetailStockIn() {
  const router = useRouter();
  const { id } = router.query;

  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);

  const [formData, setFormData] = useState<StockIn>({
    stock_in_id: 0,
    product_id: 0,
    warehouse_id: 0,
    quantity: 1,
    from_manufacturer: 0,
    note: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const [stockRes, productsRes, warehousesRes, manufacturersRes] =
          await Promise.all([
            axios.get<StockIn>(`http://localhost:4001/stock-in/${id}`),
            axios.get<Product[]>("http://localhost:4001/products"),
            axios.get<Warehouse[]>("http://localhost:4001/warehouses"),
            axios.get<Manufacturer[]>("http://localhost:4001/manufacturers"),
          ]);

        setProducts(productsRes.data);
        setWarehouses(warehousesRes.data);
        setManufacturers(manufacturersRes.data);
        setFormData(stockRes.data); // ✅ set sau khi options load xong
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: ["product_id", "warehouse_id", "from_manufacturer"].includes(name)
        ? Number(value)
        : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.put(`http://localhost:4001/stock-in/${id}`, {
      ...formData,
      product_id: Number(formData.product_id),
      warehouse_id: Number(formData.warehouse_id),
      quantity: Number(formData.quantity),
      from_manufacturer: Number(formData.from_manufacturer),
    });

    router.push("/stock-in/StockInPage");
  };

  return (
    <div className="container max-w-[600px] min-h-screen mx-auto flex flex-col items-center ">
      <section className="bg-[#ffffff] rounded-[16px] shadow p-[24px]">
        <h1 className="text-center text-[24px] font-[600] mb-[24px] text-[#7B68EE] font-arial">
          Sửa phiếu nhập kho: {formData.stock_in_id || id}
        </h1>

        {/* Nút quay lại */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center cursor-pointer px-[18px] py-[10px] rounded-[8px] bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#ffffff] font-[600] text-[15px] shadow-[0_2px_6px_rgba(123,104,238,0.3)] transition-all"
        >
          <ArrowLeft size={20} className="mr-[6px] text-[#ffffff]"/> Quay lại
        </button>

        <form onSubmit={handleSubmit} className="space-y-[16px] mt-[20px]">
          <select
            name="product_id"
            value={formData.product_id}
            onChange={handleChange}
            className="w-full border border-[#d1d5db] p-[12px] rounded-[8px] text-[14px]"
            required
          >
            <option value={0}>-- Chọn sản phẩm --</option>
            {products.map((p) => (
              <option key={p.product_id} value={p.product_id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            name="warehouse_id"
            value={formData.warehouse_id}
            onChange={handleChange}
            className="w-full border border-[#d1d5db] p-[12px] rounded-[8px] text-[14px]"
            required
          >
            <option value={0}>-- Chọn kho --</option>
            {warehouses.map((w) => (
              <option key={w.warehouse_id} value={w.warehouse_id}>
                {w.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full border border-[#d1d5db] p-[12px] rounded-[8px] text-[14px]"
            min={1}
            required
          />

          <select
            name="from_manufacturer"
            value={formData.from_manufacturer}
            onChange={handleChange}
            className="w-full border border-[#d1d5db] p-[12px] rounded-[8px] text-[14px]"
          >
            <option value={0}>-- Nhà sản xuất --</option>
            {manufacturers.map((m) => (
              <option key={m.manufacturer_id} value={m.manufacturer_id}>
                {m.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Ghi chú..."
            className="w-full border border-[#d1d5db] p-[12px] rounded-[8px] text-[14px]"
          />

          <button
            type="submit"
            className="bg-[#059669] hover:bg-[#047857] text-[#ffffff] px-[16px] py-[10px] rounded-[8px] text-[15px] font-[500] cursor-pointer"
          >
            Cập nhật
          </button>
        </form>
      </section>
    </div>
  );
}
