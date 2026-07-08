import { config } from 'dotenv';
import { beforeEach } from 'vitest';

config({ path: '.env.test' });

const { resetDb } = await import('./test/db');

beforeEach(async () => {
  await resetDb();
});
