"use client";
import { useState, useEffect } from "react";
import { PackageSearch, Plus, Trash2, ExternalLink } from "lucide-react";

export default function ProductsPage() {
  const [data, setData] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', price: '', url: '', description: '', main_image_url: '', detail_image_url: '' });

  useEffect(() => { fetchData(); }, []);
  
  const fetchData = async () => {
    const res = await fetch('/api/products');
    const json = await res.json();
    if (json.success) setData(json.products);
  };

  const addData = async (e: any) => {
    e.preventDefault();
    if (!form.name) return alert('상품명은 필수입니다.');
    
    const res = await fetch('/api/products', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form) 
    });
    
    const json = await res.json();
    if (json.success) { 
      setForm({ name: '', price: '', url: '', description: '', main_image_url: '', detail_image_url: '' }); 
      fetchData(); 
    } else {
      alert("등록 실패: " + json.error);
    }
  };

  const deleteData = async (id: string) => {
    if(!confirm('정말 삭제하시겠습니까?')) return;
    const res = await fetch('/api/products?id=' + id, { method: 'DELETE' });
    if ((await res.json()).success) fetchData();
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-slate-800 flex items-center">
        <PackageSearch className="w-8 h-8 mr-3 text-pink-500" /> 
        쇼핑몰 연동 상품 DB
      </h1>
      
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-4 text-slate-700">새 상품 등록</h2>
        <form onSubmit={addData} className="flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              placeholder="상품명 (예: 24년형 스마트 TV)" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              className="flex-[2] border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500" 
            />
            <input 
              type="text" 
              placeholder="가격 (예: 850,000원)" 
              value={form.price} 
              onChange={e => setForm({...form, price: e.target.value})} 
              className="flex-[1] border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500" 
            />
            <input 
              type="text" 
              placeholder="쇼핑몰 URL (선택)" 
              value={form.url} 
              onChange={e => setForm({...form, url: e.target.value})} 
              className="flex-[2] border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500" 
            />
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              placeholder="상세 설명 문구 (간략히)" 
              value={form.description} 
              onChange={e => setForm({...form, description: e.target.value})} 
              className="flex-[2] border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500" 
            />
            <input 
              type="text" 
              placeholder="대표 이미지 URL" 
              value={form.main_image_url} 
              onChange={e => setForm({...form, main_image_url: e.target.value})} 
              className="flex-[1] border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500 text-sm" 
            />
            <input 
              type="text" 
              placeholder="상세설명 이미지 (외부 URL)" 
              value={form.detail_image_url} 
              onChange={e => setForm({...form, detail_image_url: e.target.value})} 
              className="flex-[1] border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-500 text-sm" 
            />
            <button type="submit" className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 flex items-center justify-center whitespace-nowrap font-medium transition-colors">
              <Plus className="w-4 h-4 mr-1"/> 등록
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-sm">
              <th className="p-4 font-semibold text-slate-600">대표 이미지</th>
              <th className="p-4 font-semibold text-slate-600 w-[20%]">상품정보</th>
              <th className="p-4 font-semibold text-slate-600">가격</th>
              <th className="p-4 font-semibold text-slate-600">상세 설명 문구</th>
              <th className="p-4 font-semibold text-slate-600">상세설명 이미지</th>
              <th className="p-4 font-semibold text-slate-600">쇼핑몰 링크</th>
              <th className="p-4 font-semibold text-slate-600 text-center w-24">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">등록된 상품이 없습니다.</td>
              </tr>
            ) : (
              data.map(t => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    {t.main_image_url ? (
                      <img src={t.main_image_url} alt={t.name} className="w-16 h-16 object-cover rounded-lg border border-slate-200" />
                    ) : (
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-xs text-slate-400">No Img</div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-slate-800">{t.name}</td>
                  <td className="p-4 text-pink-600 font-semibold whitespace-nowrap">{t.price || '-'}</td>
                  <td className="p-4 text-slate-500 text-xs">
                    <p className="truncate max-w-[150px]" title={t.description}>{t.description || '-'}</p>
                  </td>
                  <td className="p-4 text-slate-500 text-xs">
                    {t.detail_image_url ? (
                      <a href={t.detail_image_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center">
                        <ExternalLink className="w-3 h-3 mr-1 shrink-0" /> 보기
                      </a>
                    ) : '-'}
                  </td>
                  <td className="p-4 text-slate-500 text-sm max-w-[150px] truncate">
                    {t.url ? (
                      <a href={t.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center">
                        {t.url} <ExternalLink className="w-3 h-3 ml-1 shrink-0" />
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => deleteData(t.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
