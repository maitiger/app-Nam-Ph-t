
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Building2,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import InventoryForm from './components/InventoryForm';
import InventoryList from './components/InventoryList';
import DebtSummary from './components/DebtSummary';
import InventoryDetail from './components/InventoryDetail';
import { InventoryRecord, AppView } from './types';
import * as storage from './services/storageService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [records, setRecords] = useState<InventoryRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<InventoryRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<InventoryRecord | null>(null);

  useEffect(() => {
    const saved = storage.loadRecords();
    setRecords(saved);
  }, []);

  const handleSaveRecord = (record: InventoryRecord) => {
    let updated: InventoryRecord[];
    const exists = records.find(r => r.id === record.id);
    
    if (exists) {
      updated = records.map(r => r.id === record.id ? record : r);
    } else {
      updated = [record, ...records];
    }
    
    setRecords(updated);
    storage.saveRecords(updated);
    setEditingRecord(null);
    setView('history');
  };

  const handleDeleteRecord = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      const updated = records.filter(r => r.id !== id);
      setRecords(updated);
      storage.saveRecords(updated);
    }
  };

  const handleEdit = (record: InventoryRecord) => {
    setEditingRecord(record);
    setView('entry');
  };

  const handleViewDetail = (record: InventoryRecord) => {
    setViewingRecord(record);
  };

  const handleCreateNew = () => {
    setEditingRecord(null);
    setView('entry');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-indigo-900 text-white flex-shrink-0 no-print">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-white p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-indigo-900" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Nam Phát</h1>
              <p className="text-xs text-indigo-300">Việt Nam Co., Ltd</p>
            </div>
          </div>

          <div className="space-y-1">
            <NavItem 
              active={view === 'dashboard'} 
              onClick={() => { setEditingRecord(null); setView('dashboard'); }}
              icon={<LayoutDashboard size={20} />}
              label="Bảng điều khiển"
            />
            <NavItem 
              active={view === 'entry' && !editingRecord} 
              onClick={handleCreateNew}
              icon={<PlusCircle size={20} />}
              label="Tạo phiếu mới"
            />
            <NavItem 
              active={view === 'history'} 
              onClick={() => { setEditingRecord(null); setView('history'); }}
              icon={<History size={20} />}
              label="Lịch sử nhập xuất"
            />
            <NavItem 
              active={view === 'debts'} 
              onClick={() => { setEditingRecord(null); setView('debts'); }}
              icon={<TrendingUp size={20} />}
              label="Tổng hợp công nợ"
            />
          </div>
        </div>
        <div className="mt-auto p-6 border-t border-indigo-800 hidden md:block">
          <p className="text-xs text-indigo-400">© 2024 Nam Phát Việt Nam</p>
          <p className="text-[10px] text-indigo-500 mt-1">Hệ thống Quản lý Vật tư v1.0</p>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Header viewName={editingRecord ? 'Chỉnh sửa phiếu' : getViewName(view)} />
        
        <div className="p-4 md:p-8">
          {view === 'dashboard' && <Dashboard records={records} setView={setView} />}
          {view === 'entry' && (
            <InventoryForm 
              onSave={handleSaveRecord} 
              allRecords={records}
              initialData={editingRecord || undefined} 
              onCancel={() => { setEditingRecord(null); setView('history'); }}
            />
          )}
          {view === 'history' && <InventoryList records={records} onDelete={handleDeleteRecord} onEdit={handleEdit} onView={handleViewDetail} />}
          {view === 'debts' && <DebtSummary records={records} onViewDetail={handleViewDetail} onSeeHistory={() => setView('history')} />}
        </div>
      </main>

      {/* Detail Overlay Modal */}
      {viewingRecord && (
        <InventoryDetail record={viewingRecord} onClose={() => setViewingRecord(null)} />
      )}
    </div>
  );
};

interface NavItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-indigo-700 text-white shadow-lg shadow-indigo-900/50' 
        : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
    {active && <ChevronRight size={16} className="ml-auto opacity-50" />}
  </button>
);

const getViewName = (view: AppView): string => {
  switch (view) {
    case 'dashboard': return 'Bảng điều khiển';
    case 'entry': return 'Tạo phiếu nhập xuất';
    case 'history': return 'Lịch sử giao dịch';
    case 'debts': return 'Quản lý công nợ';
    default: return 'Trang chủ';
  }
};

export default App;
