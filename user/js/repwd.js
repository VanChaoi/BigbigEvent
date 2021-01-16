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
//1.密码长度6-12位(三个input都需要)
//2.新密码和原密码不能一样(新密码使用)
//3.两次新密码必需一致(重复密码使用)
var form = layui.form;
form.verify({
    len: [/^\S{6,12}$/, "长度必需6~12位且不能出现空格"],
    diff: function (val) {
        if (val === $("input[name=oldPwd]").val()) {
            return "新密码不能和原始密码相同";
        }
    },
    same: function (val) {
        if (val !== $("input[name=newPwd]").val()) {
            return "两次密码不一致";
        }
    },
});
