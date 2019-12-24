import { defaultConfig } from "@config/config";
import TransformFn from "@config/transformFn";
import {
    setMammothOptions, getFileNameAsContentTitle, readFileInputEventAsArrayBuffer
} from "@utils/utils";

export default class WordFileTransform {
    constructor({file, config}){
        this.config = config;
        this.file = file;
    }

    async wordTransform(){
        try {
            const{ convertType, wordTransform, imageTransform, mammothOption } = this.config;
    
            const fileMammothOption = await setMammothOptions({ imageTransform, mammothOption });
            const wordTitle = getFileNameAsContentTitle(this.file);
            const transformType = (convertType || defaultConfig.defaultTransformType).toLowerCase();
            const transformTypeFn = TransformFn[transformType];
    
            const transformFnConfig = {
                options: fileMammothOption,
                config: { wordTitle, ...wordTransform }
            }
    
            readFileInputEventAsArrayBuffer(this.file, arrayBuffer =>  {
                const input = { arrayBuffer };
                transformTypeFn && transformTypeFn({input, ...transformFnConfig});
            });
        } catch(error){
            console.log('wordTransform error: ',error);
        }
    }
}