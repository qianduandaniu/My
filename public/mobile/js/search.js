$(function() {
    /* 
    1 从本地读取localstorage  key：LT_his  value:[]
    2 先获取
    */
    loadHistory()

    function loadHistory() {
        //先把内容存进localStorage setItem()存 
        //console.log(localStorage); localStorage是window下面的一个对象
        var ls = localStorage;

        //有数据就获取数据  没有就获取空数据
        //&& 短路运算 找假  只要有一个是假的就返回第二个
        //|| 短路运算  找真 找前面是假的就直接返回第二个 不管第二个是真是假
        //这里前面都是假的因为LT_his没有定义 所以返回的是空数组  
        //parse 解析  是个字符串就解析成字符串 是个数组就解析成数组
        var arr = (ls.getItem("LT_his") && JSON.parse(ls.getItem("LT_his"))) || [];
        //判断有没有数据
        if (arr.length < 1) {
            $(".lt_input").html("");
            return;
        }
        //把数组加载出来
        /*  <div class="lt_container mui-clearfix">
                <span>123</span>
                <span class="item_close mui-icon mui-icon-closeempty"></span>
            </div> */
        var strArr = []; //存在里面然后在一次性渲染出来
        for (var index = 0; index < arr.length; index++) {
            strArr.push('<div class="lt_container mui-clearfix"> <span>' + arr[index] + '</span> <span class="item_close mui-icon mui-icon-closeempty"></span> </div>')
        }
        //渲染列表数据
        $(".lt_input").html(strArr.join('')); //解析成json格式字符串
    }

    //点击搜索按钮
    /**
     * 1 获取val
     * 2 判断是否为空
     * 3 存到localstorage
     * 4 先获取存到localstorage -> 数组
     * 5 数组.push(val) 去重样
     * 6 再把数组(转为json) 存到 localstorage
     */
    $(".lt_button").on("tap", function() {
        /*  console.log(134) */
        var val = $(".lt_text").val(); //获取输入的内容 val值
        //去掉空格
        if (!$.trim(val)) {
            return false;
        }
        //先获取本来存储的数组 
        var ls = localStorage;
        var arr = (ls.getItem("LT_his") && JSON.parse(ls.getItem("LT_his"))) || [];
        /*  console.log(arr); */
        //要做去重样的处理
        for (var i = 0; i < arr.length; i++) {
            //删除旧的  添加新的到最开头
            //(要删除的值的索引，要删除几个)
            if (arr[i] == val) {
                arr.splice(i, 1);
            }
        }

        //unshift 往数组的头部添加数据
        //push 往数组的尾部添加数据
        arr.unshift(val);
        /*  arr.push(val); */
        console.log(arr);
        /*  console.log(arr); */
        ls.setItem("LT_his", JSON.stringify(arr)); //转成字符串 存进去
        //加载localstorage的数据
        $(".lt_text").val(""); //  清空input里面输入的内容

        /*  loadHistory(); */
        //跳转页面
        location.href = "searchList.html?key=" + val;
    })

    //清空按钮
    $('.lt_empty').on("tap", function() {
        localStorage.setItem("LT_his", JSON.stringify([])); //把空数组存进去
        loadHistory();
    })

    //事件委托  因为动态生成的数据要单个删除 所以给事件委托到父盒子
    $("body").on("tap", ".item_close", function() {
        /*  console.log(12); */

        //获取父元素的索引
        var index = $(this).parent().index();
        /* console.log(index); */
        var ls = localStorage;
        var arr = (ls.getItem("LT_his") && JSON.parse(ls.getItem("LT_his"))) || [];
        //删除数组中的元素
        arr.splice(index, 1);
        //存储
        ls.setItem("LI_his", JSON.stringify(arr));

        //重新渲染
        loadHistory();
    })

})