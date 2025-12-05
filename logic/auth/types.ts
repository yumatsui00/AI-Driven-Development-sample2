export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
