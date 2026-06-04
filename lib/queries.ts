import { query } from './db';
import { calculateBMR, calculateTDEE, calculateMacroTargets } from './calculations';

/**
 * User Queries
 */
export async function createUser(email: string, password_hash: string, name: string) {
  const result = await query(
    `INSERT INTO users (email, password_hash, name, created_at, updated_at)
     VALUES ($1, $2, $3, NOW(), NOW())
     RETURNING id, email, name, created_at`,
    [email, password_hash, name]
  );
  return result.rows[0];
}

export async function getUserByEmail(email: string) {
  const result = await query('SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL', [email]);
  return result.rows[0];
}

export async function getUserById(id: string) {
  const result = await query(
    'SELECT id, email, name, gender, date_of_birth, weight_kg, height_cm, activity_level, created_at, updated_at FROM users WHERE id = $1 AND deleted_at IS NULL',
    [id]
  );
  return result.rows[0];
}

export async function updateUserProfile(
  id: string,
  updates: {
    name?: string;
    weight_kg?: number;
    height_cm?: number;
    activity_level?: number;
    date_of_birth?: string;
    gender?: string;
  }
) {
  const setClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updates.name) {
    setClauses.push(`name = $${paramIndex++}`);
    values.push(updates.name);
  }
  if (updates.weight_kg) {
    setClauses.push(`weight_kg = $${paramIndex++}`);
    values.push(updates.weight_kg);
  }
  if (updates.height_cm) {
    setClauses.push(`height_cm = $${paramIndex++}`);
    values.push(updates.height_cm);
  }
  if (updates.activity_level) {
    setClauses.push(`activity_level = $${paramIndex++}`);
    values.push(updates.activity_level);
  }
  if (updates.date_of_birth) {
    setClauses.push(`date_of_birth = $${paramIndex++}`);
    values.push(updates.date_of_birth);
  }
  if (updates.gender) {
    setClauses.push(`gender = $${paramIndex++}`);
    values.push(updates.gender);
  }

  setClauses.push(`updated_at = NOW()`);
  values.push(id);

  const result = await query(
    `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return result.rows[0];
}

/**
 * Food Database Queries
 */
export async function searchFoodDatabase(query_string: string, limit: number = 20) {
  const result = await query(
    `SELECT id, food_name, serving_size, serving_unit, calories_per_serving, protein_g, carbs_g, fat_g, category
     FROM food_database
     WHERE food_name ILIKE $1
     LIMIT $2`,
    [`%${query_string}%`, limit]
  );
  return result.rows;
}

/**
 * Food Entry Queries
 */
export async function createFoodEntry(userId: string, entry: any) {
  const result = await query(
    `INSERT INTO food_entries 
     (user_id, food_name, portion_size, portion_unit, calories, protein_g, carbs_g, fat_g, 
      food_database_id, photo_url, created_at, entry_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), COALESCE($11, CURRENT_DATE))
     RETURNING *`,
    [
      userId,
      entry.food_name,
      entry.portion_size,
      entry.portion_unit,
      entry.calories,
      entry.protein_g,
      entry.carbs_g,
      entry.fat_g,
      entry.food_database_id || null,
      entry.photo_url || null,
      entry.entry_date,
    ]
  );
  return result.rows[0];
}

export async function getFoodEntriesByUser(userId: string, daysBack: number = 30) {
  const result = await query(
    `SELECT * FROM food_entries
     WHERE user_id = $1 
       AND entry_date >= CURRENT_DATE - INTERVAL '${daysBack} days'
     ORDER BY entry_date DESC, created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function deleteFoodEntry(id: string, userId: string) {
  const result = await query(
    'DELETE FROM food_entries WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rows[0];
}

/**
 * Daily Intake Queries
 */
export async function getDailyIntake(userId: string, date: string) {
  const result = await query(
    `SELECT * FROM daily_intake
     WHERE user_id = $1 AND date = $2`,
    [userId, date]
  );
  return result.rows[0];
}

export async function get30DayHistory(userId: string) {
  const result = await query(
    `SELECT * FROM daily_intake
     WHERE user_id = $1 AND date >= CURRENT_DATE - INTERVAL '30 days'
     ORDER BY date DESC`,
    [userId]
  );
  return result.rows;
}

/**
 * Recommendations Queries
 */
export async function createRecommendation(
  userId: string,
  weight_kg: number,
  height_cm: number,
  age: number,
  gender: string,
  activity_level: number
) {
  const bmr = calculateBMR(weight_kg, height_cm, age, gender as 'M' | 'F' | 'Other');
  const tdee = calculateTDEE(bmr, activity_level as 1 | 2 | 3 | 4 | 5);
  const macros = calculateMacroTargets(tdee);

  const result = await query(
    `INSERT INTO recommendations 
     (user_id, daily_calorie_target, protein_target_g, carbs_target_g, fat_target_g, 
      protein_percentage, carbs_percentage, fat_percentage, bmr, tdee, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
     ON CONFLICT (user_id) DO UPDATE SET
       daily_calorie_target = $2,
       protein_target_g = $3,
       carbs_target_g = $4,
       fat_target_g = $5,
       bmr = $9,
       tdee = $10,
       updated_at = NOW()
     RETURNING *`,
    [userId, tdee, macros.protein_target_g, macros.carbs_target_g, macros.fat_target_g, 25, 50, 25, bmr, tdee]
  );
  return result.rows[0];
}

export async function getRecommendation(userId: string) {
  const result = await query(
    'SELECT * FROM recommendations WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
}
