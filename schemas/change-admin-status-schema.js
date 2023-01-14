const yup = require('yup');

const changeAdminStatusSchema = yup.object({
    body: yup.object({
        is_admin: yup.boolean().required(),
    }),
    params: yup.object({
        id: yup.number().required(),
    })
})

module.exports = changeAdminStatusSchema;