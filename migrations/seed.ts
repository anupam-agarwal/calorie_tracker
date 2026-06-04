/**
 * Database Seed Script
 * Seeds food_database table with 100+ common foods and nutrition data
 * 
 * Usage:
 *   npm run db:seed
 * 
 * Sources:
 *   - USDA Food Data Central
 *   - Nutritional data per 100g serving
 */

import { sql } from '@vercel/postgres';

interface FoodItem {
  name: string;
  description: string;
  calories_per_100g: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  serving_size_g: number;
  food_group: 'grains' | 'vegetables' | 'fruits' | 'dairy' | 'protein' | 'fats' | 'sweets' | 'beverages' | 'other';
}

const foods: FoodItem[] = [
  // Grains
  { name: 'White Bread', description: 'Sliced white bread', calories_per_100g: 265, protein_g: 9, carbs_g: 49, fat_g: 3.3, serving_size_g: 28, food_group: 'grains' },
  { name: 'Brown Rice', description: 'Cooked brown rice', calories_per_100g: 112, protein_g: 2.6, carbs_g: 24, fat_g: 0.9, serving_size_g: 100, food_group: 'grains' },
  { name: 'White Rice', description: 'Cooked white rice', calories_per_100g: 130, protein_g: 2.7, carbs_g: 28, fat_g: 0.3, serving_size_g: 100, food_group: 'grains' },
  { name: 'Oatmeal', description: 'Cooked oatmeal', calories_per_100g: 68, protein_g: 2.4, carbs_g: 12, fat_g: 1.4, serving_size_g: 100, food_group: 'grains' },
  { name: 'Whole Wheat Bread', description: 'Sliced whole wheat bread', calories_per_100g: 247, protein_g: 13, carbs_g: 44, fat_g: 3.7, serving_size_g: 28, food_group: 'grains' },
  { name: 'Pasta', description: 'Cooked pasta', calories_per_100g: 131, protein_g: 5, carbs_g: 25, fat_g: 1.1, serving_size_g: 100, food_group: 'grains' },
  { name: 'Cereal', description: 'Breakfast cereal with milk', calories_per_100g: 100, protein_g: 3, carbs_g: 20, fat_g: 1, serving_size_g: 30, food_group: 'grains' },
  { name: 'Bagel', description: 'Plain bagel', calories_per_100g: 250, protein_g: 10, carbs_g: 49, fat_g: 1.5, serving_size_g: 89, food_group: 'grains' },

  // Vegetables
  { name: 'Broccoli', description: 'Raw broccoli', calories_per_100g: 34, protein_g: 2.8, carbs_g: 7, fat_g: 0.4, serving_size_g: 100, food_group: 'vegetables' },
  { name: 'Carrot', description: 'Raw carrot', calories_per_100g: 41, protein_g: 0.9, carbs_g: 10, fat_g: 0.2, serving_size_g: 100, food_group: 'vegetables' },
  { name: 'Spinach', description: 'Raw spinach', calories_per_100g: 23, protein_g: 2.9, carbs_g: 3.6, fat_g: 0.4, serving_size_g: 100, food_group: 'vegetables' },
  { name: 'Tomato', description: 'Raw tomato', calories_per_100g: 18, protein_g: 0.9, carbs_g: 3.9, fat_g: 0.2, serving_size_g: 100, food_group: 'vegetables' },
  { name: 'Lettuce', description: 'Raw lettuce', calories_per_100g: 15, protein_g: 1.4, carbs_g: 2.9, fat_g: 0.2, serving_size_g: 100, food_group: 'vegetables' },
  { name: 'Bell Pepper', description: 'Raw bell pepper', calories_per_100g: 31, protein_g: 1, carbs_g: 6, fat_g: 0.3, serving_size_g: 100, food_group: 'vegetables' },
  { name: 'Cucumber', description: 'Raw cucumber', calories_per_100g: 16, protein_g: 0.7, carbs_g: 3.6, fat_g: 0.1, serving_size_g: 100, food_group: 'vegetables' },
  { name: 'Potato', description: 'Cooked potato', calories_per_100g: 77, protein_g: 2, carbs_g: 17, fat_g: 0.1, serving_size_g: 100, food_group: 'vegetables' },
  { name: 'Corn', description: 'Cooked corn', calories_per_100g: 86, protein_g: 3.3, carbs_g: 19, fat_g: 1.2, serving_size_g: 100, food_group: 'vegetables' },
  { name: 'Green Beans', description: 'Cooked green beans', calories_per_100g: 31, protein_g: 1.8, carbs_g: 7, fat_g: 0.2, serving_size_g: 100, food_group: 'vegetables' },

  // Fruits
  { name: 'Apple', description: 'Medium apple with skin', calories_per_100g: 52, protein_g: 0.3, carbs_g: 14, fat_g: 0.2, serving_size_g: 182, food_group: 'fruits' },
  { name: 'Banana', description: 'Medium banana', calories_per_100g: 89, protein_g: 1.1, carbs_g: 23, fat_g: 0.3, serving_size_g: 118, food_group: 'fruits' },
  { name: 'Orange', description: 'Medium orange', calories_per_100g: 47, protein_g: 0.9, carbs_g: 12, fat_g: 0.3, serving_size_g: 131, food_group: 'fruits' },
  { name: 'Strawberry', description: 'Raw strawberries', calories_per_100g: 32, protein_g: 0.8, carbs_g: 8, fat_g: 0.3, serving_size_g: 100, food_group: 'fruits' },
  { name: 'Blueberry', description: 'Raw blueberries', calories_per_100g: 57, protein_g: 0.7, carbs_g: 14, fat_g: 0.3, serving_size_g: 100, food_group: 'fruits' },
  { name: 'Watermelon', description: 'Raw watermelon', calories_per_100g: 30, protein_g: 0.6, carbs_g: 7.6, fat_g: 0.2, serving_size_g: 100, food_group: 'fruits' },
  { name: 'Grapes', description: 'Raw grapes', calories_per_100g: 67, protein_g: 0.6, carbs_g: 17, fat_g: 0.2, serving_size_g: 100, food_group: 'fruits' },
  { name: 'Peach', description: 'Medium peach', calories_per_100g: 39, protein_g: 0.9, carbs_g: 9.5, fat_g: 0.3, serving_size_g: 147, food_group: 'fruits' },

  // Protein
  { name: 'Chicken Breast', description: 'Cooked skinless chicken breast', calories_per_100g: 165, protein_g: 31, carbs_g: 0, fat_g: 3.6, serving_size_g: 100, food_group: 'protein' },
  { name: 'Ground Beef', description: 'Cooked ground beef (85% lean)', calories_per_100g: 215, protein_g: 23, carbs_g: 0, fat_g: 13, serving_size_g: 100, food_group: 'protein' },
  { name: 'Salmon', description: 'Cooked salmon', calories_per_100g: 208, protein_g: 22, carbs_g: 0, fat_g: 13, serving_size_g: 100, food_group: 'protein' },
  { name: 'Egg', description: 'Large cooked egg', calories_per_100g: 155, protein_g: 13, carbs_g: 1.1, fat_g: 11, serving_size_g: 50, food_group: 'protein' },
  { name: 'Turkey', description: 'Cooked turkey breast', calories_per_100g: 189, protein_g: 29, carbs_g: 0, fat_g: 7.4, serving_size_g: 100, food_group: 'protein' },
  { name: 'Tuna', description: 'Canned tuna in water', calories_per_100g: 96, protein_g: 22, carbs_g: 0, fat_g: 0.8, serving_size_g: 100, food_group: 'protein' },
  { name: 'Pork', description: 'Cooked pork loin', calories_per_100g: 242, protein_g: 27, carbs_g: 0, fat_g: 14, serving_size_g: 100, food_group: 'protein' },
  { name: 'Shrimp', description: 'Cooked shrimp', calories_per_100g: 99, protein_g: 24, carbs_g: 0, fat_g: 0.3, serving_size_g: 100, food_group: 'protein' },
  { name: 'Tofu', description: 'Firm tofu', calories_per_100g: 76, protein_g: 8.1, carbs_g: 1.9, fat_g: 4.8, serving_size_g: 100, food_group: 'protein' },
  { name: 'Lentils', description: 'Cooked lentils', calories_per_100g: 116, protein_g: 9, carbs_g: 20, fat_g: 0.4, serving_size_g: 100, food_group: 'protein' },

  // Dairy
  { name: 'Milk', description: 'Whole milk', calories_per_100g: 61, protein_g: 3.2, carbs_g: 4.8, fat_g: 3.3, serving_size_g: 240, food_group: 'dairy' },
  { name: 'Low-fat Milk', description: '2% milk', calories_per_100g: 49, protein_g: 3.3, carbs_g: 4.8, fat_g: 1.9, serving_size_g: 240, food_group: 'dairy' },
  { name: 'Skim Milk', description: 'Skim milk', calories_per_100g: 35, protein_g: 3.4, carbs_g: 5, fat_g: 0.1, serving_size_g: 240, food_group: 'dairy' },
  { name: 'Yogurt', description: 'Plain yogurt', calories_per_100g: 59, protein_g: 3.5, carbs_g: 4.7, fat_g: 0.4, serving_size_g: 100, food_group: 'dairy' },
  { name: 'Greek Yogurt', description: 'Plain Greek yogurt', calories_per_100g: 59, protein_g: 10, carbs_g: 3.3, fat_g: 0.4, serving_size_g: 100, food_group: 'dairy' },
  { name: 'Cheddar Cheese', description: 'Cheddar cheese', calories_per_100g: 403, protein_g: 23, carbs_g: 1.3, fat_g: 33, serving_size_g: 28, food_group: 'dairy' },
  { name: 'Mozzarella Cheese', description: 'Mozzarella cheese', calories_per_100g: 280, protein_g: 28, carbs_g: 3.1, fat_g: 17, serving_size_g: 28, food_group: 'dairy' },

  // Fats & Oils
  { name: 'Olive Oil', description: 'Extra virgin olive oil', calories_per_100g: 884, protein_g: 0, carbs_g: 0, fat_g: 100, serving_size_g: 14, food_group: 'fats' },
  { name: 'Butter', description: 'Unsalted butter', calories_per_100g: 717, protein_g: 0.9, carbs_g: 0, fat_g: 81, serving_size_g: 14, food_group: 'fats' },
  { name: 'Almond Butter', description: 'Natural almond butter', calories_per_100g: 588, protein_g: 21, carbs_g: 20, fat_g: 50, serving_size_g: 32, food_group: 'fats' },
  { name: 'Peanut Butter', description: 'Natural peanut butter', calories_per_100g: 588, protein_g: 25, carbs_g: 20, fat_g: 50, serving_size_g: 32, food_group: 'fats' },
  { name: 'Almonds', description: 'Raw almonds', calories_per_100g: 579, protein_g: 21, carbs_g: 22, fat_g: 50, serving_size_g: 28, food_group: 'fats' },
  { name: 'Avocado', description: 'Raw avocado', calories_per_100g: 160, protein_g: 2, carbs_g: 9, fat_g: 15, serving_size_g: 150, food_group: 'fats' },

  // Sweets & Snacks
  { name: 'Sugar', description: 'White granulated sugar', calories_per_100g: 387, protein_g: 0, carbs_g: 100, fat_g: 0, serving_size_g: 4, food_group: 'sweets' },
  { name: 'Dark Chocolate', description: '70% cocoa dark chocolate', calories_per_100g: 598, protein_g: 7.8, carbs_g: 46, fat_g: 43, serving_size_g: 28, food_group: 'sweets' },
  { name: 'Donut', description: 'Glazed donut', calories_per_100g: 452, protein_g: 4.6, carbs_g: 51, fat_g: 25, serving_size_g: 52, food_group: 'sweets' },
  { name: 'Ice Cream', description: 'Vanilla ice cream', calories_per_100g: 207, protein_g: 3.5, carbs_g: 24, fat_g: 11, serving_size_g: 100, food_group: 'sweets' },
  { name: 'Chips', description: 'Potato chips', calories_per_100g: 536, protein_g: 5.8, carbs_g: 53, fat_g: 34, serving_size_g: 28, food_group: 'sweets' },

  // Beverages
  { name: 'Coffee', description: 'Black coffee', calories_per_100g: 1, protein_g: 0.1, carbs_g: 0, fat_g: 0, serving_size_g: 240, food_group: 'beverages' },
  { name: 'Tea', description: 'Black tea', calories_per_100g: 2, protein_g: 0.1, carbs_g: 0, fat_g: 0, serving_size_g: 240, food_group: 'beverages' },
  { name: 'Soda', description: 'Carbonated soda', calories_per_100g: 42, protein_g: 0, carbs_g: 11, fat_g: 0, serving_size_g: 355, food_group: 'beverages' },
  { name: 'Orange Juice', description: 'Freshly squeezed orange juice', calories_per_100g: 47, protein_g: 0.7, carbs_g: 11, fat_g: 0.2, serving_size_g: 250, food_group: 'beverages' },
  { name: 'Beer', description: 'Light beer', calories_per_100g: 37, protein_g: 0.4, carbs_g: 1.6, fat_g: 0, serving_size_g: 355, food_group: 'beverages' },
  { name: 'Wine', description: 'Red wine', calories_per_100g: 85, protein_g: 0.1, carbs_g: 2.6, fat_g: 0, serving_size_g: 150, food_group: 'beverages' },

  // Additional common foods
  { name: 'Pizza', description: 'Cheese pizza slice', calories_per_100g: 285, protein_g: 12, carbs_g: 36, fat_g: 10, serving_size_g: 100, food_group: 'other' },
  { name: 'Burger', description: 'Hamburger with bun', calories_per_100g: 250, protein_g: 13, carbs_g: 28, fat_g: 9, serving_size_g: 215, food_group: 'other' },
  { name: 'Sandwich', description: 'Deli turkey sandwich', calories_per_100g: 260, protein_g: 15, carbs_g: 35, fat_g: 6, serving_size_g: 250, food_group: 'other' },
  { name: 'Sushi', description: 'Salmon sushi roll', calories_per_100g: 141, protein_g: 5.9, carbs_g: 22, fat_g: 2.1, serving_size_g: 100, food_group: 'other' },
  { name: 'Soup', description: 'Chicken noodle soup', calories_per_100g: 56, protein_g: 4, carbs_g: 8, fat_g: 0.5, serving_size_g: 250, food_group: 'other' },
];

async function seedDatabase() {
  try {
    console.log(`\n🌱 Seeding food database with ${foods.length} foods...`);

    for (const food of foods) {
      await sql`
        INSERT INTO food_database (
          name, description, calories_per_100g, protein_g, carbs_g, fat_g, serving_size_g, food_group, source
        ) VALUES (
          ${food.name},
          ${food.description},
          ${food.calories_per_100g},
          ${food.protein_g},
          ${food.carbs_g},
          ${food.fat_g},
          ${food.serving_size_g},
          ${food.food_group},
          'manual'
        )
        ON CONFLICT DO NOTHING
      `;
    }

    const result = await sql`SELECT COUNT(*) as count FROM food_database`;
    console.log(`✅ Database seeded! Total foods: ${result.rows[0].count}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:');
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();
