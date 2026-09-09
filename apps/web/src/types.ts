export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  expires_at: string;
  admin: AdminUser;
}

export interface RequestLinkResponse {
  status: string;
  message: string;
  debug_token?: string;
  debug_otp?: string;
}

export type MembershipStanding =
  | 'Registered Member'
  | 'Member'
  | 'Community'
  | 'Guest'
  | 'Not on our roll';

export type LifecycleStatus =
  | 'Active'
  | 'Inactive'
  | 'Transferred out'
  | 'Passed away';

export type HouseholdRole = 'Head' | 'Spouse' | 'Child' | 'Other';

export interface Person {
  id: string;
  full_name: string;
  phone: string;
  second_phone?: string;
  email?: string;
  date_of_birth?: string;
  age?: number;
  with_us_since?: string;
  standing: MembershipStanding;
  lifecycle: LifecycleStatus;
  household_id?: string;
  household_name?: string;
  role_in_household?: HouseholdRole;
  care_group_id?: string;
  care_group_name?: string;
  notes?: string;
  privacy_opt_in: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePersonPayload {
  full_name: string;
  phone: string;
  second_phone?: string;
  email?: string;
  date_of_birth?: string;
  with_us_since?: string;
  standing: MembershipStanding;
  household_name?: string;
  role_in_household?: HouseholdRole;
  care_group_name?: string;
  notes?: string;
  privacy_opt_in?: boolean;
}
