"use client";
import { useState, useEffect } from "react";
import { Send, CheckCircle, AlertTriangle } from "lucide-react";

export default function MessageLogsPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    const res = await fetch('/api/message-logs');
    const json = await res.json();
    if (json.success) setData(json.logs);
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-3xl font-bold text-slate-800 flex items-center"><Send className="w-8 h-8 mr-3 text-purple-500" /> 전체 발송 내역 모니터링</h1>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead><tr className="bg-slate-50 border-b border-slate-100 text-sm"><th className="p-4">발송일시</th><th className="p-4">수신번호</th><th className="p-4 w-1/2">발송내용</th><th className="p-4 text-center">상태</th></tr></thead>
          <tbody>
            {data.map(t => (
              <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50">
                <td className="p-4 text-sm text-slate-500">{t.created_at}</td>
                <td className="p-4 font-medium text-slate-700">{t.phone}</td>
                <td className="p-4 text-xs text-slate-600 whitespace-pre-wrap">{t.message}</td>
                <td className="p-4 text-center">
                  {t.status === 'SUCCESS' ? (
                    <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"><CheckCircle className="w-3 h-3 mr-1"/>성공</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 bg-red-50 text-red-700 text-xs rounded-full"><AlertTriangle className="w-3 h-3 mr-1"/>실패</span>
                  )}
                </td>
              </tr>
            ))}
            {data.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-slate-400">발송 내역이 없습니다.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
