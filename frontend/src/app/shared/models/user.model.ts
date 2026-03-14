export interface User {
  _id: string;
  email: string;
  token?: string;
  isPro?: boolean;
}

export interface AuthResponse {
  _id: string;
  email: string;
  token: string;
  isPro: boolean;
}