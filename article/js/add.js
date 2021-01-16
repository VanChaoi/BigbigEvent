InitEditor();
// - 找到剪裁区的图片 （img#image）
var $image = $("#image");
// - 设置配置项
var option = {
    // 纵横比(宽高比)
    aspectRatio: 1, // 正方形
    // 指定预览区域
    preview: ".img-preview", // 指定预览区的类名（选择器）
};
// - 调用cropper方法，创建剪裁区
$image.cropper(option);
