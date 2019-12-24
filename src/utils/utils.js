import { defaultConfig } from "@config/config";
import TransformFn from '@config/transformFn';
const nanoajax = require('nanoajax')

const base64ToBlob = (base64, mime = "") => {
    const sliceSize = 1024;
    const byteChars = window.atob(base64);
    const byteArrays = [];
    for (
        let offset = 0, len = byteChars.length;
        offset < len;
        offset += sliceSize
    ) {
        const slice = byteChars.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: mime });
}

export function getFileNameAsContentTitle(file){
    return file.name ? file.name.replace(/(.*\/)*([^.]+).*/ig,"$2") : defaultConfig.defaultFileTitle;
}

export async function uploadBase64Image(base64Image, mime, imageUploadUrl, config) {
    try {
        const imageData = new FormData();
        imageData.append("file", base64ToBlob(base64Image, mime));
        return new Promise (async (resolve, reject) => {
            await nanoajax.ajax({
                url: imageUploadUrl, 
                method: "POST",
                body: imageData, 
                headers: config.headers
            },(code, responseText, request) => {
                let result = responseText ? JSON.parse(responseText) : {};
                resolve(result)
            });
        })
    } catch (error) {
        console.log('uploadBase64Image error: ',error);
    }
}

export async function setMammothOptions (option) {
    try {
        const { imageTransform, mammothOption } = option;
        const convertImage = await TransformFn['image'](imageTransform);
        return { convertImage, ...mammothOption }
    } catch (error) {
        console.log('setMammothOptions error: ',error);
    }
}


export function readFileInputEventAsArrayBuffer(file, callback) {
    const reader = new FileReader();
    reader.onload = function (loadEvent) {
        const arrayBuffer = loadEvent.target["result"];
        callback(arrayBuffer);
    };
    reader.readAsArrayBuffer(file);
}