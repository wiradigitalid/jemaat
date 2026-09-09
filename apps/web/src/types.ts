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

export type ResidenceCategory = 'family' | 'also_lives_here' | 'moved_out';

export interface HouseholdMember {
  person_id: string;
  full_name: string;
  standing: string;
  age: number;
  relationship: string;
  category: ResidenceCategory;
  phone?: string;
  own_address_note?: string;
  moved_out_note?: string;
  new_household?: string;
  is_head: boolean;
}

export interface Household {
  id: string;
  name: string;
  address: string;
  primary_contact_name: string;
  primary_contact_phone: string;
  head_person_id: string;
  members: HouseholdMember[];
  also_at_address?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ServingRole {
  id: string;
  team_id: string;
  name: string;
  required_count: number;
  interested_count: number;
  min_qualification?: string;
  volunteers?: string[];
}

export interface MinistryTeam {
  id: string;
  name: string;
  leader_person_id?: string;
  leader_name?: string;
  roles_count: number;
  interested_count: number;
  roles: ServingRole[];
}

export type AssignmentStatus = 'confirmed' | 'pending' | 'declined' | 'swapped' | 'open';

export interface ChurchService {
  id: string;
  name: string;
  date: string;
  date_label: string;
  time_slot: string;
}

export interface RosterAssignment {
  id: string;
  service_id: string;
  service_date: string;
  date_label: string;
  team_id: string;
  team_name: string;
  role_id: string;
  role_name: string;
  person_id?: string;
  person_name: string;
  person_initials: string;
  status: AssignmentStatus;
  decline_reason?: string;
  substitute_person_name?: string;
  is_external?: boolean;
  has_conflict?: boolean;
  is_overridden?: boolean;
  override_reason?: string;
  notes?: string;
  notes_list?: string[];
}

export interface RosterMatrix {
  month: string;
  services: ChurchService[];
  teams: string[];
  assignments: RosterAssignment[];
  summary: {
    open_slots: number;
    not_confirmed: number;
    confirmed: number;
    declined: number;
  };
}

export interface CareGroupMember {
  person_id: string;
  full_name: string;
  standing: string;
  is_leader: boolean;
  enrolled_at?: string;
}

export interface CareGroup {
  id: string;
  name: string;
  zone: string;
  leader_person_id?: string;
  leader_name: string;
  meeting_day: string;
  meeting_time?: string;
  meeting_address?: string;
  members_count: number;
  members?: CareGroupMember[];
}

export interface UnplacedPerson {
  person_id: string;
  full_name: string;
  initials: string;
  zone: string;
  requested_at?: string;
}

export interface MeetingSession {
  id: string;
  care_group_id: string;
  care_group_name: string;
  date: string;
  date_label: string;
  host_name: string;
  topic: string;
  offering_amount: number;
  attendees_count: number;
  guests_count: number;
}

export interface AbsenceAlert {
  id: string;
  person_id: string;
  person_name: string;
  person_phone: string;
  care_group_id: string;
  care_group_name: string;
  consecutive_absences: number;
  last_attended_date: string;
  status: 'pending' | 'contacted' | 'dismissed';
  contact_notes?: string;
  dismiss_reason?: string;
}

export interface ChurchProfile {
  id: string;
  name: string;
  address: string;
  city: string;
  time_zone: string;
  worship_day: string;
  code: string;
  deep_link: string;
  phone: string;
  email: string;
  devices_following: number;
  members_signed_in: number;
  applicants_waiting: number;
}

export interface GuestApplicant {
  id: string;
  full_name: string;
  initials: string;
  phone: string;
  email?: string;
  worshipping_duration: string;
  current_membership: string;
  requested_category: string;
  status: 'pending' | 'contacted' | 'admitted' | 'rejected';
  days_waiting: number;
  submitted_at_label: string;
  contact_notes?: string;
  household_action?: string;
  care_group_assignment?: string;
}
