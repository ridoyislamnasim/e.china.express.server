// Central types for Auth module

export interface AuthUserSignUpPayload {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  roleId?: number; 
}

export interface EmailUser {
  email: string;
  name?: string;
}

export interface EmailProps {
  to: string;
  firstName: string;
  OTP: string;
  from: string;
}
