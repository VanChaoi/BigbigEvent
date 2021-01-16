//获取分类
//封装函数,获取所有的分类,并渲染到页面中
//等后续的删除,编辑,添加,操作之后,还要调用这个函数更新页面的数据
//render  渲染   category 类别
function renderCategory() {
    //发送ajax请求,获取数据,注意请求头
    $.ajax({
        url: "/my/category/list",
        success: function (res) {
            // console.log(res);
            if (res.status === 0) {
                var str = template("tpl-list", res);
                $("tbody").html(str);
            }
        },
    });
}

renderCategory();

//删除分类
$("tbody").on("click", ".del", function () {
    // alert(123);
    var id = $(this).attr("data-id");
    //使用layui弹层提示
    layer.confirm("确定删除吗", function (index) {
        //do something
        //用户点击了确定会执行这个函数
        $.ajax({
            url: "/my/category/delete",
            data: { id: id },
            success: function (res) {
                // console.log(res);
                renderCategory();
            },
        });
        //关闭弹层
        layer.close(index);
    });
});

//添加类别
var addIndex;
//点击添加类别
$('button:contains("添加类别")').on("click", function () {
    //添加完生成弹层
    var addIndex = layer.open({
        type: 1,
        title: "添加分类",
        content: $("#tpl-add").html(),
        area: ["500px", "250px"],
    });
});

//2.表单提交,完成添加
$("body").on("submit", "#add-form", function (e) {
    e.preventDefault();
    //收集表单数据
    $.ajax({
        type: "POST",
        url: "/my/category/add",
        data: $(this).serialize(),
        success: function (res) {
            console.log(res);
            layer.msg(res.message);
            if (res.status === 0) {
                renderCategory();
                $("#add-form")[0].reset();
                //关闭弹层
                layer.close(addIndex);
            }
        },
    });
});

/* 修改分类 */
var editIndex;
//1.点击编辑,出现弹层
$("tbody").on("click", 'button:contains("编辑")', function () {
    //获取时间源的三个自定义的属性值
    var shuju = $(this).data(); //jquery的data方法,不传递参数,表示获取全部的data-xx属性值

    editIndex = layer.open({
        type: 1,
        title: "编辑类别",
        content: $("#tpl-edit").html(),
        area: ["500px", "250px"],
        //弹层后,调用下面的sucess函数
        success: function () {
            //数据回填
            //2.完成数据回填
            $("#edit-form input[name=name]").val(shuju.name);
            $("#edit-form input[name=alias]").val(shuju.alias);
            $("#edit-form input[name=id]").val(shuju.id);
        },
    });
});

//3.表单提交,完成修改
$("body").on("submit", "#edit-form", function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    //保证接口的是三个参数()都有,然后ajax提交
    $.ajax({
        url: "/my/category/update",
        type: "POST",
        data: data,
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                renderCategory();
                layer.close(editIndex);
            }
        },
    });
});
