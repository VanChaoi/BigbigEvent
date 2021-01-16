// 初始化建材插件
//1.1找到图片
var $image = $("#image");
//1.2写一个配置
var option = {
    //剪裁框的宽高比
    aspectRatio: 1,
    //指定:预览区
    preview: ".img-preview",
};
//1.3调用cropper方法初始化
$image.cropper(option);

//2 点击选择头像,能够实现选择图片------------------
$("#chooseFile").on("click", function () {
    $("#file").trigger("click");
});
//3文件域内容改变,能够更换剪裁区图片----------------------
$("#file").on("change", function () {
    // console.log(123);
    if (this.files.length > 0) {
        // 3.1找到文件对象
        // console.dir(this);
        var fileObj = this.files[0];
        //3.2为文件对象创建临时的url
        var url = URL.createObjectURL(fileObj);
        // console.log(url);
        // 3.3更换剪裁区图片(销毁剪裁框---更换图片---重新生成剪裁框)
        $image.cropper("destroy").attr("src", url).cropper(option);
    }
});

//4.点击确认修改按钮,实现更换头像------------------
$("#sure").on("click", function () {
    //剪裁图片,得到canvas
    var canvas = $image.cropper("getCroppedCanvas", { width: 30, height: 30 });
    //把canvas转成base64格式
    var base64 = canvas.toDataURL();
    //ajax提交
    $.ajax({
        type: "POST",
        url: "/my/user/avatar",
        data: { avatar: base64 },
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                window.parent.getUserInfo();
            }
        },
    });
});
