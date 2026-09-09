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
