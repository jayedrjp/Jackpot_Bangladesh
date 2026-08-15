export type UserRole = "customer" | "admin";

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
}
