// src/components/AlertsTable.tsx
import React from "react";

interface AlertItem {
  product: string;
  warehouse: string;
  quantity: number;
}

interface AlertsTableProps {
  data: AlertItem[];
}

const AlertsTable: React.FC<AlertsTableProps> = ({ data }) => {
  return (
    <div className="max-w-[1200px] mx-auto bg-white rounded-[16px] shadow-[0_4px_24px_0_rgba(123,104,238,0.08)] border border-[#E5E7EB] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7B68EE] to-[#9370DB] px-[32px] py-[20px]">
        <h2 className="text-[#fff] text-[20px] font-[700] text-center m-0 font-arial">
          🚨 Cảnh báo số lượng tồn kho
        </h2>
      </div>

      {/* Table */}
      <div className="p-[24px]">
        <div className="overflow-x-auto rounded-[12px] border border-[#E5E7EB] shadow-[0_1px_4px_0_rgba(123,104,238,0.04)]">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6]">
                <th className="px-[24px] py-[16px] text-left text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                  🏷️ Sản phẩm
                </th>
                <th className="px-[24px] py-[16px] text-left text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                  🏪 Kho
                </th>
                <th className="px-[24px] py-[16px] text-center text-[15px] font-[600] text-[#374151] border-b-[2px] border-[#7B68EE4D]">
                  📊 Số lượng
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-[#F3F4F6] transition-all hover:bg-gradient-to-r hover:from-[#EEF2FF] hover:to-[#F3E8FF]"
                >
                  <td className="px-[24px] py-[16px] text-[#1F2937] font-[500]">
                    {item.product}
                  </td>
                  <td className="px-[24px] py-[16px] text-[#4B5563]">
                    <span className="inline-flex items-center px-[12px] py-[4px] rounded-full text-[14px] font-[500] bg-[#ede9fe] text-[#7B68EE]">
                      {item.warehouse}
                    </span>
                  </td>
                  <td className="px-[24px] py-[16px] text-center">
                    {item.quantity < 10 ? (
                      <span className="inline-flex items-center justify-center w-[56px] h-[32px] rounded-[8px] bg-[#FEE2E2] text-[#B91C1C] font-[600] text-[14px]">
                        {item.quantity}
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-[56px] h-[32px] rounded-[8px] bg-[#D1FAE5] text-[#065F46] font-[500] text-[14px]">
                        {item.quantity}
                      </span>
                    )}
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

export default AlertsTable;
