import { describe, it, expect } from 'vitest';
import { loginSchema, validateProduct, type ProductType } from '@/lib/validation'; // Testing Alias

describe('Validation Logic', () => {
    it('zod: validates correct email', () => {
        const result = loginSchema.safeParse({ email: 'test@example.com', password: 'password123' });
        expect(result.success).toBe(true);
    });

    it('zod: fails invalid email', () => {
        const result = loginSchema.safeParse({ email: 'invalid-email', password: 'password123' });
        expect(result.success).toBe(false);
    });

    it('typebox: validates correct product', () => {
        const product: ProductType = {
            id: 1,
            title: 'Test Product',
            price: 100,
            thumbnail: 'url',
        };
        const { isValid } = validateProduct(product);
        expect(isValid).toBe(true);
    });

    it('typebox: fails invalid product', () => {
        const invalidProduct = {
            id: 'should be number',
            title: 'Test Product',
        };
        const { isValid } = validateProduct(invalidProduct);
        expect(isValid).toBe(false);
    });
});
