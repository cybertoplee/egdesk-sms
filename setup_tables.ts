import { createTable } from './egdesk-helpers';

process.env.NEXT_PUBLIC_EGDESK_API_URL = 'http://localhost:8080';
process.env.NEXT_PUBLIC_EGDESK_API_KEY = '7e708c6b-333b-4442-a13c-6bfe50f3389b';

async function main() {
  try {
    await createTable('CRM Customers', [
      { name: 'name', type: 'TEXT' },
      { name: 'phone', type: 'TEXT' },
      { name: 'tags', type: 'TEXT' }
    ], { tableName: 'crm_customers' });
    console.log("crm_customers created");
  } catch (e) {
    console.log("crm_customers error:", e.message);
  }

  try {
    await createTable('Message Logs', [
      { name: 'status', type: 'TEXT' },
      { name: 'message', type: 'TEXT' },
      { name: 'phone_number', type: 'TEXT' }
    ], { tableName: 'message_logs' });
    console.log("message_logs created");
  } catch (e) {
    console.log("message_logs error:", e.message);
  }
}

main();
