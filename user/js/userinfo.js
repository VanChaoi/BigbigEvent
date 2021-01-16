//加载表单模块
var form = layui.form;
// 完成数据回填------------------------------
function renderUser() {
    $.ajax({
        url: "/my/user/userinfo",
        success: function (res) {
            // console.log(res);
            if (res.status == 0) {
                //数据回填
                // $("input[name=username]").val(res.data.username);
                // $("input[name=nickname]").val(res.data.nickname);
                // $("input[name=email]").val(res.data.email);
                // $("input[name=id]").val(res.data.id);
                // form.val("表单的lay-filter属性值","对象形式的数据(对象的key要和表单各项的name属性值相同)" );
                form.val("user", res.data);
            }
        },
    });
}
renderUser();

//修改信息-------------------------------
$("form").on("submit", function (e) {
    e.preventDefault();
    var data = $(this).serializeArray();
    // console.log(data);
    $.ajax({
        type: "POST",
        url: "/my/user/userinfo",
        data: data,
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                //调用getUserInfo()更新昵称
                window.parent.getUserInfo();
            }
        },
    });
});

//重置--------------------------------------
$("button[type=reset]").on("click", function (e) {
    e.preventDefault();
    renderUser();
});
