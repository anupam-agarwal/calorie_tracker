-- Migration 004: Create daily_intake table
-- Status: Aggregated daily nutrition data (denormalized for performance)
-- Date: 2026-06-04

CREATE TABLE IF NOT EXISTS daily_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_calories INT NOT NULL DEFAULT 0 CHECK (total_calories >= 0),
  total_protein_g DECIMAL(7,2) NOT NULL DEFAULT 0 CHECK (total_protein_g >= 0),
  total_carbs_g DECIMAL(7,2) NOT NULL DEFAULT 0 CHECK (total_carbs_g >= 0),
  total_fat_g DECIMAL(7,2) NOT NULL DEFAULT 0 CHECK (total_fat_g >= 0),
  meal_count INT NOT NULL DEFAULT 0 CHECK (meal_count >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_daily_intake_user_id ON daily_intake(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_intake_date ON daily_intake(date);
CREATE INDEX IF NOT EXISTS idx_daily_intake_user_date ON daily_intake(user_id, date DESC);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_daily_intake_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_daily_intake_updated_at
BEFORE UPDATE ON daily_intake
FOR EACH ROW
EXECUTE FUNCTION update_daily_intake_updated_at();
