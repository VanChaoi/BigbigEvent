//登录注册切换-----------------------------
$(".login a").on("click", function () {
    $(".login").hide().next().show();
});
$(".register a").on("click", function () {
    $(".register").hide().prev().show();
});

//注册功能---------------------------------
//表单提交--阻止默认行为--收集表单数据--ajax提交
$(".register form").on("submit", function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.ajax({
        url: "/api/reguser",
        type: "POST",
        data: data,
        success: function (res) {
            //提示
            layer.msg(res.message);
            if (res.status === 0) {
                //清空输入框,找到表单,转成DOM对象,调用reset方法重置表单
                $(".register form")[0].reset();
                //切换到登录的盒子
                $(".register a").trigger("click");
            }
        },
    });
});

//自定义表单验证----------------------------
//必需使用layui内置的form模块
//只要使用layui的模块,必需加载模块
var form = layui.form; //加载form模块
var laypage = layui.laypage; //加载laypage分页模块
var tree = layui.tree; //加载属性组件模块

//调用form模块内置方法verify,自定义验证规则
form.verify({
    //验证用户名长度6-12位,只能是数字字母组合
    // user:[/正则表达式/,'验证不通过的提示']
    user: [/^[a-zA-z0-9]{2,10}$/, "用户名只能是数字字母,且2~12位"],

    len: [/^\S{6,12}$/, "密码6~12位,切不能有空格"],
    //支持写函数
    same: function (val) {
        //形参,表示使用该验证规则的输入框的值
        if (val !== $(".pwd").val()) {
            return "两次密码不一致";
        }
    },
});

//登录功能--------------------------------
//表单提交--阻止默认行为--收集表单数据--ajax提交
$(".login form").on("submit", function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.ajax({
        url: "/api/login",
        type: "POST",
        data: data,
        success: function (res) {
            if (res.status === 0) {
                //登录成功,保存token
                localStorage.setItem("token", res.token);
                //跳转到首页面index.html
                location.href = "./index.html";
            }
        },
    });
});
