const Joi = require('joi');

/**
 * Joi Validation Examples
 * Demonstrates schema definition and validation.
 */

// Define a schema for a 'User' object
const userSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': `"username" should be a type of 'text'`,
            'string.empty': `"username" cannot be an empty field`,
            'string.min': `"username" should have a minimum length of {#limit}`,
            'any.required': `"username" is a required field`
        }),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),

    birth_year: Joi.number()
        .integer()
        .min(1900)
        .max(2013),

    role: Joi.string()
        .valid('admin', 'user', 'guest')
        .default('user')
});

// Function to validate user data against the schema
const validateUser = (userData) => {
    // abortEarly: false means return ALL errors, not just the first one
    const { error, value } = userSchema.validate(userData, { abortEarly: false });

    if (error) {
        return {
            isValid: false,
            // Format errors into a readable array of messages
            errors: error.details.map(detail => detail.message)
        };
    }

    return {
        isValid: true,
        value
    };
};

module.exports = {
    userSchema,
    validateUser
};
