// Central types for Auth module

export interface AuthUserSignUpPayload {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  role?: string; 
}
