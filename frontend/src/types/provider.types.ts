export interface ProviderAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ProviderProfileCompleteResponse {
  isComplete: boolean;
  isOnboarding: boolean;
}

export interface ProviderDetailsRequest {
  businessName: string;
  description?: string;
  address: ProviderAddress;
  zone?: number | null;
  commissionRate?: number | null;
  providesDelivery?: boolean;
  deliveryRadius?: number | null;
}

export interface ProviderDetailsResponse {
  message: string;
  success: boolean;
  providerId?: number;
  isOnboarding?: boolean;
}

export interface ProviderDetailsGetResponse {
  id?: number;
  businessName?: string;
  description?: string;
  address?: ProviderAddress;
  zone?: number | null;
  commissionRate?: number;
  providesDelivery?: boolean;
  deliveryRadius?: number | null;
  isVerified?: boolean;
  isOnboarding?: boolean;
}
