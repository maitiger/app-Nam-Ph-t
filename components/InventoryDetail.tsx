
import React from 'react';
import { InventoryRecord } from '../types';
import { X, Printer, Download, FileText, Truck, UserCheck } from 'lucide-react';
import * as xlsx from 'xlsx';

interface InventoryDetailProps {
  record: InventoryRecord;
  onClose: () => void;
}

const InventoryDetail: React.FC<InventoryDetailProps> = ({ record, onClose }) => {
  const exportToExcel = () => {
    const data = [
      ["CÔNG TY TNHH NAM PHÁT VIỆT NAM"],
      ["PHIẾU NHẬP XUẤT HÀNG HÓA CHI TIẾT"],
      [""],
      ["Mã phiếu:", record.id],
      ["Ngày:", record.date],
      ["Đơn vị nhận:", record.recipientUnit],
      ["Lái xe:", record.driverName],
      ["Giá chuyến xe:", record.driverTripCost.toLocaleString() + " VNĐ"],
      [""],
      ["STT", "Mặt hàng", "Số lượng", "Đơn giá", "Thành tiền"],
      ...record.items.map(i => [i.stt, i.itemName, i.quantity, i.unitPrice, i.total]),
      [""],
      ["", "", "", "TỔNG CỘNG:", record.grandTotal.toLocaleString() + " VNĐ"],
      [""],
      ["Ghi chú:", record.notes || "Không có"],
      [""],
      ["Bên xuất", "", "Bên vận chuyển", "", "Bên nhập"],
      ["(Ký tên)", "", "(Ký tên)", "", "(Ký tên)"]
    ];

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, "ChiTietPhieu");
    xlsx.writeFile(wb, `NamPhat_Detail_${record.id}.xlsx`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Chi tiết phiếu #{record.id}</h3>
              <p className="text-xs text-slate-500">Đối chiếu dữ liệu kho & vận chuyển</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={exportToExcel}
              className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
              title="Xuất Excel"
            >
              <Download size={20} />
            </button>
            <button 
              onClick={() => window.print()}
              className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="In phiếu"
            >
              <Printer size={20} />
            </button>
            <button 
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors ml-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Formal Document Content */}
        <div className="p-12 print:p-0" id="printable-voucher">
          <div className="border-4 border-double border-slate-200 p-8 rounded-sm relative">
            {/* Watermark style logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
              <h1 className="text-9xl font-black rotate-[-30deg]">NAM PHÁT</h1>
            </div>

            <div className="flex flex-col md:flex-row justify-between mb-10 items-start border-b pb-8 border-slate-100">
              <div>
                <h1 className="text-xl font-black text-indigo-900 mb-1">CÔNG TY TNHH NAM PHÁT VIỆT NAM</h1>
                <p className="text-sm text-slate-500">Địa chỉ: KCN Tiên Sơn, Bắc Ninh, Việt Nam</p>
                <p className="text-sm text-slate-500">Hotline: 09xx-xxx-xxx</p>
              </div>
              <div className="text-right mt-4 md:mt-0">
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Phiếu Nhập Xuất</h2>
                <p className="text-slate-500 font-medium">Số: <span className="text-indigo-600 font-bold">{record.id}</span></p>
                <p className="text-slate-500 font-medium">Ngày: {record.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="space-y-3 bg-slate-50 p-5 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                  <UserCheck size={14} className="mr-2" /> Thông tin đối tác
                </h4>
                <p className="text-lg font-bold text-slate-800">{record.recipientUnit}</p>
                <p className="text-sm text-slate-600 italic">"{record.notes || 'Không có ghi chú đặc biệt'}"</p>
              </div>
              <div className="space-y-3 bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100/50">
                <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center">
                  <Truck size={14} className="mr-2" /> Thông tin vận chuyển
                </h4>
                <p className="text-sm font-semibold text-slate-700">Tài xế: <span className="text-indigo-700">{record.driverName || 'N/A'}</span></p>
                <p className="text-sm font-semibold text-slate-700">Cước vận chuyển: <span className="text-indigo-700">{record.driverTripCost.toLocaleString()} VNĐ</span></p>
              </div>
            </div>

            <table className="w-full mb-10 border-collapse">
              <thead>
                <tr className="border-y-2 border-slate-800">
                  <th className="py-3 px-2 text-left text-xs font-black uppercase w-12">STT</th>
                  <th className="py-3 px-2 text-left text-xs font-black uppercase">Mặt hàng/Nguyên vật liệu</th>
                  <th className="py-3 px-2 text-center text-xs font-black uppercase w-24">Số lượng</th>
                  <th className="py-3 px-2 text-right text-xs font-black uppercase w-32">Đơn giá</th>
                  <th className="py-3 px-2 text-right text-xs font-black uppercase w-32">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {record.items.map((item, idx) => (
                  <tr key={item.id}>
                    <td className="py-4 px-2 text-sm text-slate-500">{idx + 1}</td>
                    <td className="py-4 px-2 text-sm font-bold text-slate-800">{item.itemName}</td>
                    <td className="py-4 px-2 text-sm text-center font-medium text-slate-700">{item.quantity}</td>
                    <td className="py-4 px-2 text-sm text-right text-slate-600">{item.unitPrice.toLocaleString()}</td>
                    <td className="py-4 px-2 text-sm text-right font-bold text-slate-900">{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-800">
                  <td colSpan={4} className="py-4 px-2 text-right text-sm font-bold uppercase tracking-wider text-slate-500">Cước vận chuyển</td>
                  <td className="py-4 px-2 text-right text-sm font-bold text-slate-900">{record.driverTripCost.toLocaleString()}</td>
                </tr>
                <tr className="bg-slate-900 text-white">
                  <td colSpan={4} className="py-4 px-4 text-right text-sm font-black uppercase tracking-widest">Tổng thanh toán</td>
                  <td className="py-4 px-4 text-right text-lg font-black">{record.grandTotal.toLocaleString()} VNĐ</td>
                </tr>
              </tfoot>
            </table>

            <div className="grid grid-cols-3 gap-4 text-center mt-16 pb-10">
              <div>
                <p className="font-black text-slate-800 mb-20 text-sm uppercase">Người lập phiếu</p>
                <div className="w-32 h-px bg-slate-200 mx-auto mb-2"></div>
                <p className="text-xs text-slate-400 font-bold">BÊN XUẤT</p>
              </div>
              <div>
                <p className="font-black text-slate-800 mb-20 text-sm uppercase">Đơn vị vận chuyển</p>
                <div className="w-32 h-px bg-slate-200 mx-auto mb-2"></div>
                <p className="text-xs text-slate-400 font-bold uppercase">{record.driverName || 'Bên thứ 3'}</p>
              </div>
              <div>
                <p className="font-black text-slate-800 mb-20 text-sm uppercase">Người nhận hàng</p>
                <div className="w-32 h-px bg-slate-200 mx-auto mb-2"></div>
                <p className="text-xs text-slate-400 font-bold uppercase">{record.recipientUnit}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center space-x-4">
           <button 
             onClick={onClose}
             className="px-8 py-3 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-all shadow-lg"
           >
             Đóng cửa sổ đối chiếu
           </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetail;
