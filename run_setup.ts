import { setupDatabase } from './src/lib/setup-db';

process.env.NEXT_PUBLIC_EGDESK_API_URL = 'http://localhost:8080';
process.env.NEXT_PUBLIC_EGDESK_API_KEY = '7e708c6b-333b-4442-a13c-6bfe50f3389b';

setupDatabase()
  .then(() => {
    console.log('Database setup executed successfully.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during database setup:', err);
    process.exit(1);
  });
