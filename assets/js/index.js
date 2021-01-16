// 获取用户信息,渲染到头像区域--------------------
function getUserInfo() {
    $.ajax({
        url: "/my/user/userinfo",
        success: function (res) {
            // console.log(res);
            if (res.status === 0) {
                //设置欢迎你,xxx(优先使用昵称)
                var name = res.data.nickname || res.data.username;
                $(".username").text(name);
                //设置头像(优先使用图片)
                if (res.data.user_pic) {
                    //有图片
                    $(".layui-nav-img").attr("src", res.data.user_pic).show();
                    $(".text-avatar").hide();
                } else {
                    //没有图片,截取名字的第一个字,转大写
                    var first = name.substr(0, 1).toUpperCase();
                    // show方法作用是恢复元素的默认样式 span默认是行内元素,show会把span设置成display:inline  所以需要css来设置样式
                    $(".text-avatar")
                        .text(first)
                        .css("display", "inline-block");
                }
            }
        },
    });
}
getUserInfo();

//退出-----------------------------------------
$("#logout").on("click", function (e) {
    e.preventDefault();
    //询问是否退出--删除token--跳转到登录
    layer.confirm("您确认要退出吗?", function (index) {
        localStorage.removeItem("token");
        location.href = "./login.html";
        //关闭弹层
        layer.close(index);
    });
});
