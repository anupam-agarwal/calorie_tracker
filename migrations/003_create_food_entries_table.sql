-- Migration 003: Create food_entries table
-- Status: User food logs
-- Date: 2026-06-04

CREATE TABLE IF NOT EXISTS food_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES food_database(id) ON DELETE RESTRICT,
  quantity_g INT NOT NULL CHECK (quantity_g > 0),
  calories INT NOT NULL CHECK (calories > 0),
  protein_g DECIMAL(5,2) NOT NULL CHECK (protein_g >= 0),
  carbs_g DECIMAL(5,2) NOT NULL CHECK (carbs_g >= 0),
  fat_g DECIMAL(5,2) NOT NULL CHECK (fat_g >= 0),
  meal_type VARCHAR(50) CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack', 'other')),
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_food_entries_user_id ON food_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_food_entries_food_id ON food_entries(food_id);
CREATE INDEX IF NOT EXISTS idx_food_entries_logged_at ON food_entries(logged_at);
CREATE INDEX IF NOT EXISTS idx_food_entries_user_logged_at ON food_entries(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_food_entries_deleted_at ON food_entries(deleted_at);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_food_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_food_entries_updated_at
BEFORE UPDATE ON food_entries
FOR EACH ROW
EXECUTE FUNCTION update_food_entries_updated_at();
