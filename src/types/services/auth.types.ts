import type { CardAttributes } from "@/types";

export interface Tokens {
  accessToken: string;
  refreshToken: string;
  token_type: "bearer";
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  tokens: Tokens;
  data: {
    user_id: string;
    username: string;
    mail: string;
    cards: CardAttributes[] | [];
  };
}

export interface RegisterRequest {
  username: string;
  mail: string;
  password: string;
}

export interface RegisterResponse {
  user: {
    user_id: string;
    username: string;
    mail: string;
    created_at: Date;
  };
}

export interface ConfirmEmailRequest {
  userId: string;
  token: string;
}

export interface DeleteUserRequest {
  userId: string;
  password: string;
}

export interface DeleteUserResponse {
  message: string;
}

export interface ChangePasswordRequest {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  code: string;
  message: string;
}
