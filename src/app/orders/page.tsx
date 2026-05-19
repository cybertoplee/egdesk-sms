"use client";
import { useState, useEffect } from "react";
import { ClipboardList, Plus, Trash2 } from "lucide-react";

export default function OrdersPage() {
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({ customerName: '', customerPhone: '', productName: '', quantity: '1' });

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    const res = await fetch('/api/orders');
    const json = await res.json();
    if (json.success) setData(json.orders);
  };
  const addData = async (e: any) => {
    e.preventDefault();
    if (!form.customerName || !form.customerPhone || !form.productName) return alert('필수 입력 누락');
    const res = await fetch('/api/orders', { method: 'POST', body: JSON.stringify(form) });
    if ((await res.json()).success) { setForm({customerName:'',customerPhone:'',productName:'',quantity:'1'}); fetchData(); }
  };
  const deleteData = async (id: string) => {
    if(!confirm('삭제하시겠습니까?')) return;
    const res = await fetch('/api/orders?id=' + id, { method: 'DELETE' });
    if ((await res.json()).success) fetchData();
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-slate-800 flex items-center"><ClipboardList className="w-8 h-8 mr-3 text-blue-500" /> 주문내역 관리</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-4">새 주문 등록</h2>
        <form onSubmit={addData} className="flex space-x-3">
          <input type="text" placeholder="고객명" value={form.customerName} onChange={e=>setForm({...form, customerName: e.target.value})} className="flex-1 border rounded-lg px-3 py-2 outline-none" />
          <input type="text" placeholder="연락처" value={form.customerPhone} onChange={e=>setForm({...form, customerPhone: e.target.value})} className="flex-1 border rounded-lg px-3 py-2 outline-none" />
          <input type="text" placeholder="상품명" value={form.productName} onChange={e=>setForm({...form, productName: e.target.value})} className="flex-1 border rounded-lg px-3 py-2 outline-none" />
          <input type="number" placeholder="수량" value={form.quantity} onChange={e=>setForm({...form, quantity: e.target.value})} className="w-20 border rounded-lg px-3 py-2 outline-none" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"><Plus className="w-4 h-4 mr-1"/> 등록</button>
        </form>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead><tr className="bg-slate-50 border-b border-slate-100 text-sm"><th className="p-4">주문일자</th><th className="p-4">고객명</th><th className="p-4">연락처</th><th className="p-4">상품명</th><th className="p-4">수량</th><th className="p-4">상태</th><th className="p-4">관리</th></tr></thead>
          <tbody>
            {data.map(t => (
              <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="p-4">{t.order_date}</td><td className="p-4">{t.customer_name}</td><td className="p-4">{t.customer_phone}</td><td className="p-4">{t.product_name}</td><td className="p-4">{t.quantity}</td><td className="p-4">{t.status}</td>
                <td className="p-4"><button onClick={()=>deleteData(t.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
