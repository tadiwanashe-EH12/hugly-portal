import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  idNumber: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  role: z.string().optional(),
  department: z.string().optional(),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  acceptedTerms: z.boolean()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  otp: z.string().optional()
});
