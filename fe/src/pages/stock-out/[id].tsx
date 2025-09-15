"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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

interface Store {
  store_id: number;
  name: string;
}

interface StockOut {
  stock_out_id: number;
  product_id: number;
  warehouse_id: number;
  quantity: number;
  to_store?: number | null;
  note?: string;
}

export default function DetailStockOut() {
  const router = useRouter();
  // @ts-ignore
  const params = useParams() as { id: string };
  const id = params?.id;

  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [formData, setFormData] = useState<StockOut>({
    stock_out_id: 0,
    product_id: 0,
    warehouse_id: 0,
    quantity: 1,
    to_store: null,
    note: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [stockRes, productsRes, warehousesRes, storesRes] =
          await Promise.all([
            axios.get<StockOut>(`http://localhost:4001/stock-out/${id}`),
            axios.get<Product[]>(`http://localhost:4001/products`),
            axios.get<Warehouse[]>(`http://localhost:4001/warehouses`),
            axios.get<Store[]>(`http://localhost:4001/stores`),
          ]);

        setProducts(productsRes.data);
        setWarehouses(warehousesRes.data);
        setStores(storesRes.data);

        setFormData({
          ...stockRes.data,
          to_store: stockRes.data.to_store ?? null,
          note: stockRes.data.note ?? "",
        });
      } catch (err) {
        console.error(err);
        alert("Không thể tải dữ liệu phiếu xuất kho.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: ["product_id", "warehouse_id", "to_store", "quantity"].includes(
        name
      )
        ? value === "" ? null : Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:4001/stock-out/${id}`, {
        ...formData,
        product_id: Number(formData.product_id),
        warehouse_id: Number(formData.warehouse_id),
        quantity: Number(formData.quantity),
        to_store: formData.to_store ? Number(formData.to_store) : null,
        note: formData.note ?? "",
      });

      router.push("/stock-out/StockOutPage");
    } catch (err) {
      console.error("Cập nhật thất bại:", err);
      alert("Cập nhật thất bại");
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-lg mx-auto text-center text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="container max-w-[600px] min-h-screen mx-auto flex flex-col items-center ">
      <section className="bg-[#ffffff] rounded-[16px] shadow p-[24px]">
        <h1 className="text-center text-[24px] font-[600] mb-[24px] text-[#7B68EE] font-arial">
          Sửa phiếu xuất kho: {formData.stock_out_id || id}
        </h1>

        {/* Nút quay lại */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center cursor-pointer px-[18px] py-[10px] rounded-[8px] bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#ffffff] font-[600] text-[15px] shadow-[0_2px_6px_rgba(123,104,238,0.3)] transition-all"
        >
          <ArrowLeft size={20} className="mr-[6px] text-[#ffffff]" /> Quay lại
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
            name="to_store"
            value={formData.to_store ?? ""}
            onChange={handleChange}
            className="w-full border border-[#d1d5db] p-[12px] rounded-[8px] text-[14px]"
          >
            <option value="">-- Chọn cửa hàng --</option>
            {stores.map((s) => (
              <option key={s.store_id} value={s.store_id}>
                {s.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="note"
            value={formData.note ?? ""}
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
