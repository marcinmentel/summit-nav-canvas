import {string, z } from "zod"
import apiClient from "../../integrations/supabase/apiClient";
// export const loginSchema = z.object( {
//     email: z.string().email(),
//     password: z.string().min(6)
// })

// export type LoginSchema = z.infer<typeof loginSchema>;

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Adres e-mail jest wymagany')
    .email('Nieprawidłowy format adresu e-mail'),

  password: string()
    .min(8, 'Hasło musi mieć co najmniej 6 znaków'), // Możesz dodać więcej reguł dla hasła
});

export type SignInCredentials = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: z
    .string(),
  email: z
    .string()
    .min(1, 'Adres e-mail jest wymagany')
    .email('Nieprawidłowy format adresu e-mail'),

  password: z
    .string()
    .min(8, 'Hasło musi mieć co najmniej 6 znaków'), 
  confirmPassword: z
    .string()
    .min(8, 'Hasło musi mieć co najmniej 6 znaków'),
});

// Wnioskowanie typu TypeScript z tego schematu
export type SignUpCredentials = z.infer<typeof signUpSchema>;

export interface UserProfile {
    displayName : string,
    userName: string,
    email: string,
    role: string
} 


export const authLogin = async (credentials: SignInCredentials): Promise<UserProfile> => {
  const res = await apiClient.post("/api/auth/login",credentials);
  return res.data;
};
 
export const authRegister = async (credentials: SignUpCredentials): Promise<void> => {// dodac UserProfile
  const res = await apiClient.post("/api/auth/register",credentials);
  return res.data;
};
 
export const getCurrentUser = async (): Promise<UserProfile> => {
  const res = await apiClient.get("/api/auth/currentUser");
  return res.data;
};

export const authLogout = async ( ): Promise<void> => {
  const res = await apiClient.post("/api/auth/logout");
  return res.data;
};