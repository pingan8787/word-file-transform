## Word-file-transform

### 一、简介

本项目是在开发**富文本编辑器项目**中的一个需求项，结合团队大佬的经验分享，整理成这个项目。

Word-file-transform 是基于 [mammoth.js](https://github.com/mwilliamson/mammoth.js) 插件进行二次开发。

目的在于实现通过上传并解析 Word 文件，并将 Word 文件中的各种格式的图片上传到指定接口。目前支持绝大部分格式的图片，如 **.png**、**.jpg**、**.jpeg**、**.gif**等，目前已知不支持 **.wmf**、**.emf**格式文件。

目前本项目支持 Word 文件转 HTML 字符串输出，如果需要转成 Markdow 或 其他格式，可以参考[mammoth.js](https://github.com/mwilliamson/mammoth.js) 插件 API 进行开发。可以将解析规则在 `/src/config/transformFn.js` 中拓展。

### 二、快速上手

这里以 React + AntDesign 项目为例：

1. 引入 `WordFileTransform` 包

暂时还没提交 npmjs，所以先从 dist 目录拷贝并引入。

```js
import WordFileTransform from '@util/common/word-file-transform.umd.js';
```

2. 配置需要使用的参数

在 AntDesign 中，建议在 `Upload` 组件的 `beforeUpload` 方法中使用，具体参数可查看后面**参数列表**介绍。

```js
export default class ImportDocsComponent extends React.Component {
    // ...
    beforeUpload(file, fileList) {
        return new Promise(async (resolve, reject) => {
            const _this = this;
            const transformSuccessFn = function (data) {
                const {title, content } = data;
                // 插入富文本操作
                message.success('文档加载成功！', 2);
            };
            const transformErrorFn = function(err){
                message.error(err.msg);
            };
            const imageTransformErrorFn = function(err){
                message.error(err.msg);
            };
            const imageUrlTransformFn = res => res.data.url;
            const imageUploadUrl = "https://www.pingan8787.com";
            const userToken = await UTIL.getUserToken();
            const props = {
                file,
                config: {
                    imageTransform: {
                        imageUrlTransformFn,
                        imageUploadUrl,
                        imageTransformErrorFn,
                        axiosPostConfig: {headers: {token:userToken}}
                    },
                    wordTransform:{
                        transformSuccessFn,
                        transformErrorFn
                    }
                }
            };
            let WordTransform = new WordFileTransform(props);
            WordTransform.wordTransform();
            reject();
        })
    }
    // ...
}
```


### 三、参数列表

**file**

|参数|类型|说明|是否必传|默认值|返回值|
|---|---|---|---|---|---|
|`file`|`File`|word 文件数据（即 `file` 值）|**必传**|无|无|

**config**

|参数|类型|说明|是否必传|默认值|返回值|
|---|---|---|---|---|---|
|`convertType`|`String`|word 文件数据（即 `file` 值）|非必传|`html`|无|
|`wordTransform`|`Object`|`wordTransform` 是一个对象，详细查看下表介绍||`html`|无|
|`imageTransform`|`Object`|`imageTransform` 是一个对象，详细查看下表介绍||`html`|无|
|`mammothOption`|` Object`|用于设置 mammoth 自带的 options。|非必传|无|无|

**config.wordTransform**

|参数|类型|说明|是否必传|默认值|返回值|
|---|---|---|---|---|---|
|`transformSuccessFn`|`Function`|设置 word 文件转换成功后的回调，一般可能是弹框提示，插入编辑区等操作。|非必传|无|`Function({title, content})`|
|`transformErrorFn`|`Function`|设置 word 文件转换失败后的回调，一般可能是弹框提示等操作。|非必传|无|`Function({msg})`|

**config.imageTransform**

|参数|类型|说明|是否必传|默认值|返回值|
|---|---|---|---|---|---|
|`imageUrlTransformFn`|`Function`|设置图片上传成功后数据格式。|**必传**|无|`Function(): Object`，如 `{url: 'www.demo.com'}`|
|`imageTransformErrorFn`|`Function`|图片上传失败的回调方法。|非必传|无|`Function(errorData)`|
|`imageTransformSuccessFn`|`Function`|图片上传成功的回调方法。|非必传|无|`Function(imageData)`|
|`imageUploadFn`|`Function`|自定义图片上传方法。|非必传|无|无|
|`imageUploadUrl`|`String`|设置图片上传地址。|**必传**|无|无|
|`axiosPostConfig`|`Object`|设置上传方法的请求头信息。|非必传|无|无|

参数案例如下：

```js
const params = {
    file : {},                         // File类型，必传，word 文件数据（即 file 值）
    config : {
        convertType?: '',              // String类型，非必传，表示需要转成的目标类型，默认 html
        wordTransform:{                // Object类型，设置 word 文件转换的相关操作
            transformSuccessFn?,       // Function类型，非必传，设置 word 文件转换成功后的回调，一般可能是弹框提示，插入编辑区等操作。返回值类型 {title, content}
            transformErrorFn?,         // Function类型，非必传，设置 word 文件转换失败后的回调，一般可能是弹框提示等操作。返回值类型 {msg}
        },
        imageTransform: {              // Object类型，设置 word 文件中 image 处理的相关操作
            imageUrlTransformFn,       // Function类型，必传，设置图片上传成功后数据格式，需要转成类似 {url: 'www.demo.com'} 的格式返回
            imageTransformErrorFn?,    // Function类型，非必传，图片上传失败的回调方法，Function(errorData)
            imageTransformSuccessFn?,  // Function类型，非必传，图片上传成功的回调方法，Function(imageData)
            imageUploadFn?,            // Function类型，非必传，自定义图片上传方法
            imageUploadUrl,            // String类型，必传，设置图片上传地址
            axiosPostConfig?,          // Object类型，非必传，设置 axios 上传方法的请求头信息，可参考 axios 参数，如{headers:{token:''}, timeout:''}
        },
        mammothOption,                 // Object类型，非必传，用于设置 mammoth 自带的 options
    }
}
```

## 四、WordFileTransform API介绍

*  **new WordFileTransform(props)**

实例化转换方法。

* **.wordTransform()**

执行转换操作。

```js
import WordFileTransform from "word-file-transform";
const props = {
    // ... 详见参考前面使用案例
}
const WordTransform = new WordFileTransform(props);
WordTransform.wordTransform();
```

