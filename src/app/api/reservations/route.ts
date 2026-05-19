import { NextResponse } from 'next/server';
import { queryTable, insertRows, deleteRows } from '../../../../egdesk-helpers';

export async function GET() {
  try {
    const result = await queryTable('crm_reservations', {
      orderBy: 'reservation_date',
      orderDirection: 'DESC'
    });
    return NextResponse.json({ success: true, reservations: result.rows });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const id = data.id || Date.now().toString();
    await insertRows('crm_reservations', [{
      id,
      customer_name: data.customerName,
      customer_phone: data.customerPhone,
      service_name: data.serviceName,
      reservation_date: data.reservationDate || new Date().toISOString().split('T')[0],
      reservation_time: data.reservationTime || '12:00',
      status: data.status || '예약확정'
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
    await deleteRows('crm_reservations', { filters: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
