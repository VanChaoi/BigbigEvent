## 演示地址和接口文档

案例接口文档：https://docs.apipost.cn/view/8675137ccc2b3ac0#3361314

线上演示地址：http://www.itcbc.com:8888/login.html

## 安装vscode的live server插件

### 安装

![image-2020112309057847](doc_images/image-20201123090527847.png)

### 作用

- 模拟真实环境（服务器环境）打开页面。
- 修改页面后，浏览器会自动刷新。

### 使用

安装后，**编辑器**打开**html文件**，点击右键菜单的 “**Open with Live Server**”，就会在浏览器预览页面了。

使用 Live Server 插件打开HTML之后，浏览器地址栏一般都会显示 `127.0.0.1:5500/xxx.html`

### 必须使用live server的硬性条件

1. 大事件中，有一个**图片剪裁插件**，必须使用live server的方式打开页面

2. 项目使用了iframe标签，并且涉及到调用父页面的函数，必须使用live server的方式打开页面

### 易错点和注意事项

1. 该插件的快捷键不是 Alt + B，不要按照之前的思维打开你的页面，需要慢慢适应。

2. 如果你的live server不能用，安装 preview on web server 插件也可以，安装之后，**编辑器**打开**html文件**，点击右键菜单的 “**vscode-preview-server：Launch on browser**”，就会在浏览器预览页面了。

## 搭建项目目录

- 创建 `bigevent` 文件夹，它就是我们的项目文件夹
- 把 `资料` 里面的 `assets` 和 `home` 复制到 `bigevent` 里面
- vscode打开 bigevent 文件夹

```
|- home
	|- dashboard.html      ---    后台首页图表页面
|- assets
	|- js                  ---    空文件夹，里面准备存放自己写的js文件
	|- css                 ---    空文件夹，里面准备存放自己写的css文件
	|- images              ---    存放的页面布局所需的图片
	|- lib                 ---    存放第三方工具
		|- jquery.js
		|- template-web.js
		|- layui
		|- tinymce         ---    富文本编辑器插件，添加文章时使用
		|- cropper         ---    图片剪裁插件（更换头像、添加文章使用）
```



## 使用Git管理项目

- 初始化   `git init`
- 添加基础的代码 到 暂存区 `git add .`
- 提交代码到本地仓库  `git commit -m '提交了基础的代码'`
- 创建远程仓库（自愿创建码云或github仓库）
- 添加远程仓库地址 `git remote add 别名 地址`
- 首次推送 `git push -u 别名 master`

具体操作：

```bash
# 项目即推送到码云、也推送到github

# 初始化
git init

# 添加初始文件到暂存区（windows可能看的一堆警告，没有问题，正常）
git add .

# 提交文件到本地仓库
git commit -m '提交了初始的文件'

# 创建远程仓库

# 添加两个远程仓库的 ssh地址
git remote add o1 git@gitee.com:laotang1234/bigevent-123.git
git remote add o2 git@github.com:Laotang1234/bigevent-123.git

# 推送到码云
git push -u o1 master

# 推送到github
git push -u o2 master
```

> 后续，新增了什么功能，及时的让Git记录。

## 创建项目通用的JS文件

项目的Ajax请求根路径 为 http://www.itcbc.com:8080 。所以，可以创建 *assets/js/common.js* 。在该js文件中 使用jQuery提供的 `$.ajaxPrefilter()` 方法统一配置大事件项目的接口根路径、headers和complete。

***/assets/js/common.js***

```js
// 全局变量 baseUrl，以便后续多次使用
let baseUrl = 'http://www.itcbc.com:8080';

$.ajaxPrefilter(function (option) {
    // option 就是ajax选项；我们可以修改它，也可以增加一些选项
    // 1. 统一配置url
    option.url = baseUrl + option.url;

    // 2. 统一配置请求头
    option.headers = {
        Authorization: localStorage.getItem('token')
    };
    
    // 3. 请求完成后，如果接口返回“身份认证失败”，则需要跳转到登录页面
    option.complete = function (xhr) {
        var res = xhr.responseJSON;
        if (res && res.status === 1 && res.message === '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = './login.html';
        }
    }
});
```

> 配置好之后，各个页面，在调用接口之前，只需要提前加载好common.js即可

## 登录和注册页面处理

### 准备工作

在 `bigevent` 根目录中

- 创建 login.html （登录注册页面）
- 创建 /assets/css/login.css
- 创建 /assets/js/login.js
- 加载所需的css和js文件

***login.html***

```html
<title>Document</title>
<!-- 无论是css还是js，都需要先加载别人的css和js，最后加载自己的css和自己的js -->

<!-- 加载css文件 -->
<link rel="stylesheet" href="./assets/lib/layui/css/layui.css">
<link rel="stylesheet" href="./assets/css/login.css">


<!-- body区，加载js文件 -->
<script src="./assets/lib/jquery.js"></script>
<script src="./assets/lib/layui/layui.all.js"></script>
<script src="./assets/js/common.js"></script>
<script src="./assets/js/login.js"></script>
```

### 页面布局

***login.html***

```html
<body>

    <!-- logo图片 -->
    <img id="logo" src="./assets/images/logo.png" alt="">


    <!-- 登录的盒子 start -->
    <div class="box login">
        <div class="title">大事件后台管理系统</div>
        <!-- 登录的表单 start -->
        <form class="layui-form" action="">
            <!-- 第一项：用户名 -->
            <div class="layui-form-item">
                <i class="layui-icon layui-icon-username"></i>
                <input type="text" name="title" required lay-verify="required" placeholder="请输入用户名" autocomplete="off"
                    class="layui-input">
            </div>
            <!-- 第二项：密码 -->
            <div class="layui-form-item">
                <i class="layui-icon layui-icon-password"></i>
                <input type="text" name="title" required lay-verify="required" placeholder="请输入密码" autocomplete="off"
                    class="layui-input">
            </div>
            <!-- 第三项：按钮 -->
            <div class="layui-form-item">
                <button class="layui-btn layui-btn-fluid layui-bg-blue" lay-submit lay-filter="formDemo">登录</button>
            </div>
            <!-- 第四项：超链接 -->
            <div class="layui-form-item">
                <a href="javascript:;">去注册账号</a>
            </div>
        </form>
        <!-- 登录的表单 end -->
    </div>
    <!-- 登录的盒子 end -->


    <!-- 注册的盒子 start -->
    <div class="box register">
        <div class="title">大事件后台管理系统</div>
        <!-- 注册的表单 start -->
        <form class="layui-form" action="">
            <!-- 第一项：用户名 -->
            <div class="layui-form-item">
                <i class="layui-icon layui-icon-username"></i>
                <input type="text" name="title" required lay-verify="required" placeholder="请输入用户名" autocomplete="off"
                    class="layui-input">
            </div>
            <!-- 第二项：密码 -->
            <div class="layui-form-item">
                <i class="layui-icon layui-icon-password"></i>
                <input type="text" name="title" required lay-verify="required" placeholder="请输入密码" autocomplete="off"
                    class="layui-input">
            </div>
            <!-- 第三项：确认密码 -->
            <div class="layui-form-item">
                <i class="layui-icon layui-icon-password"></i>
                <input type="text" name="title" required lay-verify="required" placeholder="请输入确认密码" autocomplete="off"
                    class="layui-input">
            </div>
            <!-- 第四项：按钮 -->
            <div class="layui-form-item">
                <button class="layui-btn layui-btn-fluid layui-bg-blue" lay-submit lay-filter="formDemo">注册</button>
            </div>
            <!-- 第五项：超链接 -->
            <div class="layui-form-item">
                <a href="javascript:;">去登录</a>
            </div>
        </form>
        <!-- 注册的表单 end -->
    </div>
    <!-- 注册的盒子 end -->


    <script src="./assets/lib/layui/layui.all.js"></script>
    <script src="./assets/lib/jquery.js"></script>
    <script src="./assets/js/common.js"></script>
    <script src="./assets/js/login.js"></script>
</body>
```

CSS代码：

```css
html, body {
    height: 100%;
}

body {
    background-color: #5ea0f1;
}

#logo {
    margin: 20px 0 0 240px;
}

/* 登录和注册盒子 */
.box {
    height: 310px;
    width: 400px;
    background-color: #f5da78;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 5px 5px 5px 5px;
}

.title {
    height: 60px;
    line-height: 60px;
    text-align: center;
    font-size: 26px;
}

/* 表单 */
form {
    margin: 0 30px;
}

form a {
    float: right;
}

/* 字体图标 */
.layui-form-item {
    position: relative;
}

.layui-icon {
    position: absolute;
    left: 6px;
    top: 11px;
}

.layui-input {
    padding-left: 24px;
}

/* 默认，让注册的盒子隐藏 */
.register {
    display: none;
}
```



### 切换登录和注册的盒子

```js
// --------------------- 切换登录和注册的盒子 --------------------
$('.login a').click(function () {
    $('.register').show().prev().hide();
});

$('.register a').click(function () {
    $('.login').show().next().hide();
});
```

## 注册功能

### 完成注册功能

- 注意serialize() 是根据表单项的name属性值获取值的
- 一定要检查表单项的name属性，是否和接口要求的请求参数一致

```js
// ----------------------   注册功能  ----------------------
// 表单提交 -> 阻止默认行为 -> 收集表单数据（查询字符串） -> ajax提交
$('.register form').on('submit', function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    // console.log(data);
    $.ajax({
        type: 'POST',
        url: '/api/reguser',
        data: data,
        success: function (res) {
            // 提示
            layer.msg(res.message);
            if (res.status === 0) {
                // 清空输入框。找到表单，转成DOM对象，调用DOM方法reset，来重置表单
                $('.register form')[0].reset();
                // 切换到登录的盒子
                $('.login').show().next().hide();
            }
        }
    })
});
```

如果注册的用户名重复了，但是没有提示。因为如果用户名重复，服务器返回的状态码是500，$.ajax里面的success函数就不会执行了。

所以要加一个 error（请求出错时执行） 或者 complete（请求完成后执行），用于错误提示。

有因为，我们已经在common.js 里面写了 complete 的了，所以只需加一个判断条件即可。

***common.js***

```js
option.complete = function (xhr) {
    var res = xhr.responseJSON;
    if (res && res.status === 1 && res.message === '身份认证失败！') {
        // 清除掉过期的token
        localStorage.removeItem('token');
        // 跳转到登录页
        location.href = './login.html';
    }
    // -------------------  其他错误  -----------------------
    if (res && res.status === 1) {
        layer.msg(res.message);
    }
}
```



## 表单验证

### 内置验证规则使用方法

**layui -> 文档 -> 左侧边栏（内置模块） --> 表单 --> 右（目录）--> 表单验证。**

layui提供了表单验证规则。使用方法：

```html
<input type="text" lay-verify="验证规则|验证规则|验证规则" />
```

layui提供了几个内置的验证规则：

- required（必填项）
- phone（手机号）
- email（邮箱）
- url（网址）
- number（数字）
- date（日期）
- identity（身份证）

比如，一个输入框必填、必填保证邮箱格式，代码如下：

```html
<input type="text" lay-verify="required|email" />
```

### 自定义验证规则

layui支持自定义验证规则。

```js
// ----------------------   自定义表单验证  ----------------------
// 必须使用 layui 的内置模块 - form 模块
// 只要使用layui的模块，必须加载模块
var form = layui.form;  // 加载form模块
// var laypage = layui.laypage; // =加载laypage分页模块
// var tree = layui.tree; // 加载树形组件模块

// 调用 form 模块内置方法verify，自定义验证规则
form.verify({
    // 键(验证规则): 值(验证方法)
    
    // 比如验证用户名长度2~10位，只能是数字字母组合
    // user: [/正则表达式/, '验证不通过时的提示']
    user: [/^[a-zA-Z0-9]{2,10}$/, '用户名只能是数字字母，且2~10位'], // {2,10} 不是 {2, 10}

    len: [/^\S{6,12}$/, '密码6~12位且不能有空格'],

    same: function (val) {
        // 形参，表示使用该验证规则的输入框的值（谁用这个验证规则，val表示谁的值）
        // 案例中，重复密码使用了这个验证规则，所以形参val表示输入的重复密码
        if (val !== $('.pwd').val()) {
            // return '错误提示'
            return '两次密码不一致'
        }
    }
    
});
```

定义完验证规则之后，在HTML页面中，使用该验证规则即可，如下：

```html
用户名
<input type="text" lay-verify="required|user" />
密码框
<input type="password" lay-verify="required|len" />
重复密码框
<input type="password" lay-verify="required|len|same" />
```

### 细节问题

- 表单（form标签）必须有 layui-form 这个类。

- 按钮必须是submit类型的，如果按钮没有指定type，就是提交按钮，那么默认就是submit类型的

- 按钮必须有 lay-submit 属性，注意是属性，不是类。

- HTML中使用验证规则

    - 无论用的内置的验证规则，还是自定义的验证规则，用法都一样。
    - `<input lay-verify="验证规则|验证规则" />`
    - `<input lay-verify="required|email|len|same" />`

- 编写自定义验证规则，需加载 form 模块；（硬性要求：使用layui的模块，必须先加载）

    - `var 变量 = layui.模块名;`
    - `var form = layui.form;`  // 加载得到一个对象

    - 加载得到的 form 模块，是一个对象，该对象内置一个verify方法，我们调用它编写自定义验证规则。

## 登录功能

```js
// ----------------------   登录功能  ----------------------
// 表单提交 -> 阻止默认行为 -> 收集表单数据（查询字符串） -> ajax提交
$('.login form').on('submit', function (e) {
    e.preventDefault();
    var data = $(this).serialize();  // 必须检查name属性值
    $.ajax({
        type: 'POST',
        url: '/api/login',
        data: data,
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                // 登录成功，保存token
                localStorage.setItem('token', res.token);
                // 跳转到首页面 index.html
                location.href = './index.html';
            }
        }
    });
})
```

## layer弹出层

可以在[layui官网](https://www.layui.com/)查看弹出层模块的使用，也可以直接进入 [layer 独立版本](https://layer.layui.com/)演示网站。

我们在html中加载的是 `layui.all.js`，则可以直接使用layer模块，无需加载。

```js
layer.msg() // 方法的作用是在页面中提示一个消息，3秒后自动关闭这个消息框

// 示例如下：
layer.msg('xxxxx');

// 项目中可以使用如下代码：
layer.msg(res.message);
```

## token的原理

当我们登录成功之后，服务器返回了一个token字符串。

token是一个令牌，访问以 `/my` 开头的接口的时候，必须携带token，否则会提示身份认证失败。

所以，登录成功之后，获取到token，浏览器端（客户端）需要保存token，以便于后续请求使用。

![image-20201125143403162](doc_images/image-20201125143403162.png)

## 后台首页

### 页面布局

- 到layui官网，文档-->页面元素-->布局-->后台布局。
- 复制后台布局 **全部** 的代码，粘贴到你的 index.html 中。
- 修改layui.css 和 layui.all.js 的路径。
    - 去掉复制过来的全部JS相关代码
    - 更换成我们自己的 layui.all.js 即可。
- 至此，index.html 页面布局基本上就实现了。

### 头部处理

- 不对的换掉
- 不要的删除

### 侧边栏导航处理

- 自行调整成和线上效果一样的结构（调整顺序）
- 给“首页” 添加 `layui-this` 类，表示默认该项选中
- 去掉 文章管理 的 “`layui-nav-itemed`” 类，刷新后，该项为收缩状态
- 给 ul 添加 `lay-shrink="all"` **属性**，则会出现排他(手风琴)效果。

### 创建文件，加载css和js

上面能够修改的都已经修改完毕了，接下来需要的样式需要我们自己编写了，所以不得不创建自己的JS文件和CSS文件了。**记得加载他们，包括common.js。**

- 创建了 /assets/css/index.css
- 创建了 /assets/js/index.js

### 使用字体图标

```html
<a href=""><i class="layui-icon layui-icon-logout"></i>退出</a>

<a href=""><i class="layui-icon layui-icon-home"></i>首页</a>

<a class="" href="javascript:;"><i class="layui-icon layui-icon-form"></i>文章管理</a>

<a href="javascript:;"><i class="layui-icon layui-icon-username"></i>个人中心</a>

子菜单全部一致
<a href="javascript:;"><i class="layui-icon layui-icon-app"></i>列表一</a>
```

CSS样式：

```css
/* 所有菜单的调整 */
.layui-icon {
    margin: 0 5px;
    font-size: 16px;
}

/* 单独调整子菜单 */
.layui-icon-app {
    margin-left: 20px;
}
```



### 头像处理

- 头部的头像和侧边栏的头像一样

- 复制头部区域的 a 标签，放到侧边栏开始的位置，修改a标签为div

- 自定义类。并添加样式，完成最终的效果。

    ```html
    <!-- 侧边栏代码 -->
    <div class="userinfo" href="javascript:;">
        <img src="http://t.cn/RCzsdCq" class="layui-nav-img">
        个人中心
    </div>
    ```

    ```css
    /* 侧边栏的头像位置 div */
    div.userinfo {
        height: 60px;
        text-align: center;
        line-height: 60px;
    }
    ```

- 设置欢迎语

    ```html
    <div class="userinfo">
        <img src="http://t.cn/RCzsdCq" class="layui-nav-img">
        欢迎你<span class="username">老汤</span>
    </div>
    ```
    
- 设置文字头像

    因为新注册的账号没有图片类型的头像，所以取用户名的第一个字符当做头像。

    如果后续，用户更换了图片头像，那么就显示图片头像。

    ```html
    <!--    头部  --- 添加 span.text-avatar 标签    -->
    <a href="javascript:;">
        <span class="text-avatar">A</span>
        <img src="http://t.cn/RCzsdCq" class="layui-nav-img">
        个人中心
    </a>
    <!--    侧边栏 --- 添加 span.text-avatar 标签   -->
    <div class="userinfo">
        <span class="text-avatar">A</span>
        <img src="http://t.cn/RCzsdCq" class="layui-nav-img">
        欢迎你<span class="username">老汤</span>
    </div>
    ```

    ```css
    /* 字体头像 */
    .text-avatar {
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        font-size: 20px;
        color: #fff;
        background-color: #419488;
        display: inline-block;
        border-radius: 50%;
    }
    
    /* 默认隐藏两个头像 */
    .text-head, .layui-nav-img {
        display: none;
    }
    ```

### 首页获取用户信息并渲染

> 开发之前，记得把jQuery和自己的js先加载好

- 封装一个函数 `getUserInfo()`，完成ajax请求，获取用户信息并渲染
- `getUserInfo()` 函数要放到入口函数外部
    - 封装成函数，后续，其他页面会使用
- 发送请求的时候，必须在请求头中，携带token，已在 common.js 中配置
- 渲染
    - 设置欢迎语
        - 优先使用昵称，没有昵称则使用登录账号
    - 设置头像
        - 优先使用图片，没有图片，则使用名字的第一个字符
        - 设置字体头像的时候，不要用show()方法，要自己设置css样式

```js
function getUserInfo() {
    $.ajax({
        url: '/my/user/userinfo',
        success: function (res) {
            // console.log(res);
            if (res.status === 0) {
                // 1. 设置欢迎你，xxx(优先使用昵称)
                var name = res.data.nickname || res.data.username;
                $('.username').text(name);

                // 2. 设置头像（优先使用图片）
                if (res.data.user_pic) {
                    // 说明有图片
                    $('.layui-nav-img').attr('src', res.data.user_pic).show();
                    $('.text-avatar').hide();
                } else {
                    // 说明没有图片(截取名字的第一个字，转大写)
                    var first = name.substr(0, 1).toUpperCase();
                    // show方法作用是恢复元素默认的样式（span默认就是行内元素，show会把span设置为display:inline；div默认是块级元素，show会把div设置为display: block）
                    $('.text-avatar').text(first).css('display', 'inline-block');
                }
            }
        }
    });
}
getUserInfo();

```

### 退出功能

- 退出超链接
    - 加入 id="logout"
    - href="javascript:;"    这点一定要注意，必填
- 点击退出
    - 询问
    - 删除token
    - 跳转到 login.html

```js
// --------------  退出功能 ---------------------
// 退出的时候，两个操作
// - 删除token
// - 页面跳转到登录页面
$('#logout').click(function () {
    // 弹出层，询问是否要退出
    layer.confirm('你确定退出吗？', function (index) {
        //do something
        // 如果点击了确定，删除token，页面跳转
        localStorage.removeItem('token');
        location.href = './login.html';
        layer.close(index); // 关闭当前弹出层
    });
});
```

## 回顾身份认证

### JWT身份认证原理

![image-20210116100150635](doc_images/image-20210116100150635.png)

### 具体到前端，该如何认证

![image-20210116095913686](doc_images/image-20210116095913686.png)

小结：具体到前端，我们应该做：

1. 登录成功后，要在本地存储中保存token
2. 发送Ajax请求的时候，必须在请求头携带 `Authorization: token字符串`
3. index.html 开头，加入判断，判断本地存储中是否有token
4. 根据服务器返回的结果，判断token的真假。

## 其他页面处理

### 文件存放思路

如果继续把html文件存放到项目根目录，那么根目录的文件会越来越多，会越来越乱，所以建议单独存放个人中心相关的几个页面。老师的做法如下（仅供参考）

- html 放到根目录下的user文件夹，比如 更新用户信息页面 user/userinfo.html

- css，也要放到 user/css 文件夹 ，比如 更新用户信息的css，user/css/userinfo.css

- js，也要放到 user/js/ 这里，比如 更新用户信息的js，user/js/userinfo.js

    

### 首页内容区说明

使用iframe标签

- iframe标签是HTML标签
- iframe在整个页面（父页面）中，占用一个区域，这个区域可以引入其他（子）页面
- src属性用于引入默认的子页面
- 侧边栏的 a 标签，href属性正常挂链接
- 侧边栏的 a 标签，target属性，表示打开新页面的位置；
- 通过指定 `target=“iframe标签的name值”` ，可以在iframe区域打开链接的页面

![image-2020071312071501](doc_images/image-20200713120721501.png)



## 基本资料

### 准备工作

- 创建HTML文件、css文件、js文件
    - 创建 /user/userinfo.html
    - 创建 /user/css/userinfo.css
    - 创建 /user/js/userinfo.js
- index.html 头部和侧边栏，挂超链接，链接到 ./user/userinfo.html，注意target="fm"

### 页面布局

略（因为是复制过来的）

只需要修改一下页面中的文字、修改一下类名、name属性值等等

- 修改了input的name属性值（分别是username、nickname、email）
- 设置登录账号这个input disable属性，因为修改的时候，不允许修改登录账号
- 给邮箱加一个email验证规则

### 为表单赋值(数据回填)

思路：

- 发送ajax请求，获取用户信息
- 设置表单各项（每个输入框）的value值。

具体步骤：

- 需要在 form 中，添加一个隐藏域，用于保存id值，前面已经添加过了

    ```html
    <input type="hidden" name="id" />
    <!-- 隐藏域，只要放到 form 里面即可 -->
    ```

- 先设置表单各项的 name 属性（username/nickname/email/id）

- 发送ajax请求，获取用户信息

- 使用layui的from模块快速为表单赋值

    - 为表单（form标签）设置 `lay-filter="user"` ，值随便定义，我这里使用的是 user
    - JS代码中，一行代码为表单赋值

    ```js
    let form = layui.form;
    form.val('user', res.data);
    ```

    - `要求，res.data 这个对象的属性（key）要和表单各项的name属性值相同，才能赋值`

完整的代码：

```js
// 加载layui的form模块
var form = layui.form;

// ------------------ 完成数据回填 -------------------------
function renderUser () {
    $.ajax({
        url: '/my/user/userinfo',
        success: function (res) {
            // console.log(res)
            if (res.status === 0) {
                // 数据回填
                // $('input[name=username]').val(res.data.username);
                // $('input[name=nickname]').val(res.data.nickname);
                // $('input[name=email]').val(res.data.email);
                // $('input[name=id]').val(res.data.id);
                // 使用layui提供的数据回填方法
                // form.val('表单的lay-filter属性值', '对象形式的数据(对象的key要和表单各项的name属性值相同)');
                form.val('user', res.data);
            }
        }
    })
}
renderUser();
```



> 只要是修改操作：
>
> 1. 必须要进行数据回填操作，保证输入框是有值的
> 2. 修改的表单中，一般都有隐藏域 id

### 完成更新用户信息的功能

- 设置 登录账号为 `disabled` 
    - 不允许修改
    - 通过 $('form').serialize() 不能获取到 username 值，刚刚好是我们的需要。
- 注册表单的提交事件
- 阻止默认行为
- 收集表单数据，使用 $('form').serialize() 。（id、nickname、email）
- 发送ajax请求，完成更新
- 更新成功之后，提示，并且调用父页面的 `getUserInfo()` 从新渲染用户的头像

```js
// ------------------   表单提交的时候，完成用户信息的更新 -----------------
// 监听表单的提交事件。
$('form').on('submit', function (e) {

    // 阻止默认行为
    e.preventDefault();
    // 获取id、nickname、email的值
    var data = $(this).serialize();
    // console.log(data);
    // ajax提交给接口，从而完成更新
    $.ajax({
        type: 'POST',
        url: '/my/user/userinfo',
        data: data,
        success: function (res) {
            // 无论成功还是失败，都要提示
            layer.msg(res.message);
            if (res.status === 0) {
                window.parent.getUserInfo();
            }
        }
    });
});

```



### 重置表单

```js
// ---------------------  重置表单  -------------------------
$('button:contains("重置")').click(function (e) {
    e.preventDefault();
    renderUser(); // 调用renderUser()，为表单重新赋值，就可以恢复成原样
});
```



## 更新密码

### 准备工作

- 创建所需的HTML、js文件、css文件
    - 经过观察，所有小页面的布局都一样，所以这里可以使用 userinfo.css
- 首页侧边栏和头部区域挂好链接
    - href=“./user/repwd.html”
    - target="fm"    fm是iframe的name属性值
- 加载好所需的css和js文件

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="/assets/lib/layui/css/layui.css">
    <!-- 因为重置密码页面和基本资料页面样式一样 -->
    <link rel="stylesheet" href="/assets/css/userinfo.css">
</head>
<body>
    
    <!--
	1. html代码，去userinfo.html 中复制
	2. 修改文字
	3. 去掉第一个输入框的 disabled 属性
	4. 去掉 隐藏域id
	5. 修改原密码的name属性为 oldPwd；修改新密码的name为 newPwd；去掉重复密码的name属性
	-->
    
    <script src="/assets/lib/jquery.js"></script>
    <script src="/assets/lib/layui/layui.all.js"></script>
    <script src="/assets/js/common.js"></script>
    <script src="/assets/js/user/repwd.js"></script>
</body>
</html>
```



### 表单验证

```js
// -----------------------   表单验证   -----------------------
var form = layui.form;
// 1. 密码长度6~12位 （三个input都需要用）
// 2. 新密码和原密码不能一样 （新密码使用）
// 3. 两次新密码必须一致 （重复密码使用）

form.verify({
    // 1. 密码长度6~12位 （三个input都需要用）
    len: [/^\S{6,12}$/, '长度必须6~12位且不能出现空格'],

    // 2. 新密码和原密码不能一样 （新密码使用）
    diff: function (val) {
        if (val === $('input[name=oldPwd]').val()) {
            return '新密码不能和原密码一致'
        }
    },

    // 3. 两次新密码必须一致 （重复密码使用）
    same: function (val) {
        if (val !== $('input[name=newPwd]').val()) {
            return '两次新密码不一致';
        }
    }
});
```

- 三个密码框，都使用len这个验证规则
- 新密码，使用diff，这个验证规则
- 确认密码，使用 same 验证规则



### ajax请求，完成更新

```js
// ----------------------- 完成重置密码 -----------------------
$('form').on('submit', function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    $.ajax({
        type: 'POST',
        url: '/my/user/updatepwd',
        data: data,
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                // 修改成功后，清空token，跳转到登录页，重新登录
                localStorage.removeItem('token');
                // 让父页面跳转
                window.parent.location.href = '../login.html';
            }
        }
    })
})
```

## 更换头像

### 准备工作

- 创建文件

    - 创建 ./user/avatar.html 
    - 创建 ./user/css/avatar.css 
    - 创建 ./user/js/avatar.js

- index.html 中，侧边栏和头部区域挂好超链接

- avatar.html 中 引入所需的css和js文件

    ```html
    <link rel="stylesheet" href="../assets/lib/layui/css/layui.css">
    <!-- 加载剪裁插件的css -->
    <link rel="stylesheet" href="../assets/lib/cropper/cropper.css">
    <link rel="stylesheet" href="./css/avatar.css">
    
    
    
    <script src="../assets/lib/layui/layui.all.js"></script>
    <script src="../assets/lib/jquery.js"></script>
    <!-- 在jQuery之后，按照顺序加载剪裁插件 -->
    <script src="../assets/lib/cropper/Cropper.js"></script>
    <script src="../assets/lib/cropper/jquery-cropper.js"></script>
    
    <script src="../assets/js/common.js"></script>
    <script src="./js/avatar.js"></script>
    ```
    
    

### 复制HTML和CSS（完成布局）

- 首先，得有一个卡片面板布局（去layui复制）

    ```html
    <div class="layui-card">
      <div class="layui-card-header">卡片面板</div>
      <div class="layui-card-body">
        卡片式面板面板通常用于非白色背景色的主体内<br>
        从而映衬出边框投影
      </div>
    </div>
    ```

- 在卡片面板的 **内容区**，添加如下HTML结构。

    ```html
    <!-- 第一行的图片裁剪和预览区域 -->
      <div class="row1">
        <!-- 图片裁剪区域 -->
        <div class="cropper-box">
          <!-- 这个 img 标签很重要，将来会把它初始化为裁剪区域 -->
          <img id="image" src="../assets/images/sample.jpg" />
        </div>
        <!-- 图片的预览区域 -->
        <div class="preview-box">
          <div>
            <!-- 宽高为 100px 的预览区域 -->
            <div class="img-preview w100"></div>
            <p class="size">100 x 100</p>
          </div>
          <div>
            <!-- 宽高为 50px 的预览区域 -->
            <div class="img-preview w50"></div>
            <p class="size">50 x 50</p>
          </div>
        </div>
      </div>
    
      <!-- 第二行的按钮区域 -->
      <div class="row2">
        <button type="button" class="layui-btn">上传</button>
        <button type="button" class="layui-btn layui-btn-danger">确定</button>
      </div>
    ```

- 美化的样式

    ```css
    /* 设置卡片主体区域的宽度 */
    .layui-card-body {
      width: 500px;
    }
    
    /* 设置按钮行的样式 */
    .row2 {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
    }
    
    /* 设置裁剪区域的样式 */
    .cropper-box {
      width: 350px;
      height: 350px;
      background-color: cyan;
      overflow: hidden;
    }
    
    /* 设置第一个预览区域的样式 */
    .w100 {
      width: 100px;
      height: 100px;
      background-color: gray;
    }
    
    /* 设置第二个预览区域的样式 */
    .w50 {
      width: 50px;
      height: 50px;
      background-color: gray;
      margin-top: 50px;
    }
    
    /* 设置预览区域下方文本的样式 */
    .size {
      font-size: 12px;
      color: gray;
      text-align: center;
    }
    
    /* 设置图片行的样式 */
    .row1 {
      display: flex;
    }
    
    /* 设置 preview-box 区域的的样式 */
    .preview-box {
      display: flex;
      flex-direction: column;
      flex: 1;
      align-items: center;
    }
    
    /* 设置 img-preview 区域的样式 */
    .img-preview {
      overflow: hidden;
      border-radius: 50%;
    }
    ```

    

- 完成后的效果：

![image-2020060955256](doc_images/image-20200609151015256.png)



### 创建剪裁区(初始化剪裁区)

- 使用插件 cropper ，提供的方法，实现剪裁区的创建
- 具体做法：
    - 找到剪裁区的图片 （img#image）
    - 设置配置项
    - 调用cropper方法，创建剪裁区

```js
// ---------------  创建剪裁区 ------------------
// - 找到剪裁区的图片 （img#image）
var $image = $('#image');
// - 设置配置项
var option = {
    // 纵横比(宽高比)
    aspectRatio: 1, // 正方形
    // 指定预览区域
    preview: '.img-preview' // 指定预览区的类名（选择器）
};
// - 调用cropper方法，创建剪裁区
$image.cropper(option);

```





### 点击按钮，可选择图片

- html中加入一个隐藏的文件域
- 点击上传按钮的时候，触发文件域的单击事件

```html
<!-- 加一个隐藏的文件域 -->
<!-- multiple 控制文件是否可以多选 -->
<input type="file" id="file" style="display: none;">
<button type="button" class="layui-btn" id="chooseFile">选择头像</button>
<button type="button" class="layui-btn layui-btn-danger" id="sure">确认修改</button>

```

```js
// --------------- 2. 点击选择头像，能够实现选择图片 --------------------
$('#chooseFile').on('click', function () {
    $('#file').trigger('click');
})

```





### 更换图片，重置剪裁区

- 找到选择的文件（文件对象）
- 为文件对象创建一个临时的url
- 更换剪裁区的图片
    - 先销毁原来的剪裁区
    - 更改图片的src属性
    - 重新生成剪裁区

```js
// --------------- 3. 文件域内容改变了，能够更换剪裁区的图片 -------------
$('#file').on('change', function () {
    // console.log(12)
    if (this.files.length > 0) {
        // 3.1 找到文件对象
        // console.dir(this);
        var fileObj = this.files[0];
        // 3.2 为文件对象创建临时的url
        var url = URL.createObjectURL(fileObj);
        // console.log(url);
        // 3.3 更换剪裁区的图片(销毁剪裁框 --> 更换图片 --> 重新生成剪裁框)
        $image.cropper('destroy').attr('src', url).cropper(option);
    }
});

```



### 点击确定，实现剪裁并修改头像

- 调用 cropper 方法，传递 `getCroppedCanvas` 参数，得到一个canvas图片（对象）
- 调用canvas的toDataURL()方法，得到base64格式的图片
- ajax提交即可

```js
// --------------- 4. 点击确认修改按钮，实现更换头像 ------------------
$('#sure').on('click', function () {
    // 1. 剪裁图片，得到canvas
    var canvas = $image.cropper('getCroppedCanvas', {width: 30, height: 30});
    // 2. 把canvas转成base64格式字符串
    var base64 = canvas.toDataURL();
    // console.log(base64)
    // 3. ajax提交即可
    $.ajax({
        type: 'POST',
        url: '/my/user/avatar',
        data: { avatar: base64 }, // { id: 1 }
        success: function (res) {
            layer.msg(res.message);
            if (res.status === 0) {
                // 更新index.html的头像
                window.parent.getUserInfo();
            }
        }
    })
})
```

### 关于base64格式的图片说明

- base64格式只是图片的一种格式，用字符串表示图片的格式
- base64格式的优点：减少http请求，加快小图片的响应速度，减轻服务器的压力
- base64格式的缺点：体积比正常图片大 30% 左右。
- 如果是小图片，可以使用base64格式，大图片不建议使用了。

> https://www.css-js.com/tools/base64.html

## 文章列表页布局

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文章列表页</title>
    <link rel="stylesheet" href="../assets/lib/layui/css/layui.css">
    <link rel="stylesheet" href="./css/list.css">
</head>

<body>


    <div class="layui-card">
        <div class="layui-card-header">文章列表</div>
        <div class="layui-card-body">
            <!-- 内容区一 表单搜索区 start -->
            <form class="layui-form" action="">
                <div class="layui-form-item">

                    <div class="layui-inline">
                        <div class="layui-input-inline" style="width: 200px;">
                            <select name="city" lay-verify="">
                                <option value="">请选择一个城市</option>
                                <option value="010">北京</option>
                                <option value="021">上海</option>
                                <option value="0571">杭州</option>
                            </select>
                        </div>

                        <div class="layui-input-inline" style="width: 200px;">
                            <select name="city" lay-verify="">
                                <option value="">请选择一个城市</option>
                                <option value="010">北京</option>
                                <option value="021">上海</option>
                                <option value="0571">杭州</option>
                            </select>
                        </div>
                    </div>

                    <div class="layui-inline">
                        <div class="layui-input-inline" style="width: 100px;">
                            <button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button>
                        </div>
                    </div>

                </div>
            </form>
            <!-- 内容区一 表单搜索区 end -->

            <!-- 内容区二 表格区 start -->
            <table class="layui-table">
                <colgroup>
                    <col width="40%">
                    <col width="15%">
                    <col width="15%">
                    <col width="15%">
                    <col>
                </colgroup>
                <thead>
                    <tr>
                        <th>文章标题</th>
                        <th>分类</th>
                        <th>发布时间</th>
                        <th>状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>静夜思</td>
                        <td>艺术</td>
                        <td>2021-01-13 12:39:08</td>
                        <td>已发布</td>
                        <td>
                            <button type="button" class="layui-btn layui-btn-xs">编辑</button>
                            <button type="button" class="layui-btn layui-btn-xs layui-btn-danger">删除</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- 内容区二 表格区 end -->

            <!-- 内容区三 分页区 start -->
            <div id="page"></div>
            <!-- 内容区三 分页区 end -->
        </div>
    </div>


    <script src="../assets/lib/layui/layui.all.js"></script>
    <script src="../assets/lib/jquery.js"></script>
    <script src="../assets/lib/template-web.js"></script>
    <script src="../assets/js/common.js"></script>
    <script src="./js/list.js"></script>
</body>

</html>
```

CSS:

```css
body {
    background-color: #f2f3f5;
    padding: 15px;
}
```



## 添加文章页面布局

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>添加文章页面</title>
    <link rel="stylesheet" href="../assets/lib/layui/css/layui.css">
    <link rel="stylesheet" href="../assets/lib/cropper/cropper.css">
    <link rel="stylesheet" href="./css/add.css">
</head>

<body>

    <div class="layui-card">
        <div class="layui-card-header">发布文章</div>
        <div class="layui-card-body">
            <form class="layui-form" action="">
                <!-- 第一项：标题 -->
                <div class="layui-form-item">
                    <label class="layui-form-label">输入框</label>
                    <div class="layui-input-block">
                        <input type="text" name="title" required lay-verify="required" placeholder="请输入标题"
                            autocomplete="off" class="layui-input">
                    </div>
                </div>
                <!-- 第二项：选择分类 -->
                <div class="layui-form-item">
                    <label class="layui-form-label">选择框</label>
                    <div class="layui-input-block">
                        <select name="city" lay-verify="required">
                            <option value=""></option>
                            <option value="0">北京</option>
                            <option value="1">上海</option>
                            <option value="2">广州</option>
                            <option value="3">深圳</option>
                            <option value="4">杭州</option>
                        </select>
                    </div>
                </div>
                <!-- 第三项：文章内容 -->
                <div class="layui-form-item layui-form-text">
                    <label class="layui-form-label">文本域</label>
                    <div class="layui-input-block">
                        <textarea name="desc" placeholder="请输入内容" class="layui-textarea"></textarea>
                    </div>
                </div>
                <!-- 第四项：封面图片 -->
                <div class="layui-form-item">
                    <!-- 左侧的 label -->
                    <label class="layui-form-label">文章封面</label>
                    <!-- 选择封面区域 -->
                    <div class="layui-input-block cover-box">
                        <!-- 左侧裁剪区域 -->
                        <div class="cover-left">
                            <img id="image" src="/assets/images/sample2.jpg" alt="" />
                        </div>
                        <!-- 右侧预览区域和选择封面区域 -->
                        <div class="cover-right">
                            <!-- 预览的区域 -->
                            <div class="img-preview"></div>
                            <!-- 选择封面按钮 -->
                            <button type="button" class="layui-btn layui-btn-danger">选择封面</button>
                        </div>
                    </div>
                </div>
                <!-- 第五项：选择状态 -->
                <div class="layui-form-item">
                    <label class="layui-form-label">单选框</label>
                    <div class="layui-input-block">
                        <input type="radio" name="sex" value="男" title="男">
                        <input type="radio" name="sex" value="女" title="女" checked>
                    </div>
                </div>
                <!-- 第六项：按钮 -->
                <div class="layui-form-item">
                    <div class="layui-input-block">
                        <button class="layui-btn" lay-submit lay-filter="formDemo">立即提交</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <script src="../assets/lib/layui/layui.all.js"></script>
    <script src="../assets/lib/jquery.js"></script>
    <script src="../assets/lib/template-web.js"></script>
    <!-- 加载富文本编辑器插件，按照顺序加载 -->
    <script src="../assets/lib/tinymce/tinymce.min.js"></script>
    <script src="../assets/lib/tinymce/tinymce_setup.js"></script>
    <!-- 按照顺序，加载剪裁插件的js -->
    <script src="../assets/lib/cropper/Cropper.js"></script>
    <script src="../assets/lib/cropper/jquery-cropper.js"></script>
    
    <script src="../assets/js/common.js"></script>
    <script src="./js/add.js"></script>
</body>
</html>
```

CSS:

```css
body {
    background-color: #f2f3f5;
    padding: 15px;
}

/* 封面容器的样式 */
.cover-box {
    display: flex;
  }
  
  /* 左侧裁剪区域的样式 */
  .cover-left {
    width: 400px;
    height: 280px;
    overflow: hidden;
    margin-right: 20px;
  }
  
  /* 右侧盒子的样式 */
  .cover-right {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  /* 预览区域的样式 */
  .img-preview {
    width: 200px;
    height: 140px;
    background-color: #ccc;
    margin-bottom: 20px;
    overflow: hidden;
  }
```

JS:

```js
initEditor(); // 调用函数，就会把 textarea 替换为富文本编辑器

// 1. 初始化剪裁框
// 1. 初始化图片裁剪器
var $image = $('#image')

// 2. 裁剪选项
var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
}

// 3. 初始化裁剪区域
$image.cropper(options)
```



