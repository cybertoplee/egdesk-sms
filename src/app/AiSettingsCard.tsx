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
    <div className="bg-gradient-to-br from-indigo-50/90 to-blue-50/90 p-7 rounded-2xl shadow-[0_4px_20px_rgba(99,102,241,0.06)] border border-indigo-100 mt-6 relative overflow-hidden">
      {/* 백그라운드 물결 광채 데코 */}
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Bot className="w-40 h-40 text-indigo-650" />
      </div>
      
      <div className="relative z-10 flex flex-col gap-6">
        {/* 1단: 헤더 영역 (가로폭 100% 확보하여 텍스트 깨짐 원천 방지) */}
        <div className="border-b border-indigo-100/60 pb-4">
          <h2 className="text-lg font-extrabold text-indigo-950 flex items-center gap-2">
            <Bot className="w-5.5 h-5.5 text-indigo-600 animate-pulse" /> 
            AI 비서 및 이지봇 모델 설정
          </h2>
          <p className="text-xs text-indigo-750/90 mt-1.5 leading-relaxed">
            구글 AI API Key와 사용할 Gemini 모델을 선택하면 AI 분석 비서가 활성화되어 고객 자동 분석 및 문자 작성, 이지봇(EasyBot) 통계 대화가 연동 작동합니다.
          </p>
        </div>
        
        {/* 2단: 설정 입력 폼 영역 (충분한 넓이 확보 및 반응형 정렬) */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4 w-full">
          {/* API Key 입력 */}
          <div className="flex-1 min-w-[260px]">
            <label className="block text-[11px] font-bold text-indigo-800 mb-1.5 tracking-wider uppercase">Google AI API Key</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <KeyRound className="h-4 w-4 text-indigo-400" />
              </div>
              <input
                type="password"
                placeholder="구글 API Key를 입력하세요 (AIzaSy...)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-xs bg-white/90 font-medium shadow-sm transition-all placeholder-indigo-300"
                title="Google AI API Key"
              />
            </div>
          </div>

          {/* 모델 선택 select */}
          <div className="w-full lg:w-72">
            <label className="block text-[11px] font-bold text-indigo-800 mb-1.5 tracking-wider uppercase">Active Gemini Model</label>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Cpu className="h-4 w-4 text-indigo-400" />
              </div>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-xs bg-white/90 font-bold text-indigo-950 cursor-pointer appearance-none shadow-sm transition-all"
                title="Gemini AI 모델 선택"
              >
                <option value="gemini-3.5-flash">Gemini 3.5 Flash (초고속/최우수 추천)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (안정적 고속)</option>
                <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash (최신 패치)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (심층 분석 특화)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="shrink-0 w-full lg:w-auto">
            <button
              onClick={handleSave}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl text-xs font-bold transition-all w-full lg:w-auto shadow-md hover:shadow-lg active:scale-95 duration-150 transform"
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSaved ? "설정 저장완료" : "설정 저장하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
