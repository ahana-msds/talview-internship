// Zod for form and API validation
import { z } from 'zod';
// Typebox for high-performance schema validation
import { Type, type Static } from '@sinclair/typebox';

// --- ZOD SCHEMAS ---
/**
 * Login Schema: Validates email and password requirements for the login form.
 */
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

/**
 * Signup Schema: Extension of loginSchema including name.
 */
export const signupSchema = loginSchema.extend({
    name: z.string().min(2, 'Name must be at least 2 characters'),
});

/**
 * User Schema: Validates the structure of User objects, typically from an API.
 */
export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['admin', 'user', 'guest']),
});

// Infer TypeScript types from Zod schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type User = z.infer<typeof userSchema>;

// --- TYPEBOX SCHEMAS ---
/**
 * Product Schema: A high-performance schema for validating individual product items.
 */
export const ProductSchema = Type.Object({
    id: Type.Number(),
    title: Type.String(),
    price: Type.Number(),
    thumbnail: Type.String(),
});

// Static Type from Typebox
export type ProductType = Static<typeof ProductSchema>;

// Validation Helper for Typebox
import { TypeCompiler } from '@sinclair/typebox/compiler';

// Compile the schema for faster repeated validation checks
const ProductCompiler = TypeCompiler.Compile(ProductSchema);

/**
 * validateProduct: A utility function to check if an object adheres to the Product schema.
 */
export const validateProduct = (data: unknown) => {
    const isValid = ProductCompiler.Check(data);
    return {
        isValid,
        errors: isValid ? [] : [...ProductCompiler.Errors(data)],
    };
};