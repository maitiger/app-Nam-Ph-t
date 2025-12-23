
import React from 'react';
import { InventoryRecord } from '../types';
import { Eye, Trash2, Printer, Download, FileText, Edit2 } from 'lucide-react';
import * as xlsx from 'xlsx';

interface InventoryListProps {
  records: InventoryRecord[];
  onDelete: (id: string) => void;
  onEdit: (record: InventoryRecord) => void;
  onView: (record: InventoryRecord) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ records, onDelete, onEdit, onView }) => {
  
  const exportAllToExcel = () => {
    const data = records.flatMap(record => 
      record.items.map(item => ({
        "Mã phiếu": record.id,
        "Ngày": record.date,
        "Đơn vị nhận": record.recipientUnit,
        "Lái xe": record.driverName,
        "Giá chuyến": record.driverTripCost,
        "STT": item.stt,
        "Mặt hàng": item.itemName,
        "Số lượng": item.quantity,
        "Đơn giá": item.unitPrice,
        "Thành tiền": item.total,
        "Tổng đơn": record.grandTotal
      }))
    );

    const ws = xlsx.utils.json_to_sheet(data);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "LichSuGiaoDich");
    xlsx.writeFile(wb, "NamPhat_TongHop_LichSu.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Lịch sử giao dịch</h2>
        <button 
          onClick={exportAllToExcel}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-semibold shadow-md shadow-emerald-200"
        >
          <Download size={18} />
          <span>Tải toàn bộ báo cáo</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày tháng</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Đơn vị nhận</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin xe</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mặt hàng</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.length > 0 ? (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{record.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <FileText size={16} />
                        </div>
                        <span className="font-bold text-slate-900">{record.recipientUnit}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">{record.driverName || 'N/A'}</p>
                      <p className="text-xs text-slate-400">Cước: {record.driverTripCost.toLocaleString()} VNĐ</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">
                        {record.items.length} mặt hàng
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-indigo-700">{record.grandTotal.toLocaleString()} VNĐ</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onView(record)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Xem chi tiết & Đối chiếu"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => onEdit(record)}
                          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Chỉnh sửa phiếu"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            // Printing logic can also be simplified here or called from common service
                            window.print();
                          }}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="In phiếu"
                        >
                          <Printer size={18} />
                        </button>
                        <button 
                          onClick={() => onDelete(record.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Xóa">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center text-slate-400">
                    <div className="flex flex-col items-center">
                      <FileText size={48} className="text-slate-200 mb-4" />
                      <p className="text-lg font-medium">Chưa có bản ghi nào</p>
                      <p className="text-sm">Hãy tạo phiếu mới để bắt đầu theo dõi kho</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
