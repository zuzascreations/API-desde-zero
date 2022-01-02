const Joi = require('joi')

const userSchema = Joi.object({
    email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'es', 'gal'] } })
        .message({
            'any.required': '[email] is required',
            'string.empty': '[email] is required',
            'string.email': '[email] is not in correct format'
        }),

    password: Joi.string()
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{4,15}$'))
        .messages({
            'any.required': '[password] is required',
            'string.empty': '[password] is required',
            'string.pattern': '[password] should contain at least one lowercase and uppercase letter, one number and to be between 4 and 15 characters.'
        }),

    username: Joi.string()
        .required()
        .min(4)
        .max(30)
        .messages({
            'any.required': '[username] is required',
            'string.empty': '[username] is required',
            'string.min': '[username] should be between 3 and 50 characters',
            'string.max': '[username] should be between 3 and 50 characters'
        }),

    createdAt: Joi
        .date().default(Date.now)
})

module.exports = userSchema