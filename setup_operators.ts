import { createTable } from './egdesk-helpers';

process.env.NEXT_PUBLIC_EGDESK_API_URL = 'http://localhost:8080';
process.env.NEXT_PUBLIC_EGDESK_API_KEY = '7e708c6b-333b-4442-a13c-6bfe50f3389b';

async function main() {
  try {
    await createTable('CRM Operators', [
      { name: 'username', type: 'TEXT' },
      { name: 'password_hash', type: 'TEXT' },
      { name: 'name', type: 'TEXT' },
      { name: 'role', type: 'TEXT' },
      { name: 'created_at', type: 'TEXT' }
    ], { tableName: 'crm_operators' });
    console.log("crm_operators created");
  } catch (e: any) {
    console.log("crm_operators error:", e.message);
  }
}

main();
