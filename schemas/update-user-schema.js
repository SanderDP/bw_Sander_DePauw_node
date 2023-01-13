const yup = require('yup');

const registerUserSchema = yup.object({
    body: yup.object({
        name: yup.string().min(3).max(99).optional(),
        email: yup.string().email().optional(),
        birthday: yup.date().optional(),
        avatar: yup.string().oneOf(['jpg, png']).optional(),
        about_me: yup.string().min(5).optional(),
    }),
    params: yup.object({
        id: yup.number().required(),
    })
})

module.exports = registerUserSchema;