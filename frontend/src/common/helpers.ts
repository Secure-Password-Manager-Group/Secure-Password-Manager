import { z } from 'zod';

export const passwordSchema = z
    .string()
    .min(8, { message: 'Password is too short' })
    .max(32, { message: 'Password is too long' })
    .refine((password) => /[a-z]/.test(password), {
        message: 'Password must contain at least one lowercase letter'
    })
    .refine((password) => /[0-9]/.test(password), {
        message: 'Password must contain at least one digit'
    });
