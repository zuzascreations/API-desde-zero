const Joi = require('joi')

const entrySchema = Joi.object({
    place: Joi.string()
        .required()
        .min(2)
        .max(50)
        .messages({
            'any.required': '[place] is required',
            'string.empty': '[place] is required',
            'string.min': '[place] should be between 2 and 50 characters',
            'string.max': '[place] should be between 2 and 50 characters'
        }),

    description: Joi.string()
        .required()
        .min(20)
        .max(500)
        .messages({
            'any.required': '[description] is required',
            'string.empty': '[description] is required',
            'string.min': '[description] should be between 20 and 50 characters',
            'string.max': '[description] should be between 20 and 50 characters'
    }),

    createdAt: Joi
        .date().default(Date.now),

    modifiedAt: Joi
        .date().default(Date.now),

    userId: Joi.string()
        .required()
        // .message({
        //     'any.required': '[userId] is required'
        // })
})


module.exports = entrySchema