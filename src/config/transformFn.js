const mammoth = require("mammoth");
import { defaultConfig } from "@config/config";
import { uploadBase64Image } from "@utils/utils";

export default{
    "image": async params => {
        try {
            const { 
                imageUploadUrl, imageUrlTransformFn, imageTransformErrorFn, 
                imageTransformSuccessFn, axiosPostConfig 
            } = params;
            return await mammoth.images.imgElement(async image => {
                const {imageFilterType, imageTypeErrorMsg} = defaultConfig;
                const imageType  = image.contentType;
                if(imageFilterType.test(imageType)){
                    const errObj = imageTypeErrorMsg(imageType);
                    imageTransformErrorFn && imageTransformErrorFn(errObj);
                    return false;
                }else{
                    const imageBuffer = await image.read("base64");
                    const uploadImage = await uploadBase64Image(imageBuffer, imageType, imageUploadUrl, axiosPostConfig);
                    imageTransformSuccessFn && imageTransformSuccessFn(uploadImage);
                    return { src : imageUrlTransformFn(uploadImage) };
                }
            })
        } catch(error){
            console.log('transformFn error:', error);
        }
    },
    "html" : params => {
        const { input, options, config } = params;
        mammoth.convertToHtml(input, options)
            .then(res => config.transformSuccessFn({content: res.value, title: config.wordTitle}))
            .catch(err => config.transformErrorFn(err))
            .done();
    }, 
    // 可以拓展需要转换目标的类型，如 markdown
}