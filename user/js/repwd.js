//完成重置密码---------------------
$("form").on("submit", function (e) {
    e.preventDefault();
    var data = $(this).serializeArray();
    $.ajax({
        type: "POST",
        url: "/my/user/updatepwd",
        data: data,
        success: function (res) {
            if (res.status === 0) {
                //修改成功,清空token,跳转到登录页,重新登录
                localStorage.removeItem("token");
                window.parent.location.href = "../login.html";
            }
        },
    });
});
//表单验证-------------------------
