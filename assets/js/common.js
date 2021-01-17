//项目的通用配置文件

//项目的根路径
var baseUrl = "http://www.itcbc.com:8080";
$.ajaxPrefilter(function (option) {
    //opyion表示ajax请求的选项,可以对选项进行修改
    option.url = baseUrl + option.url;
    //配置headers
    option.headers = {
        Authorization: localStorage.getItem("token"),
    };
    //配置complete.请求完成后执行
    option.complete = function (xhr) {
        var res = xhr.responseJSON;
        //判断token是否过期
        if (res && res.status === 1 && res.message === "身份认证失败！") {
            localStorage.removeItem("token");
            // 跳转登录页面
            //location.pathname 表示地址路径部分
            if (location.pathname === "/index.html") {
                location.href = "./login.html";
            } else {
                window.parent.location.href = "../login.html";
            }
        }
        //处理错误提示
        if (res && res.status === 1) {
            layer.msg(res.message);
        }
    };
});
