import { useEffect, useState } from "react";
import api from "../services/api";
import Link from "next/link";
import InventoryTable from "../components/InventoryTable";
import StockOutTable from "../components/StockOutTable";
import AlertsTable from "../components/AlertsTable";
import MonthlyChart from "../components/MonthlyChart";
import {
  InventoryItem,
  StockInItem,
  StockOutItem,
  AlertItem,
  TotalInventoryItem,
} from "../types";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stockOut, setStockOut] = useState<StockOutItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [totalInventory, setTotalInventory] = useState<TotalInventoryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await api.get<InventoryItem[]>("/inventory");
        setInventory(invRes.data);

        const stockOutRes = await api.get<StockOutItem[]>("/stock-out?limit=5");
        setStockOut(stockOutRes.data);

        const alertsRes = await api.get<AlertItem[]>("/alerts?threshold=10");
        setAlerts(alertsRes.data);

        const totalRes = await api.get<TotalInventoryItem[]>(
          "/total-inventory"
        );
        setTotalInventory(totalRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container max-w-[1200px] mx-auto py-[32px]">
      {/* Tiêu đề chính */}
      <h1 className="text-center text-[28px] font-[800] mb-[32px] text-[#7B68EE] tracking-[1px] drop-shadow-sm font-arial">
        📦 Kho Trúc Anh
      </h1>

      {/* Navigation buttons */}
      <div className="mb-[28px] flex flex-wrap gap-[16px] justify-evenly">
        <Link
          href="/stock-in/StockInPage"
          className="no-underline flex items-center px-[16px] py-[10px] rounded-[6px] bg-[#2563EB] hover:bg-[#1D4ED8] text-[#ffffff] font-[600] text-[15px] shadow-[0_2px_6px_rgba(37,99,235,0.25)] transition-all"
        >
          📥 Tạo phiếu nhập kho
        </Link>

        <Link
          href="/stock-out/StockOutPage"
          className="no-underline flex items-center px-[16px] py-[10px] rounded-[6px] bg-[#14b8a6] hover:bg-[#0d9488] text-[#ffffff] font-[600] text-[15px] shadow-[0_2px_6px_rgba(20,184,166,0.25)] transition-all"
        >
          📤 Tạo phiếu xuất kho
        </Link>

        <Link
          href="/inventory/inventoryPage"
          className="no-underline flex items-center px-[16px] py-[10px] rounded-[6px] bg-[#16a34a] hover:bg-[#15803d] text-[#ffffff] font-[600] text-[15px] shadow-[0_2px_6px_rgba(22,163,74,0.25)] transition-all"
        >
          📦 Xem tồn kho
        </Link>
        
        <Link
          href="/subWarehouse/subWarehousePage"
          className="no-underline flex items-center px-[16px] py-[10px] rounded-[6px] bg-[#16a34a] hover:bg-[#15803d] text-[#ffffff] font-[600] text-[15px] shadow-[0_2px_6px_rgba(22,163,74,0.25)] transition-all"
        >
          🏢 Kho con
        </Link>
        
        <Link
          href="/warehouse/warehousePage"
          className="no-underline flex items-center px-[16px] py-[10px] rounded-[6px] bg-[#10b981] hover:bg-[#059669] text-[#ffffff] font-[600] text-[15px] shadow-[0_2px_6px_rgba(16,185,129,0.25)] transition-all"
        >
          🏭 Danh sách kho
        </Link>
        
        <Link
          href="/warehouse-transfer/warehouseTransferPage"
          className="no-underline flex items-center px-[16px] py-[10px] rounded-[6px] bg-[#f59e0b] hover:bg-[#d97706] text-[#ffffff] font-[600] text-[15px] shadow-[0_2px_6px_rgba(245,158,11,0.25)] transition-all"
        >
          🔄 Chuyển kho
        </Link>
        
        <Link
          href="/report/monthly"
          className="no-underline flex items-center px-[16px] py-[10px] rounded-[6px] bg-[#3b82f6] hover:bg-[#2563eb] text-[#ffffff] font-[600] text-[15px] shadow-[0_2px_6px_rgba(59,130,246,0.25)] transition-all"
        >
          📊 Xem báo cáo nhập/xuất theo tháng
        </Link>
      </div>

      {/* Các section */}
      <div className="flex flex-col gap-[28px]">
        {/* Tồn kho */}
        <section className="bg-[#ffffff] rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-[#E5E7EB] overflow-hidden">
          <div className="bg-gradient-to-r from-[#7B68EE] to-[#9370DB] px-[24px] py-[14px]">
            <h2 className="text-[20px] font-[700] text-[#ffffff] m-0">
              📋 Tồn kho
            </h2>
          </div>
          <div className="p-[24px]">
            <InventoryTable data={inventory} />
          </div>
        </section>

        {/* Sản phẩm xuất kho */}
        <section className="bg-[#ffffff] rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-[#E5E7EB] overflow-hidden">
          <div className="bg-gradient-to-r from-[#7B68EE] to-[#9370DB] px-[24px] py-[14px]">
            <h2 className="text-[20px] font-[700] text-[#ffffff] m-0">
              📤 Sản phẩm xuất kho
            </h2>
          </div>
          <div className="p-[24px]">
            <StockOutTable data={stockOut} />
          </div>
        </section>

        {/* Tồn kho thấp */}
        <section className="bg-[#ffffff] rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-[#E5E7EB] overflow-hidden">
          <div className="bg-gradient-to-r from-[#7B68EE] to-[#9370DB] px-[24px] py-[14px]">
            <h2 className="text-[20px] font-[700] text-[#ffffff] m-0">
              ⚠️ Tồn kho thấp
            </h2>
          </div>
          <div className="p-[24px]">
            <AlertsTable data={alerts} />
          </div>
        </section>

        {/* Tổng sản phẩm tồn kho */}
        <section className="bg-[#ffffff] rounded-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-[#E5E7EB] overflow-hidden">
          <div className="bg-gradient-to-r from-[#7B68EE] to-[#9370DB] px-[24px] py-[14px]">
            <h2 className="text-[20px] font-[700] text-[#ffffff] m-0">
              📊 Tổng sản phẩm tồn kho
            </h2>
          </div>
          <div className="p-[24px]">
            <MonthlyChart data={totalInventory} />
          </div>
        </section>
      </div>
    </div>
  );
}
