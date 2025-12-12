export type MealType = 'VEG' | 'NON_VEG' | 'JAIN';

export interface Category {
  id: number;
  categoryName: string;
  description?: string;
  isActive?: boolean;
}

export interface MenuItem {
  id: number;
  categoryId: number;
  categoryName?: string;
  itemName: string;
  description?: string;
  price: number;
  ingredients?: string;
  mealType: MealType;
  isAvailable: boolean;
  unitsOfMeasurement: number; // Weight in grams
  maxQuantity: number;
  imageBase64List?: string[];
  imageFileTypeList?: string[];
  imageUrl?: string; // For backward compatibility
}

export interface CreateMenuItemRequest {
  categoryId: number;
  itemName: string;
  description?: string;
  price: number;
  ingredients?: string;
  mealType: MealType;
  isAvailable?: boolean;
  unitsOfMeasurement: number;
  maxQuantity: number;
}

export interface UpdateMenuItemRequest {
  categoryId?: number;
  itemName?: string;
  description?: string;
  price?: number;
  ingredients?: string;
  mealType?: MealType;
  isAvailable?: boolean;
  unitsOfMeasurement?: number;
  maxQuantity?: number;
}

export interface ToggleAvailabilityRequest {
  available: boolean;
}
