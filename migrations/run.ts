/**
 * Database Migration Runner
 * Runs all SQL migrations from /migrations directory in order
 * 
 * Usage:
 *   npm run db:migrate
 */

import fs from 'fs';
import path from 'path';
import { sql } from '@vercel/postgres';

async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), 'migrations');
  
  try {
    // Get all migration files sorted by name
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} migration files`);

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const migration = fs.readFileSync(filePath, 'utf-8');

      console.log(`\n📦 Running migration: ${file}`);
      
      try {
        // Execute migration
        await sql.query(migration);
        console.log(`✅ Migration completed: ${file}`);
      } catch (error: any) {
        console.error(`❌ Migration failed: ${file}`);
        console.error(error.message);
        throw error;
      }
    }

    console.log(`\n✅ All ${files.length} migrations completed successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:');
    console.error(error);
    process.exit(1);
  }
}

runMigrations();
