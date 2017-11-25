$(function() {

    //设置成对象发送到后台  全局参数查询对象 配置对象
    var queryObj = {
        proName: "",
        brandld: "",
        price: "",
        num: "",
        page: 1,
        pageSize: 6
    }; //给默认初始值  第一页 显示六个数据
    queryObj.proName = getURLParams("key"); //获取url问号后面的参数
    /* console.log(queryObj.proName); */

    //数据总条数 给个默认值
    var Count = 1;
    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: { //下拉
                height: 50, //可选,默认50.触发下拉刷新拖动距离,
                auto: true, //可选,默认false.首次加载自动下拉刷新一次
                contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function() { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；

                    setTimeout(function() {
                        queryObj.page = 1; //下拉的时候 要重置为1 不然数据会一种添加
                        queryProduct(function(result) {
                            Count = result.count;
                            var html = template("prolistTpl", result);
                            $(".lt_product_list").html(html);
                            // 结束下拉刷新
                            mui('#refreshContainer').pullRefresh().endPulldownToRefresh(false);
                            // 重置上拉控件的用户提示
                            mui('#refreshContainer').pullRefresh().refresh(true);
                        });
                    }, 1000)
                }
            },

            up: { //上拉
                height: 50, //可选.默认50.触发上拉加载拖动距离
                auto: true, //可选,默认false.自动上拉加载一次
                contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: function() {
                    /**
                     * 一共多少页
                     */
                    var totalPage = Math.ceil(Count / queryObj.pageSize);
                    // console.log(totalPage);
                    //判断 如果当前的数据条数<获取总条数 就添加显示
                    setTimeout(function() {
                        if (queryObj.page < totalPage) {
                            /*  console.log(queryObj.page); */
                            //继续请求数据
                            queryObj.page++;
                            queryProduct(function(result) {
                                console.log(result)
                                var html = template("prolistTpl", result);
                                $(".lt_product_list").append(html);
                                //有数据就传入 false  没有则其他显示
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                            })
                        } else {
                            // 没有数据就传入 true  给出用户提示 没有数据了
                            mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                        }
                    }, 1000);
                }
            }
        }
    });

    /**
     * 1 初始化数据
     *  a 获取url的参数  ？key=1 -> 1
     *  b 拼接url
     *  c 获取数据 渲染数据
     * 
     * 2 上拉加载下一页
     *  一共多少页
     *  总条数 和外面自己定的页容器有关
     */

    //发送请求
    function queryProduct(callback) { // callback 把函数当作参数传递进来
        $.ajax({
            type: "get",
            url: "/product/queryProduct",
            data: queryObj,
            success: function(result) {
                callback && callback(result);
            }
        })
    }

    // 获取url上的参数的 
    function getURLParams(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    //点击搜索
    $(".lt_button").on("tap", function() {
        /* alert(); */
        var val = $(".lt_text").val();

        if (!$.trim(val)) {
            //用户提示 请输入关键字
            mui.toast("请输入关键字");
        } else {
            queryObj.proName = val; //通过关键字发送数据给后台 来获取数据
            //手动触发下拉 先当于自动触发下拉
            mui("#refreshContainer").pullRefresh().pulldownLoading();
        }
    })

    //点击排序
    $(".lt_ul>li").on("tap", function() {
        /*   alert(); */
        $(this).addClass("active").siblings().removeClass("active");

        //改变箭头  find后代选择器
        $(this).find(".mui-icon").toggleClass("mui-icon-arrowdown mui-icon-arrowup");

        //排序
        var sort = -1;
        //判断如果 箭头 上up升序价格从高到低   down 下 降序 价格从低到高
        //hasclass 判断是否有这个类mui-icon-arrowup  有就是升序 没有就是降序
        if ($(this).find(".mui-icon").hasClass("mui-icon-arrowup")) {
            //升序
            sort = 1;

        } else {
            //降序
            sort = 2;
        }

        //获取要排序的关键字
        //获取通过属性 获取属性值
        /*  console.log($(this).find("span").eq(0).data("sortname")); */
        if ($(this).find("span").eq(0).data("sortname") == "price") { //点击价格的时候 销量清空
            // alert();
            queryObj.price = sort;
            queryObj.num = "";
        }
        if ($(this).find("span").eq(0).data("sortname") == "num") { //点击销量的时候 价格清空
            queryObj.num = sort;
            queryObj.price = "";
        }
        // 手动触发下拉 
        mui("#refreshContainer").pullRefresh().pulldownLoading();
    })
})