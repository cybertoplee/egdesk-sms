import { NextRequest, NextResponse } from "next/server";
import {
  listAccounts,
  queryBankTransactions,
  queryCardTransactions,
  queryTaxInvoices,
  queryTaxExemptInvoices,
  queryCashReceipts,
  getOverallStats,
  getSyncHistory,
  getHometaxSyncHistory,
  listHometaxConnections
} from "../../../../egdesk-helpers";

// 이중 안전 장치: 배열이 아닐 경우 빈 배열로 방어 처리
function safeArray<T>(data: any): T[] {
  return Array.isArray(data) ? data : [];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const tab = searchParams.get("tab") || "accounts";
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const searchText = searchParams.get("searchText") || undefined;
    const invoiceType = (searchParams.get("invoiceType") as "sales" | "purchase") || undefined;
    const limit = Number(searchParams.get("limit")) || 30;
    const offset = Number(searchParams.get("offset")) || 0;

    // 1. 계좌 목록 및 종합 통계 조회
    if (tab === "accounts") {
      const [accounts, stats] = await Promise.all([
        listAccounts().catch(() => []),
        getOverallStats().catch(() => null)
      ]);
      return NextResponse.json({
        success: true,
        data: {
          accounts: safeArray(accounts),
          stats: stats || { totalBalance: 0, activeAccounts: 0 }
        }
      });
    }

    // 2. 은행 거래 내역 조회
    if (tab === "transactions") {
      const transactions = await queryBankTransactions({
        startDate,
        endDate,
        searchText,
        limit,
        offset,
        orderBy: "date",
        orderDir: "desc"
      }).catch(() => ({ transactions: [], total: 0 }));

      return NextResponse.json({
        success: true,
        data: {
          list: safeArray(transactions?.transactions || transactions),
          total: transactions?.total || safeArray(transactions?.transactions || transactions).length
        }
      });
    }

    // 3. 신용 카드 거래 내역 조회
    if (tab === "cards") {
      const cardTx = await queryCardTransactions({
        startDate,
        endDate,
        merchantName: searchText,
        limit,
        offset,
        orderBy: "date",
        orderDir: "desc"
      }).catch(() => ({ transactions: [], total: 0 }));

      return NextResponse.json({
        success: true,
        data: {
          list: safeArray(cardTx?.transactions || cardTx),
          total: cardTx?.total || safeArray(cardTx?.transactions || cardTx).length
        }
      });
    }

    // 4. 국세청 홈택스 전자세금계산서 조회
    if (tab === "hometax-invoice") {
      const taxInvoices = await queryTaxInvoices({
        invoiceType,
        startDate,
        endDate,
        limit,
        offset
      }).catch(() => ({ invoices: [], total: 0 }));

      const list = safeArray(taxInvoices?.invoices || taxInvoices);
      // 검색어가 있다면 클라이언트 단 혹은 간단히 서버 단 필터링 제공
      const filteredList = searchText
        ? list.filter((inv: any) =>
            (inv.supplierName || "").includes(searchText) ||
            (inv.buyerName || "").includes(searchText) ||
            (inv.itemName || "").includes(searchText)
          )
        : list;

      return NextResponse.json({
        success: true,
        data: {
          list: filteredList,
          total: taxInvoices?.total || filteredList.length
        }
      });
    }

    // 5. 국세청 홈택스 전자계산서(면세) 조회
    if (tab === "hometax-exempt") {
      const exemptInvoices = await queryTaxExemptInvoices({
        invoiceType,
        startDate,
        endDate,
        limit,
        offset
      }).catch(() => ({ invoices: [], total: 0 }));

      const list = safeArray(exemptInvoices?.invoices || exemptInvoices);
      const filteredList = searchText
        ? list.filter((inv: any) =>
            (inv.supplierName || "").includes(searchText) ||
            (inv.buyerName || "").includes(searchText) ||
            (inv.itemName || "").includes(searchText)
          )
        : list;

      return NextResponse.json({
        success: true,
        data: {
          list: filteredList,
          total: exemptInvoices?.total || filteredList.length
        }
      });
    }

    // 6. 국세청 홈택스 현금영수증 조회
    if (tab === "hometax-cash") {
      const cashReceipts = await queryCashReceipts({
        startDate,
        endDate,
        limit,
        offset
      }).catch(() => ({ receipts: [], total: 0 }));

      const list = safeArray(cashReceipts?.receipts || cashReceipts);
      const filteredList = searchText
        ? list.filter((rcpt: any) =>
            (rcpt.franchiseName || "").includes(searchText) ||
            (rcpt.approvalNumber || "").includes(searchText)
          )
        : list;

      return NextResponse.json({
        success: true,
        data: {
          list: filteredList,
          total: cashReceipts?.total || filteredList.length
        }
      });
    }

    // 7. 동기화 역사 & 홈택스 연결 정보 조회
    if (tab === "sync") {
      const [syncHistory, hometaxSync, hometaxConnections] = await Promise.all([
        getSyncHistory(50).catch(() => []),
        getHometaxSyncHistory(50).catch(() => []),
        listHometaxConnections().catch(() => [])
      ]);

      return NextResponse.json({
        success: true,
        data: {
          syncHistory: safeArray(syncHistory),
          hometaxSync: safeArray(hometaxSync),
          hometaxConnections: safeArray(hometaxConnections)
        }
      });
    }

    // 8. 금융 종합 수치 통계
    if (tab === "stats") {
      const stats = await getOverallStats().catch(() => null);
      return NextResponse.json({
        success: true,
        data: stats || { totalBalance: 0, activeAccounts: 0, bankCount: 0, transactionCount: 0 }
      });
    }

    return NextResponse.json(
      { success: false, error: "알려지지 않은 금융 탭 정보입니다." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Finance API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "금융 데이터 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
