import z from "zod";

export const AuthDtoSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be 6 characters"),
});

export type AuthUserInput = z.infer<typeof AuthDtoSchema>;
