// 更换内容区为富文本------------------------
initEditor();
//获取地址栏的id参数---------------------------------
var id = new URLSearchParams(location.search).get("id");

//获取分类-----------------------------
//渲染到下拉框的位置
var form = layui.form;
$.ajax({
    url: "/my/category/list",
    success: function (res) {
        var str = template("tpl-category", res);
        $("select[name=cate_id]").append(str);
        // form.render('select','lay-filter属性值')
        form.render("select");
        $.ajax({
            url: "/my/article/" + id,
            success: function (res) {
                console.log(res.data);
                //使用layui的form.val()
                form.val("article", res.data);
                // tinyMCE.activeEditor.setContent(res.data.content);
                $image
                    .cropper("destroy")
                    .attr("src", baseUrl + "/" + res.data.cover_img)
                    .cropper(option);
            },
        });
    },
});

//封面图片处理-------------------------------
// 初始化剪裁框
var $image = $("#image");
// - 设置配置项
var option = {
    // 宽高比
    aspectRatio: 400 / 280,
    // 纵横比(宽高比)
    aspectRatio: 1, // 正方形
    // 指定预览区域
    preview: ".img-preview", // 指定预览区的类名（选择器）
};
// - 调用cropper方法，创建剪裁区
$image.cropper(option);

//选择封面
$(".image").on("click", function () {
    $("#file").trigger("click");
});
$("#file").on("change", function () {
    var fileObj = this.files[0];
    var url = URL.createObjectURL(fileObj);
    $image.cropper("destroy").attr("src", url).cropper(option);
});

//完成添加文章
$("form").on("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(this); //传入dom对象
    // 单独向df中添加content
    fd.set("content", tinyMCE.activeEditor.getContent());
    // 对于图片来说,先剪裁,向fd中追加文件对象
    var canvas = $image.cropper("getCroppedCanvas", {
        width: 400,
        height: 280,
    });
    canvas.toBlob(function (blob) {
        fd.append("cover_img", blob);
        fd.append("id", id);
        $.ajax({
            url: "/my/article/update",
            type: "POST",
            data: fd,
            processData: false, //不要把fd对象转成查询字符串
            contentType: false, //不要设置Content-Type请求头
            success: function (res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    location.href = "./list.html";
                }
            },
        });
    });
});
