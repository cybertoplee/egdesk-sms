import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SidebarWrapper from "@/components/SidebarWrapper";
import MainContentWrapper from "@/components/MainContentWrapper";
import EasyBot from "@/components/EasyBot";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EGDESK SMS",
  description: "평생 무료 문자 발송 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full" suppressHydrationWarning>
      <body className={`${inter.className} h-full overflow-hidden flex bg-slate-50 text-slate-900 antialiased`} suppressHydrationWarning>
        <SidebarWrapper>
          <Sidebar />
        </SidebarWrapper>
        <main className="flex-1 overflow-y-auto min-w-0">
          <MainContentWrapper>
            {children}
          </MainContentWrapper>
        </main>
        
        {/* Floating 나가기 (Exit) button */}
        <a 
          href="http://woorinara.ai.kr/#portfolio" 
          className="fixed bottom-6 right-24 z-50 flex h-14 items-center justify-center space-x-2 bg-slate-900 text-white px-5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:bg-slate-800 transition-colors focus:outline-none"
        >
          <span className="text-sm font-bold">나가기</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </a>

        <EasyBot />
      </body>
    </html>
  );
}
