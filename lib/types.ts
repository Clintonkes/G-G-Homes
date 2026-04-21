export type UserRole = "TENANT" | "LANDLORD" | "ADMIN";
export type PropertyStatus = "DRAFT" | "PENDING_VERIFICATION" | "ACTIVE" | "RENTED" | "INACTIVE";
export type AppointmentStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  role: UserRole;
  is_active: boolean;
  id_verified: boolean;
  id_document_url?: string | null;
}

export interface Property {
  id: string;
  landlord_id: string;
  title: string;
  description: string;
  address: string;
  neighbourhood: string;
  city: string;
  state: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  is_furnished: boolean;
  annual_rent: number;
  security_deposit?: number | null;
  amenities: string[];
  photo_urls: string[];
  video_urls: string[];
  document_urls: string[];
  thumbnail_url?: string | null;
  status: PropertyStatus;
  is_verified: boolean;
  listing_type: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  tenant_id: string;
  property_id: string;
  landlord_id: string;
  scheduled_date: string;
  status: AppointmentStatus;
  outcome: string;
  tenant_notes?: string | null;
}

export interface Payment {
  id: string;
  property_id?: string | null;
  payment_type: string;
  gross_amount: number;
  platform_fee: number;
  net_amount: number;
  flutterwave_reference: string;
  status: PaymentStatus;
  created_at: string;
  tenancy_end_date?: string | null;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}
