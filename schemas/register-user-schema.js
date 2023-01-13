const yup = require('yup');

const registerUserSchema = yup.object({
    body: yup.object({
        name: yup.string().min(3).max(99).required(),
        email: yup.string().email().required(),
        password: yup.string().min(5).required(),
    })
})

module.exports = registerUserSchema;