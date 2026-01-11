import z, { email } from "zod";

export const RegisterSchema= z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(20, "Name must be at most 20 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export type RegisterDTO = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginDTO = z.infer<typeof LoginSchema>;

export const UserSchema = z.object({
  id: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
  role: z.string().optional(),
  status: z.string().optional(),
  sort: z.string().optional(),
  after: z.string().optional(),
  before: z.string().optional(),
});

export type UserDTO = z.infer<typeof UserSchema>;