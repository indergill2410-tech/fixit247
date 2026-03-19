import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['HOMEOWNER', 'TRADIE'])
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const jobSchema = z.object({
  title: z.string().min(3),
  category: z.string().min(2),
  description: z.string().min(20),
  urgency: z.enum(['TODAY', 'THIS_WEEK', 'FLEXIBLE']),
  suburb: z.string().min(2),
  state: z.string().min(2),
  postcode: z.string().min(4),
  budgetMin: z.coerce.number().min(50),
  budgetMax: z.coerce.number().min(50),
  availability: z.string().min(5),
  photoUrls: z.array(z.string()).default([])
});

export const quoteSchema = z.object({
  jobId: z.string().min(1),
  title: z.string().min(3),
  scope: z.string().min(20),
  subtotalAmount: z.coerce.number().min(100),
  estimatedDuration: z.string().min(3),
  estimatedStart: z.string().optional(),
  lineItems: z.array(
    z.object({
      label: z.string().min(2),
      amount: z.coerce.number().min(0)
    })
  ).min(1)
});

export const messageSchema = z.object({
  jobId: z.string().min(1),
  body: z.string().min(1).max(1000)
});
