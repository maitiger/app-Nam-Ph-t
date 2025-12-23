
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Download, Printer, X } from 'lucide-react';
import { InventoryRecord, InventoryItem } from '../types';
import * as xlsx from 'xlsx';
import { generateNextId } from '../services/storageService';

interface InventoryFormProps {
  onSave: (record: InventoryRecord) => void;
  allRecords: InventoryRecord[];
  initialData?: InventoryRecord;
  onCancel?: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ onSave, allRecords, initialData, onCancel }) => {
  const [recipientUnit, setRecipientUnit] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverTripCost, setDriverTripCost] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<InventoryItem[]>([
    { id: '1', stt: 1, itemName: '', quantity: 0, unitPrice: 0, total: 0 }
  ]);
  const [notes, setNotes] = useState('');

  // Update form when initialData changes (Edit Mode)
  useEffect(() => {
    if (initialData) {
      setRecipientUnit(initialData.recipientUnit);
      setDriverName(initialData.driverName);
      setDriverTripCost(initialData.driverTripCost);
      setDate(initialData.date);
      setItems(initialData.items);
      setNotes(initialData.notes || '');
    } else {
      // Reset form for New Mode
      setRecipientUnit('');
      setDriverName('');
      setDriverTripCost(0);
      setDate(new Date().toISOString().split('T')[0]);
      setItems([{ id: Date.now().toString(), stt: 1, itemName: '', quantity: 0, unitPrice: 0, total: 0 }]);
      setNotes('');
    }
  }, [initialData]);

  const addItem = () => {
    const newId = Date.now().toString();
    setItems([...items, { id: newId, stt: items.length + 1, itemName: '', quantity: 0, unitPrice: 0, total: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    const updated = items.filter(item => item.id !== id).map((item, idx) => ({ ...item, stt: idx + 1 }));
    setItems(updated);
  };

  const updateItem = (id: string, field: keyof InventoryItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const itemsTotal = items.reduce((sum, item) => sum + item.total, 0);
  const grandTotal = itemsTotal + Number(driverTripCost);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientUnit || items.some(i => !i.itemName)) {
      alert('Vui lòng nhập đầy đủ thông tin đơn vị nhận và tên mặt hàng.');
      return;
    }

    // Generate YY.MM.xxx ID if it's a new record
    const finalId = initialData?.id || generateNextId(allRecords);

    const newRecord: InventoryRecord = {
      id: finalId,
      date,
      recipientUnit,
      driverName,
      driverTripCost: Number(driverTripCost),
      items,
      grandTotal,
      notes
    };

    onSave(newRecord);
  };

  const exportToExcel = () => {
    const data = [
      ["CÔNG TY TNHH NAM PHÁT VIỆT NAM"],
      ["PHIẾU NHẬP XUẤT HÀNG HÓA"],
      [""],
      ["Mã phiếu:", initialData?.id || "Chưa tạo"],
      ["Ngày:", date],
      ["Đơn vị nhận:", recipientUnit],
      ["Lái xe:", driverName],
      ["Giá chuyến xe:", driverTripCost.toLocaleString()],
      [""],
      ["STT", "Mặt hàng", "Số lượng", "Đơn giá", "Thành tiền"],
      ...items.map(i => [i.stt, i.itemName, i.quantity, i.unitPrice, i.total]),
      [""],
      ["", "", "", "TỔNG CỘNG:", grandTotal.toLocaleString()],
      [""],
      ["Bên xuất", "", "Bên vận chuyển", "", "Bên nhập"],
      ["(Ký tên)", "", "(Ký tên)", "", "(Ký tên)"]
    ];

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "Phieu_Nhap_Xuat");
    xlsx.writeFile(wb, `NamPhat_Phieu_${date}_${recipientUnit}.xlsx`);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Logo/Banner Section */}
        <div className="p-8 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              NP
            </div>
            <div>
              <h1 className="text-2xl font-bold text-indigo-900 uppercase leading-tight">Công ty TNHH Nam Phát Việt Nam</h1>
              <p className="text-slate-500 font-medium">
                {initialData ? `Chỉnh sửa Phiếu #${initialData.id}` : 'Lập Phiếu Nhập Xuất Mới'}
              </p>
            </div>
          </div>
          <div className="text-right">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ngày lập phiếu</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="bg-white border-slate-200 rounded-lg text-slate-700 font-semibold focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Đơn vị nhận hàng <span className="text-red-500">*</span></label>
              <input 
                required
                type="text" 
                value={recipientUnit}
                onChange={(e) => setRecipientUnit(e.target.value)}
                placeholder="Nhập tên đơn vị/cá nhân"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Tài xế vận chuyển</label>
              <input 
                type="text" 
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Nhập tên lái xe"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Giá cước chuyến xe</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={driverTripCost}
                  onChange={(e) => setDriverTripCost(Number(e.target.value))}
                  placeholder="0"
                  className="w-full pl-4 pr-12 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">VNĐ</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                Danh sách mặt hàng
                <span className="ml-3 px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">{items.length} mặt hàng</span>
              </h3>
              <button 
                type="button" 
                onClick={addItem}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm py-2 px-4 bg-indigo-50 rounded-lg transition-colors"
              >
                <Plus size={18} />
                <span>Thêm dòng</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase w-16 text-center">STT</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase">Mặt hàng</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase w-32">Số lượng</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase w-40">Đơn giá</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase w-40">Thành tiền</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-500 uppercase w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-2 text-sm text-slate-500 text-center font-medium">{item.stt}</td>
                      <td className="px-4 py-2">
                        <input 
                          type="text" 
                          value={item.itemName}
                          onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                          placeholder="Tên nguyên vật liệu..."
                          className="w-full px-3 py-1.5 bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-sm"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input 
                          type="number" 
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-transparent border border-transparent hover:border-slate-200 focus:border-indigo-500 focus:bg-white rounded-lg outline-none transition-all text-sm font-medium text-slate-700"
                        />
                      </td>
                      <td className="px-4 py-2 text-sm font-bold text-slate-900">
                        {item.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        <button 
                          type="button" 
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50/80 font-bold border-t border-slate-200">
                    <td colSpan={4} className="px-4 py-4 text-right text-slate-600 uppercase text-xs tracking-wider">Tổng giá trị hàng hóa</td>
                    <td className="px-4 py-4 text-slate-900 text-base">{itemsTotal.toLocaleString()}</td>
                    <td></td>
                  </tr>
                  <tr className="bg-indigo-50/50 font-bold border-t border-slate-200">
                    <td colSpan={4} className="px-4 py-4 text-right text-indigo-700 uppercase text-xs tracking-wider">Tổng cộng cuối cùng (Gồm vận chuyển)</td>
                    <td className="px-4 py-4 text-indigo-900 text-lg underline decoration-2 decoration-indigo-300">{grandTotal.toLocaleString()}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes & Signatures Mockup */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-slate-100">
            <div className="md:col-span-1">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Ghi chú thêm</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Nhập ghi chú (nếu có)..."
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              ></textarea>
            </div>
            <div className="md:col-span-2 grid grid-cols-3 text-center">
              <div>
                <p className="font-bold text-slate-800 text-sm">Bên Xuất</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase">(Ký, họ tên)</p>
                <div className="h-24 flex items-center justify-center text-slate-300 italic text-xs">Phần ký xác nhận</div>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Bên Vận Chuyển</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase">(Ký, họ tên)</p>
                <div className="h-24 flex items-center justify-center text-slate-300 italic text-xs">Phần ký xác nhận</div>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Bên Nhập</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase">(Ký, họ tên)</p>
                <div className="h-24 flex items-center justify-center text-slate-300 italic text-xs">Phần ký xác nhận</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-8">
            {initialData && onCancel && (
              <button 
                type="button" 
                onClick={onCancel}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-white text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all border border-slate-200"
              >
                <X size={20} />
                <span>Hủy bỏ</span>
              </button>
            )}
            <button 
              type="button" 
              onClick={exportToExcel}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-emerald-50 text-emerald-700 font-bold rounded-xl hover:bg-emerald-100 transition-all border border-emerald-200"
            >
              <Download size={20} />
              <span>Xuất Excel</span>
            </button>
            <button 
              type="button" 
              onClick={() => window.print()}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all border border-slate-200"
            >
              <Printer size={20} />
              <span>In Phiếu</span>
            </button>
            <button 
              type="submit" 
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              <Save size={20} />
              <span>{initialData ? 'Cập nhật đơn hàng' : 'Lưu đơn hàng'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
