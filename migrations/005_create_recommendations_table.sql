-- Migration 005: Create recommendations table
-- Status: Personalized calorie and macro recommendations
-- Date: 2026-06-04

CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  bmr INT NOT NULL CHECK (bmr > 0),
  tdee INT NOT NULL CHECK (tdee > 0),
  target_calories INT NOT NULL CHECK (target_calories > 0),
  protein_target_g DECIMAL(7,2) NOT NULL CHECK (protein_target_g > 0),
  carbs_target_g DECIMAL(7,2) NOT NULL CHECK (carbs_target_g > 0),
  fat_target_g DECIMAL(7,2) NOT NULL CHECK (fat_target_g > 0),
  calculation_method VARCHAR(100) DEFAULT 'mifflin_st_jeor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_recommendations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_recommendations_updated_at
BEFORE UPDATE ON recommendations
FOR EACH ROW
EXECUTE FUNCTION update_recommendations_updated_at();
