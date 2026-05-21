"use client";
import { useState, useEffect } from "react";
import { Truck, Plus, Trash2 } from "lucide-react";
import OrderDetailModal from "@/components/OrderDetailModal";

export default function DeliveriesPage() {
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({ customerName: '', customerPhone: '', address: '', courier: '대한통운', trackingNumber: '' });
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    const res = await fetch('/api/deliveries');
    const json = await res.json();
    if (json.success) setData(json.deliveries);
  };
  const addData = async (e: any) => {
    e.preventDefault();
    if (!form.customerName || !form.customerPhone || !form.address) return alert('필수 입력 누락');
    const res = await fetch('/api/deliveries', { method: 'POST', body: JSON.stringify(form) });
    if ((await res.json()).success) { setForm({customerName:'',customerPhone:'',address:'',courier:'대한통운',trackingNumber:''}); fetchData(); }
  };
  const deleteData = async (id: string) => {
    if(!confirm('삭제하시겠습니까?')) return;
    const res = await fetch('/api/deliveries?id=' + id, { method: 'DELETE' });
    if ((await res.json()).success) fetchData();
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-slate-800 flex items-center"><Truck className="w-8 h-8 mr-3 text-amber-500" /> 배송내역 관리</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-4">새 배송 등록</h2>
        <form onSubmit={addData} className="flex flex-col space-y-3">
          <div className="flex space-x-3">
            <input type="text" placeholder="고객명" value={form.customerName} onChange={e=>setForm({...form, customerName: e.target.value})} className="flex-1 border rounded-lg px-3 py-2 outline-none" />
            <input type="text" placeholder="연락처" value={form.customerPhone} onChange={e=>setForm({...form, customerPhone: e.target.value})} className="flex-1 border rounded-lg px-3 py-2 outline-none" />
            <select value={form.courier} onChange={e=>setForm({...form, courier: e.target.value})} className="border rounded-lg px-3 py-2 outline-none">
              <option>대한통운</option><option>우체국</option><option>로젠택배</option><option>한진택배</option>
            </select>
            <input type="text" placeholder="운송장번호" value={form.trackingNumber} onChange={e=>setForm({...form, trackingNumber: e.target.value})} className="flex-1 border rounded-lg px-3 py-2 outline-none" />
          </div>
          <div className="flex space-x-3">
            <input type="text" placeholder="배송지 주소" value={form.address} onChange={e=>setForm({...form, address: e.target.value})} className="flex-[3] border rounded-lg px-3 py-2 outline-none" />
            <button className="flex-1 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 flex items-center justify-center"><Plus className="w-4 h-4 mr-1"/> 배송 등록</button>
          </div>
        </form>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-sm">
              <th className="p-4">고객명</th>
              <th className="p-4">연관 주문</th>
              <th className="p-4">연락처</th>
              <th className="p-4">주소</th>
              <th className="p-4">택배사</th>
              <th className="p-4">운송장번호</th>
              <th className="p-4">상태</th>
              <th className="p-4">관리</th>
            </tr>
          </thead>
          <tbody>
            {data.map(t => (
              <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-800">{t.customer_name}</td>
                <td className="p-4">
                  {t.order_id ? (
                    <button 
                      onClick={() => setActiveOrderId(t.order_id || null)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-mono font-bold tracking-tight transition-all active:scale-95"
                    >
                      ORD-{t.order_id.slice(-6).toUpperCase()}
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-light">-</span>
                  )}
                </td>
                <td className="p-4">{t.customer_phone}</td>
                <td className="p-4 text-xs text-slate-600">{t.address}</td>
                <td className="p-4">{t.courier}</td>
                <td className="p-4 font-mono text-amber-600">{t.tracking_number || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    t.status === '배송완료' 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {t.status}
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={()=>deleteData(t.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  배송 내역이 존재하지 않습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {activeOrderId && (
        <OrderDetailModal 
          orderId={activeOrderId} 
          onClose={() => setActiveOrderId(null)} 
        />
      )}
    </div>
  );
}
