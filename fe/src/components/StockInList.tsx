import { useEffect, useState } from "react";

export interface StockInItem {
  stock_in_id: number;
  product: string;
  warehouse: string | null;
  quantity: number;
  date_in: string;
  manufacturer: string | null;
  note: string;
}

export default function StockInList() {
  const [stockIns, setStockIns] = useState<StockInItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockIns = async () => {
      try {
        const res = await fetch("http://localhost:4001/stock-in"); // BE URL
        if (!res.ok) throw new Error("Failed to fetch data");
        const data: StockInItem[] = await res.json();
        setStockIns(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStockIns();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-[#7B68EE] font-medium animate-pulse">
          ⏳ Đang tải dữ liệu...
        </p>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-red-600 font-medium">⚠️ Lỗi: {error}</p>
      </div>
    );

  return (
    <div className="max-w-[1200px] mx-auto bg-[#fff] rounded-[16px] shadow-[0_4px_24px_0_rgba(123,104,238,0.08)] border border-[#E5E7EB] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7B68EE] to-[#9370DB] px-[32px] py-[20px]">
        <h2 className="text-white text-[20px] font-[700] text-center font-arial">
          📥 Danh sách phiếu nhập kho
        </h2>
      </div>

      {/* Table */}
      <div className="p-[24px]">
        <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_4px_0_rgba(123,104,238,0.04)]">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6]">
                <th className="px-[16px] py-[12px] text-center text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                  🆔 ID
                </th>
                <th className="px-[16px] py-[12px] text-left text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                  🏷️ Sản phẩm
                </th>
                <th className="px-[16px] py-[12px] text-left text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                  🏪 Kho
                </th>
                <th className="px-[16px] py-[12px] text-center text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                  📊 Số lượng
                </th>
                <th className="px-[16px] py-[12px] text-left text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                  📅 Ngày nhập
                </th>
                <th className="px-[16px] py-[12px] text-left text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                  🏭 Nhà sản xuất
                </th>
                <th className="px-[16px] py-[12px] text-left text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                  📝 Ghi chú
                </th>
              </tr>
            </thead>
            <tbody>
              {stockIns.map((s) => (
                <tr
                  key={s.stock_in_id}
                  className="border-b border-[#F3F4F6] transition-all hover:bg-gradient-to-r hover:from-[#EEF2FF] hover:to-[#F3E8FF]"
                >
                  <td className="px-[16px] py-[12px] text-center text-[#1F2937] font-[500]">
                    {s.stock_in_id}
                  </td>
                  <td className="px-[16px] py-[12px] text-[#1F2937] font-[500]">
                    {s.product}
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <span className="inline-flex items-center px-[12px] py-[4px] rounded-full text-[14px] font-[500] bg-[#ede9fe] text-[#7B68EE]">
                      {s.warehouse ?? "N/A"}
                    </span>
                  </td>
                  <td className="px-[16px] py-[12px] text-center">
                    <span className="inline-flex items-center justify-center w-[56px] h-[32px] rounded-[8px] bg-[#D1FAE5] text-[#065F46] font-[500] text-[14px]">
                      {s.quantity}
                    </span>
                  </td>
                  <td className="px-[16px] py-[12px] text-[#4B5563]">
                    {new Date(s.date_in).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    •{" "}
                    {new Date(s.date_in).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-[16px] py-[12px]">
                    <span className="inline-flex items-center px-[12px] py-[4px] rounded-full text-[14px] font-[500] bg-[#DBEAFE] text-[#1E40AF]">
                      {s.manufacturer ?? "N/A"}
                    </span>
                  </td>
                  <td className="px-[16px] py-[12px] text-[#374151]">
                    {s.note || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
