
import React from 'react';
import { InventoryRecord } from '../types';
import { User, DollarSign, ExternalLink, Calendar, ListFilter } from 'lucide-react';

interface DebtSummaryProps {
  records: InventoryRecord[];
  onViewDetail: (record: InventoryRecord) => void;
  onSeeHistory: () => void;
}

const DebtSummary: React.FC<DebtSummaryProps> = ({ records, onViewDetail, onSeeHistory }) => {
  // Group records by Recipient Unit
  const grouped = records.reduce((acc, record) => {
    const unit = record.recipientUnit;
    if (!acc[unit]) {
      acc[unit] = {
        name: unit,
        totalDebt: 0,
        lastTransaction: record.date,
        transactionCount: 0,
        latestRecord: record
      };
    }
    acc[unit].totalDebt += record.grandTotal;
    acc[unit].transactionCount += 1;
    
    // Track the actual latest record for detailed view
    if (new Date(record.date) >= new Date(acc[unit].lastTransaction)) {
      acc[unit].lastTransaction = record.date;
      acc[unit].latestRecord = record;
    }
    return acc;
  }, {} as Record<string, { 
    name: string, 
    totalDebt: number, 
    lastTransaction: string, 
    transactionCount: number,
    latestRecord: InventoryRecord 
  }>);

  const summaryData = Object.values(grouped);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Tổng hợp công nợ đối tác</h2>
          <p className="text-slate-500">Thống kê tổng giá trị hàng hóa theo từng đơn vị nhận</p>
        </div>
        <div className="flex space-x-4">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Tổng công nợ hệ thống</p>
              <p className="text-lg font-bold text-slate-900">
                {summaryData.reduce((sum, item) => sum + item.totalDebt, 0).toLocaleString()} VNĐ
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {summaryData.length > 0 ? (
          summaryData.map((unit) => (
            <div key={unit.name} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <User size={24} />
                </div>
                <button 
                  onClick={onSeeHistory}
                  className="text-slate-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Xem tất cả lịch sử đơn vị này"
                >
                  <ListFilter size={18} />
                </button>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">{unit.name}</h3>
              <p className="text-sm text-slate-500 flex items-center mb-6">
                <Calendar size={14} className="mr-1.5" />
                Giao dịch cuối: {unit.lastTransaction}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-t border-slate-50">
                  <span className="text-xs text-slate-500 font-bold uppercase">Số phiếu giao dịch</span>
                  <span className="font-bold text-slate-900">{unit.transactionCount} phiếu</span>
                </div>
                <div className="flex items-center justify-between py-3 border-t border-slate-50">
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Tổng công nợ</span>
                  <span className="text-xl font-black text-indigo-700">{unit.totalDebt.toLocaleString()} VNĐ</span>
                </div>
              </div>

              <div className="mt-4 pt-4 flex space-x-2">
                <button 
                  onClick={() => onViewDetail(unit.latestRecord)}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
                >
                  Xem phiếu mới nhất
                </button>
                <button 
                  onClick={onSeeHistory}
                  className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Bảng kê
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-400">Không có dữ liệu công nợ để hiển thị</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtSummary;
