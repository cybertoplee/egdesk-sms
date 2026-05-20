import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SidebarWrapper from "@/components/SidebarWrapper";
import MainContentWrapper from "@/components/MainContentWrapper";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EGDESK SMS",
  description: "고객 관리 무료 문자 발송 시스템",
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
        <main className="flex-1 overflow-y-auto">
          <MainContentWrapper>
            {children}
          </MainContentWrapper>
        </main>
      </body>
    </html>
  );
}
