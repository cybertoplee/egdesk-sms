import { NextResponse } from 'next/server';
import { queryTable, insertRows, deleteRows } from '../../../../egdesk-helpers';

export async function GET() {
  try {
    const result = await queryTable('crm_orders', {
      orderBy: 'order_date',
      orderDirection: 'DESC'
    });
    return NextResponse.json({ success: true, orders: result.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const id = data.id || Date.now().toString();
    await insertRows('crm_orders', [{
      id,
      customer_name: data.customerName,
      customer_phone: data.customerPhone,
      product_name: data.productName,
      quantity: data.quantity || '1',
      order_date: data.orderDate || new Date().toISOString().split('T')[0],
      status: data.status || '접수완료'
    }]);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    await deleteRows('crm_orders', { filters: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
