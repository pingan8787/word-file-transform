/** 初始化文件转换方法，file是上传的文件，是File类型，config是配置项，是Object类型 */
declare class WordFileTransform {

    static file: File //静态变量
    static config: Object //静态方法

    constructor(file: File, config: Object)  //构造函数
    wordTransform(): void 
}