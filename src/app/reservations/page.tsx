"use client";
import { useState, useEffect } from "react";
import { CalendarDays, Plus, Trash2 } from "lucide-react";
import OrderDetailModal from "@/components/OrderDetailModal";

export default function ReservationsPage() {
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({ customerName: '', customerPhone: '', serviceName: '', reservationDate: '', reservationTime: '' });

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    const res = await fetch('/api/reservations');
    const json = await res.json();
    if (json.success) setData(json.reservations);
  };
  const addData = async (e: any) => {
    e.preventDefault();
    if (!form.customerName || !form.customerPhone || !form.serviceName) return alert('필수 입력 누락');
    const res = await fetch('/api/reservations', { method: 'POST', body: JSON.stringify(form) });
    if ((await res.json()).success) { setForm({customerName:'',customerPhone:'',serviceName:'',reservationDate:'',reservationTime:''}); fetchData(); }
  };
  const deleteData = async (id: string) => {
    if(!confirm('삭제하시겠습니까?')) return;
    const res = await fetch('/api/reservations?id=' + id, { method: 'DELETE' });
    if ((await res.json()).success) fetchData();
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-slate-800 flex items-center"><CalendarDays className="w-8 h-8 mr-3 text-indigo-500" /> 예약 관리</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-4">새 예약 등록</h2>
        <form onSubmit={addData} className="flex space-x-3">
          <input type="text" placeholder="고객명" value={form.customerName} onChange={e=>setForm({...form, customerName: e.target.value})} className="flex-1 border rounded-lg px-3 py-2 outline-none" />
          <input type="text" placeholder="연락처" value={form.customerPhone} onChange={e=>setForm({...form, customerPhone: e.target.value})} className="flex-1 border rounded-lg px-3 py-2 outline-none" />
          <input type="text" placeholder="예약서비스" value={form.serviceName} onChange={e=>setForm({...form, serviceName: e.target.value})} className="flex-1 border rounded-lg px-3 py-2 outline-none" />
          <input type="date" value={form.reservationDate} onChange={e=>setForm({...form, reservationDate: e.target.value})} className="border rounded-lg px-3 py-2 outline-none" />
          <input type="time" value={form.reservationTime} onChange={e=>setForm({...form, reservationTime: e.target.value})} className="border rounded-lg px-3 py-2 outline-none" />
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 flex items-center"><Plus className="w-4 h-4 mr-1"/> 등록</button>
        </form>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-sm text-slate-600">
              <th className="p-4">예약일자</th>
              <th className="p-4">예약시간</th>
              <th className="p-4">예약번호</th>
              <th className="p-4">고객명</th>
              <th className="p-4">연락처</th>
              <th className="p-4">예약내용</th>
              <th className="p-4">상태</th>
              <th className="p-4">관리</th>
            </tr>
          </thead>
          <tbody>
            {data.map(t => (
              <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-indigo-600">{t.reservation_date}</td>
                <td className="p-4">{t.reservation_time}</td>
                <td className="p-4">
                  <button 
                    onClick={() => setActiveOrderId(t.id)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-mono font-bold tracking-tight transition-all active:scale-95"
                  >
                    RES-{t.id.slice(-6).toUpperCase()}
                  </button>
                </td>
                <td className="p-4">{t.customer_name}</td>
                <td className="p-4">{t.customer_phone}</td>
                <td className="p-4">{t.service_name}</td>
                <td className="p-4">{t.status}</td>
                <td className="p-4">
                  <button onClick={()=>deleteData(t.id)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors" title="삭제">
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={8} className="p-12 text-center text-slate-400">
                  등록된 예약 내역이 없습니다.
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
