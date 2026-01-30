const { validateUser } = require('../../src/validation/user-schema');

describe('Joi Validation Schema Tests', () => {

    test('should validate a correct user object', () => {
        const validUser = {
            username: 'johndoe',
            email: 'john@example.com',
            password: 'password123',
            birth_year: 1990,
            role: 'user'
        };

        const result = validateUser(validUser);
        expect(result.isValid).toBe(true);
        expect(result.value).toEqual(validUser);
    });

    test('should fail when username is empty', () => {
        const invalidUser = {
            username: '',
            email: 'john@example.com',
            password: 'password123'
        };

        const result = validateUser(invalidUser);
        expect(result.isValid).toBe(false);
        // Expecting specific error message part from Joi
        expect(result.errors.some(msg => msg.includes('"username" cannot be an empty field'))).toBe(true);
    });

    test('should fail when email is invalid', () => {
        const invalidUser = {
            username: 'john',
            email: 'not-an-email',
            password: 'password123'
        };

        const result = validateUser(invalidUser);
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('"email" must be a valid email');
    });

    test('should use default role if not provided', () => {
        const userWithoutRole = {
            username: 'johndoe',
            email: 'john@example.com',
            password: 'password123'
        };

        const result = validateUser(userWithoutRole);
        expect(result.isValid).toBe(true);
        expect(result.value.role).toBe('user'); // Default value
    });
});
