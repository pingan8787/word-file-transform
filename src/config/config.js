export const defaultConfig = {
    defaultFileTitle: '文件名称读取失败！',
    defaultTransformType: 'html', // 默认使用 html ，还支持 md 文件
    imageFilterType: /wmf|emf/,
    imageTypeErrorMsg: type => {msg: "暂不支持 " + type + ' 格式图片，请手动上传！'}
}