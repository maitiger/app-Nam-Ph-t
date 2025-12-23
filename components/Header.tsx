
import React from 'react';
import { User, Bell, Search } from 'lucide-react';

interface HeaderProps {
  viewName: string;
}

const Header: React.FC<HeaderProps> = ({ viewName }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 no-print">
      <h2 className="text-xl font-bold text-slate-800">{viewName}</h2>
      
      <div className="flex items-center space-x-6">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Tìm kiếm phiếu..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>
        
        <button className="text-slate-500 hover:text-indigo-600 relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="flex items-center space-x-3 border-l pl-6 border-slate-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">Admin Nam Phát</p>
            <p className="text-xs text-slate-500">Quản lý kho</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 border-2 border-white shadow-sm">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
