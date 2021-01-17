//获取文章的请求参数
var data = {
    pagenum: 1,
    pagesize: 2,
};

//定义模板引擎的过滤器函数
template.defaults.imports.dateFormate = function (time) {
    return dateFormate(time);
};

//获取文章列表 渲染
function renderArticle() {
    $.ajax({
        url: "/my/article/list",
        data: data,
        success: function (res) {
            if (res.status === 0) {
                //调用模板引擎渲染数据
                var str = template("tpl-article", res);
                $("tbody").html(str);
                showPage(res.total);
            }
        },
    });
}
renderArticle();

//加载分页模块-------------------------------------------
var laypage = layui.laypage;

function showPage(t) {
    //执行一个laypage实例
    laypage.render({
        elem: "page", //注意，这里的 test1 是 ID，不用加 # 号
        count: t, //数据总数，从服务端得到
        limit: data.pagesize, //每页显示几条数据
        curr: data.pagenum, //当前页选中,比如3 效果就让3变换背景颜色表示被选中
        // 自定义排版
        layout: ["prev", "page", "next", "count"],
        //分页调用 showPage 调用时触发一次,后续点击页码还会触发
        jump: function (obj, first) {
            //obj包含了当前分页的所有参数，比如：
            // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
            // console.log(obj.limit); //得到每页显示的条数

            //首次不执行
            if (!first) {
                //修改当前页码
                data.pagenum = obj.curr; //比如点了3 obj.curr=3;把3赋值给ajax请求参数
                //修改每页显示的条数
                data.pagesize = obj.limit;
                renderArticle();
            }
        },
    });
}

//筛选-------------------------------------------------
//获取分类
var form = layui.form;
$.ajax({
    url: "/my/category/list",
    success: function (res) {
        var str = template("tpl-category", res);
        $("#category").append(str);
        // form.render('select','lay-filter属性值')
        form.render("select");
    },
});

//完成筛选
$("#seach").on("submit", function (e) {
    e.preventDefault();
    // 获取两个下拉框的值
    var cate_id = $("#category").val();
    var state = $("#state").val();
    //设置ajax请求的参数
    // if (cate_id) {
    //     data.cate_id = cate_id;
    // } else {
    //     delete data.cate_id; //delete 删除对象属性
    // }
    // if (state) {
    //     data.state = state;
    // } else {
    //     delete data.state;
    // }
    cate_id ? (data.cate_id = cate_id) : delete data.cate_id;
    state ? (data.state = state) : delete data.state;
    console.log(data);
    //筛选完后 重置页面为1
    data.pagenum = 1;
    renderArticle(); //渲染页面即可
});

//------------删除
$("tbody").on("click", ".del", function () {
    var id = $(this).data("id");
    var that = $(this);

    layer.confirm("确定删除吗?", function (index) {
        //使用dom的方式删除该行
        that.parents("tr").remove();

        $.ajax({
            url: "/my/article/delete/" + id,
            success: function (res) {
                layer.msg(res.message);
                if (res.status === 0) {
                    if ($("tbody").children().length > 0) {
                        renderArticle();
                    } else {
                        if (data.pagenum == 0) return;
                        data.pagenum--;
                        renderArticle();
                    }
                }
            },
        });
        layer.close(index);
    });
});
