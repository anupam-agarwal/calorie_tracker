import { Pool, QueryResult } from 'pg';

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

/**
 * Execute a query against the database
 */
export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const start = Date.now();
  try {
    const result = await pool.query<T>(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database query error', { text, error });
    throw error;
  }
}

/**
 * Get a client from the pool (for transactions)
 */
export async function getClient() {
  return pool.connect();
}

/**
 * Healthcheck for database connection
 */
export async function healthcheck(): Promise<boolean> {
  try {
    await pool.query('SELECT NOW()');
    return true;
  } catch (error) {
    console.error('Database healthcheck failed', error);
    return false;
  }
}

export default pool;
