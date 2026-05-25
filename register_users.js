require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');

async function main() {
  const users = [
    { username: 'admin', password_hash: bcrypt.hashSync('cy83288328*', 10), name: '개발자', role: 'DEVELOPER' },
    { username: 'manager', password_hash: bcrypt.hashSync('12345678', 10), name: '관리자', role: 'ADMIN' },
    { username: 'user', password_hash: bcrypt.hashSync('1234', 10), name: '사용자', role: 'USER' }
  ];

  for (const user of users) {
    const res = await fetch('http://localhost:8080/user-data/tools/call', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Api-Key': '7e708c6b-333b-4442-a13c-6bfe50f3389b' },
      body: JSON.stringify({
        tool: 'user_data_insert_rows',
        arguments: {
          tableName: 'crm_operators',
          rows: [{
            username: user.username,
            password_hash: user.password_hash,
            name: user.name,
            role: user.role,
            created_at: new Date().toISOString()
          }]
        }
      })
    });
    const result = await res.json();
    console.log(`Inserted ${user.username}:`, result);
  }
}
main();
