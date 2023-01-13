const yup = require('yup');

function checkFileSupportedFormat(filename){
    var filetype = filename.split(".").pop();
    if (filetype == "jpg" || filetype == "png"){
        return true;
    } else{
        return false;
    }
}

const registerUserSchema = yup.object({
    body: yup.object({
        name: yup.string().min(3).max(99).optional(),
        email: yup.string().email().optional(),
        birthday: yup.date().optional(),
        avatar: yup.string().optional().test('filetype', 'only .png and .jpg files are accepted', checkFileSupportedFormat),
        about_me: yup.string().min(5).optional(),
    }),
    params: yup.object({
        id: yup.number().required(),
    })
})

module.exports = registerUserSchema;