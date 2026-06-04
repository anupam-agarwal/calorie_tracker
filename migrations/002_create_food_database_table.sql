-- Migration 002: Create food_database table
-- Status: Food reference data
-- Date: 2026-06-04

CREATE TABLE IF NOT EXISTS food_database (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  calories_per_100g INT NOT NULL CHECK (calories_per_100g > 0),
  protein_g DECIMAL(5,2) NOT NULL CHECK (protein_g >= 0),
  carbs_g DECIMAL(5,2) NOT NULL CHECK (carbs_g >= 0),
  fat_g DECIMAL(5,2) NOT NULL CHECK (fat_g >= 0),
  serving_size_g INT DEFAULT 100 CHECK (serving_size_g > 0),
  food_group VARCHAR(50) CHECK (food_group IN (
    'grains', 'vegetables', 'fruits', 'dairy', 'protein', 'fats', 'sweets', 'beverages', 'other'
  )),
  source VARCHAR(100) DEFAULT 'manual',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for search performance
CREATE INDEX IF NOT EXISTS idx_food_database_name ON food_database(name);
CREATE INDEX IF NOT EXISTS idx_food_database_food_group ON food_database(food_group);
CREATE INDEX IF NOT EXISTS idx_food_database_name_tsvector ON food_database USING GIN(to_tsvector('english', name));

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_food_database_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_food_database_updated_at
BEFORE UPDATE ON food_database
FOR EACH ROW
EXECUTE FUNCTION update_food_database_updated_at();
