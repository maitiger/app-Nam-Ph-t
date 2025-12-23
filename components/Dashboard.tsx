
import React from 'react';
import { InventoryRecord, AppView } from '../types';
// Added PlusCircle to the imports from lucide-react
import { TrendingUp, Package, Users, DollarSign, ArrowUpRight, PlusCircle } from 'lucide-react';

interface DashboardProps {
  records: InventoryRecord[];
  setView: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ records, setView }) => {
  const totalRevenue = records.reduce((sum, r) => sum + r.grandTotal, 0);
  const totalItemsCount = records.reduce((sum, r) => sum + r.items.length, 0);
  const uniqueUnits = new Set(records.map(r => r.recipientUnit)).size;
  const recentRecords = records.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng giá trị xuất" 
          value={`${totalRevenue.toLocaleString()} VNĐ`} 
          icon={<DollarSign className="text-emerald-600" />} 
          bgColor="bg-emerald-50"
          trend="+12%"
        />
        <StatCard 
          title="Tổng mặt hàng" 
          value={totalItemsCount.toString()} 
          icon={<Package className="text-blue-600" />} 
          bgColor="bg-blue-50"
          trend="+5.2%"
        />
        <StatCard 
          title="Đối tác nhận hàng" 
          value={uniqueUnits.toString()} 
          icon={<Users className="text-indigo-600" />} 
          bgColor="bg-indigo-50"
        />
        <StatCard 
          title="Số phiếu đã lập" 
          value={records.length.toString()} 
          icon={<TrendingUp className="text-orange-600" />} 
          bgColor="bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">Giao dịch gần đây</h3>
            <button 
              onClick={() => setView('history')}
              className="text-indigo-600 text-sm font-semibold hover:underline"
            >
              Xem tất cả
            </button>
          </div>
          <div className="divide-y divide-slate-100">
            {recentRecords.length > 0 ? (
              recentRecords.map(record => (
                <div key={record.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <ArrowUpRight size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{record.recipientUnit}</p>
                      <p className="text-xs text-slate-500">{record.date} • {record.items.length} mặt hàng</p>
                    </div>
                  </div>
                  <p className="font-bold text-indigo-700">
                    {record.grandTotal.toLocaleString()} VNĐ
                  </p>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-slate-400">
                Chưa có giao dịch nào được ghi nhận.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-indigo-900 rounded-2xl shadow-xl p-8 text-white">
          <h3 className="font-bold text-xl mb-6">Thao tác nhanh</h3>
          <div className="space-y-4">
            <button 
              onClick={() => setView('entry')}
              className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center space-x-4 px-6 transition-all border border-white/10"
            >
              <PlusCircle className="text-indigo-300" />
              <div className="text-left">
                <p className="font-bold">Lập phiếu mới</p>
                <p className="text-xs text-indigo-200">Nhập xuất vật tư ngay</p>
              </div>
            </button>
            <button 
              onClick={() => setView('debts')}
              className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl flex items-center space-x-4 px-6 transition-all border border-white/10"
            >
              <TrendingUp className="text-indigo-300" />
              <div className="text-left">
                <p className="font-bold">Báo cáo công nợ</p>
                <p className="text-xs text-indigo-200">Xem tổng hợp theo đối tác</p>
              </div>
            </button>
          </div>
          <div className="mt-12 p-4 bg-indigo-800/50 rounded-xl">
            <h4 className="text-sm font-bold text-indigo-200 mb-2 uppercase tracking-widest">Hỗ trợ kỹ thuật</h4>
            <p className="text-xs text-indigo-300 leading-relaxed">
              Nếu gặp sự cố trong quá trình sử dụng hệ thống, vui lòng liên hệ bộ phận IT Nam Phát.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, bgColor, trend }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
    <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
      {icon}
    </div>
    <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
    <p className="text-xl font-bold text-slate-900">{value}</p>
    {trend && (
      <div className="absolute top-6 right-6 flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
        <ArrowUpRight size={10} />
        <span>{trend}</span>
      </div>
    )}
  </div>
);

export default Dashboard;
