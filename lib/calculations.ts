/**
 * Calculate calorie value for a given portion using database reference values
 * Formula: (portion_size / serving_size) × value_per_serving
 */
export function calculateMacros(
  portionSize: number,
  servingSize: number,
  caloriesPerServing: number,
  proteinPerServing: number,
  carbsPerServing: number,
  fatPerServing: number
) {
  const multiplier = portionSize / servingSize;

  return {
    calories: Math.round(caloriesPerServing * multiplier * 10) / 10,
    protein_g: Math.round(proteinPerServing * multiplier * 10) / 10,
    carbs_g: Math.round(carbsPerServing * multiplier * 10) / 10,
    fat_g: Math.round(fatPerServing * multiplier * 10) / 10,
  };
}

/**
 * Calculate Basal Metabolic Rate using Mifflin-St Jeor formula
 * Formula:
 *   Male: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
 *   Female: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161
 */
export function calculateBMR(
  weight_kg: number,
  height_cm: number,
  age: number,
  gender: 'M' | 'F' | 'Other'
): number {
  const sexOffset = gender === 'M' ? 5 : gender === 'F' ? -161 : -78; // Average of M and F
  const bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + sexOffset;
  return Math.round(bmr * 10) / 10;
}

/**
 * Activity level multipliers for calculating TDEE (Total Daily Energy Expenditure)
 */
export const ACTIVITY_MULTIPLIERS = {
  1: 1.2, // Sedentary (little or no exercise)
  2: 1.375, // Lightly Active (1-3 days/week)
  3: 1.55, // Moderately Active (3-5 days/week)
  4: 1.725, // Very Active (6-7 days/week)
  5: 1.9, // Extremely Active (physical job or 2x/day exercise)
} as const;

/**
 * Calculate Total Daily Energy Expenditure
 */
export function calculateTDEE(bmr: number, activityLevel: 1 | 2 | 3 | 4 | 5): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  const tdee = bmr * multiplier;
  return Math.round(tdee * 10) / 10;
}

/**
 * Calculate macronutrient targets based on daily calorie goal
 * Default: 25% protein, 50% carbs, 25% fat
 */
export function calculateMacroTargets(
  dailyCalories: number,
  proteinPercent: number = 25,
  carbsPercent: number = 50,
  fatPercent: number = 25
) {
  const proteinCals = dailyCalories * (proteinPercent / 100);
  const carbsCals = dailyCalories * (carbsPercent / 100);
  const fatCals = dailyCalories * (fatPercent / 100);

  return {
    protein_target_g: Math.round(proteinCals / 4 * 10) / 10, // 4 cal per gram
    carbs_target_g: Math.round(carbsCals / 4 * 10) / 10, // 4 cal per gram
    fat_target_g: Math.round(fatCals / 9 * 10) / 10, // 9 cal per gram
  };
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: string | Date): number {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Format calorie value for display
 */
export function formatCalories(calories: number): string {
  return `${Math.round(calories).toLocaleString()} cal`;
}

/**
 * Format macro value for display
 */
export function formatMacro(grams: number): string {
  return `${Math.round(grams * 10) / 10}g`;
}
