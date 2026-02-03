import { z } from 'zod';
import { Type, type Static } from '@sinclair/typebox';

// --- ZOD SCHEMAS ---

// Login Schema (e.g. for Forms)
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

// User Schema (e.g. for API data)
export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['admin', 'user', 'guest']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type User = z.infer<typeof userSchema>;

// --- TYPEBOX SCHEMAS ---

// Product Schema (e.g. for Fastify/API validation or just high perf validation)
export const ProductSchema = Type.Object({
    id: Type.Number(),
    title: Type.String(),
    price: Type.Number(),
    thumbnail: Type.String(),
});

export type ProductType = Static<typeof ProductSchema>;

// Validation Helper for Typebox
import { TypeCompiler } from '@sinclair/typebox/compiler';

const ProductCompiler = TypeCompiler.Compile(ProductSchema);

export const validateProduct = (data: unknown) => {
    const isValid = ProductCompiler.Check(data);
    return {
        isValid,
        errors: isValid ? [] : [...ProductCompiler.Errors(data)],
    };
};
