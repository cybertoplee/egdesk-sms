"use client";
import { useState, useEffect } from "react";
import { Bot, Save, Check, KeyRound } from "lucide-react";

export default function AiSettingsCard() {
  const [apiKey, setApiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // DB에서 키 불러오기
    fetch('/api/settings?key=google_ai_api_key')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.value) {
          setApiKey(data.value);
        }
      })
      .catch(e => console.error(e));
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'google_ai_api_key', value: apiKey })
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        alert("저장 실패: " + data.error);
      }
    } catch (e: any) {
      alert("서버 연결 오류: " + e.message);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl shadow-sm border border-indigo-100 mt-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Bot className="w-32 h-32 text-indigo-500" />
      </div>
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-indigo-900 flex items-center">
            <Bot className="w-6 h-6 mr-2 text-indigo-600" /> 
            AI 비서 자동 발송 설정
          </h2>
          <p className="text-sm text-indigo-700 mt-1">
            구글 AI API Key를 입력하면 AI가 고객을 자동 분석하고 문자 내용을 작성해 줍니다.
          </p>
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound className="h-4 w-4 text-indigo-400" />
            </div>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
            />
          </div>
          <button
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shrink-0"
          >
            {isSaved ? <Check className="w-4 h-4 mr-1" /> : <Save className="w-4 h-4 mr-1" />}
            {isSaved ? "저장됨" : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
