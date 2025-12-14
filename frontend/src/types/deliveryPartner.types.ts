export type VehicleType = 'BIKE' | 'SCOOTER' | 'BICYCLE' | 'CAR';

export interface DeliveryPartner {
  id: number;
  userId: number;
  providerId?: number | null;
  fullName: string;
  vehicleType: VehicleType;
  serviceArea: string;
  isAvailable: boolean;
}

export interface DeliveryPartnerCreateRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  vehicleType: VehicleType;
  serviceArea: string;
}

export interface DeliveryPartnerUpdateRequest {
  fullName: string;
  vehicleType: VehicleType;
  serviceArea: string;
  isAvailable: boolean;
}

export interface DeliveryPartnerProfile extends DeliveryPartner {
  email?: string;
  phone?: string;
}


