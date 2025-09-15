// src/components/StockOutTable.tsx
import React from "react";

interface StockOutItem {
  stock_out_id: number;
  product: string;
  quantity: number;
  date_out: string;
  store: string | null;
}

interface StockOutTableProps {
  data: StockOutItem[];
}

const StockOutTable: React.FC<StockOutTableProps> = ({ data }) => {
  return (
    <div className="max-w-[1200px] mx-auto bg-[#ffffff] rounded-[16px] shadow-[0_4px_24px_0_rgba(123,104,238,0.08)] border border-[#E5E7EB] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7B68EE] to-[#9370DB] px-[32px] py-[24px]">
        <h2 className="text-[#ffffff] text-[24px] font-[700] text-center m-0 font-arial"
        >
          📤 Danh sách xuất kho
        </h2>
      </div>

      {/* Table */}
      <div className="p-[32px]">
        <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_4px_0_rgba(123,104,238,0.04)]">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6]">
                <th className="px-[24px] py-[16px] text-center text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D] w-[12%]">
                  🆔 Mã xuất
                </th>
                <th className="px-[24px] py-[16px] text-left text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D] w-[32%]">
                  🏷️ Sản phẩm
                </th>
                <th className="px-[24px] py-[16px] text-center text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D] w-[14%]">
                  📊 Số lượng
                </th>
                <th className="px-[24px] py-[16px] text-left text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D] w-[26%]">
                  📅 Ngày xuất hàng
                </th>
                <th className="px-[24px] py-[16px] text-left text-[16px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D] w-[16%]">
                  🏬 Cửa hàng
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.stock_out_id}
                  className="border-b border-[#F3F4F6] transition-all cursor-pointer hover:bg-gradient-to-r hover:from-[#EEF2FF] hover:to-[#F3E8FF]"
                >
                  <td className="px-[24px] py-[16px] text-center text-[#1F2937] font-[500]">
                    {item.stock_out_id}
                  </td>
                  <td className="px-[24px] py-[16px] text-[#1F2937] font-[500]">
                    {item.product}
                  </td>
                  <td className="px-[24px] py-[16px] text-center">
                    <span className="inline-flex items-center justify-center w-[48px] h-[32px] rounded-[8px] bg-[#FDE68A] text-[#92400E] font-[500] text-[14px]">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-[24px] py-[16px] text-[#4B5563] font-[500] text-[14px]">
                    {new Date(item.date_out).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    •{" "}
                    {new Date(item.date_out).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-[24px] py-[16px] text-[#4B5563]">
                    <span className="inline-flex items-center px-[12px] py-[4px] rounded-full text-[14px] font-[500] bg-[#DBEAFE] text-[#1E40AF]">
                      {item.store || "N/A"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockOutTable;
