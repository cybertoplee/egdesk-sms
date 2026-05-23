"use client";
import { useState, useEffect } from "react";
import { Bot, Save, Check, KeyRound, Cpu } from "lucide-react";

export default function AiSettingsCard() {
  const [apiKey, setApiKey] = useState("");
  const [aiModel, setAiModel] = useState("gemini-3.5-flash");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // DB에서 API 키 불러오기
    fetch('/api/settings?key=google_ai_api_key')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.value) {
          setApiKey(data.value);
        }
      })
      .catch(e => console.error(e));

    // DB에서 AI 모델명 불러오기
    fetch('/api/settings?key=google_ai_model')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.value) {
          setAiModel(data.value);
        }
      })
      .catch(e => console.error(e));
  }, []);

  const handleSave = async () => {
    try {
      // 1. API Key 저장
      const resKey = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'google_ai_api_key', value: apiKey })
      });
      const dataKey = await resKey.json();

      // 2. AI 모델명 저장
      const resModel = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'google_ai_model', value: aiModel })
      });
      const dataModel = await resModel.json();

      if (dataKey.success && dataModel.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        alert("저장 실패: " + (dataKey.error || dataModel.error || "알 수 없는 에러"));
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
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div>
          <h2 className="text-xl font-bold text-indigo-900 flex items-center">
            <Bot className="w-6 h-6 mr-2 text-indigo-600" /> 
            AI 비서 및 이지봇 모델 설정
          </h2>
          <p className="text-sm text-indigo-700 mt-1">
            구글 AI API Key와 사용할 Gemini 모델을 선택하면 AI 분석 비서가 연동 작동합니다.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto shrink-0">
          {/* API Key 입력 */}
          <div className="relative w-full sm:w-56">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <KeyRound className="h-4 w-4 text-indigo-400" />
            </div>
            <input
              type="password"
              placeholder="구글 API Key (AIzaSy...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-xs bg-white font-medium"
              title="Google AI API Key"
            />
          </div>

          {/* 모델 선택 select */}
          <div className="relative w-full sm:w-56">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Cpu className="h-4 w-4 text-indigo-400" />
            </div>
            <select
              value={aiModel}
              onChange={(e) => setAiModel(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-xs bg-white font-bold text-indigo-900 cursor-pointer appearance-none"
              title="Gemini AI 모델 선택"
            >
              <option value="gemini-3.5-flash">Gemini 3.5 Flash (초고속/추천)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (안정적 고속)</option>
              <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash (최신 패치)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (심층 분석 특화)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* 저장 버튼 */}
          <button
            onClick={handleSave}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shrink-0 w-full sm:w-auto hover:shadow-md active:scale-95 duration-150"
          >
            {isSaved ? <Check className="w-4 h-4 mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
            {isSaved ? "설정 저장됨" : "설정 저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
