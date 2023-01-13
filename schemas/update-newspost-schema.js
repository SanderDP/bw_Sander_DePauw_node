const yup = require('yup');

function checkFileSupportedFormat(filename){
    var filetype = filename.split(".").pop();
    if (filetype == "jpg" || filetype == "png"){
        return true;
    } else{
        return false;
    }
}

const updateNewsPostSchema = yup.object({
    body: yup.object({
        title: yup.string().min(3).max(99).optional(),
        img_file_path: yup.string().optional().test('filetype', 'only .png and .jpg files are accepted', checkFileSupportedFormat),
        content: yup.string().min(5).optional(),
    }),
    params: yup.object({
        id: yup.number().required(),
    })
})

module.exports = updateNewsPostSchema;