$(function() {
    queryTopCate();

    /**
     * 获取一级分类数据
     */

    function queryTopCate() {
        $.ajax({
            url: "/category/queryTopCategory",
            success: function(result) {
                //渲染数据
                // console.log(result);
                //获取里面的数据
                var rows = result.rows;
                var strArr = []; //定义一个数组 存在里面 一次性渲染出来
                for (var i = 0; i < rows.length; i++) {
                    strArr.push('<li data-id=' + rows[i].id + '><a hred="#">' + rows[i].categoryName + '</a></li>')
                }

                //把数组 变成字符串  真空拼接
                $(".lt_menu>ul").html(strArr.join(''));
                querySecondCategory(rows[0].id);
            }
        })
    }

    /* 二级分类 */
    function querySecondCategory(id) {
        $.ajax({
            url: "/category/querySecondCategory?id=" + id,
            success: function(result) {
                /* console.log(result); */
                var rows = result.rows;
                if (rows.length > 0) {
                    var strArr = [];
                    for (var i = 0; i < rows.length; i++) {
                        strArr.push('<li><a href="javascript:;"><img src="' + rows[i].brandLogo + '" alt=""><p>' + rows[i].brandName + '</p></a></li>');
                    }
                    $(".lt_content>ul").html(strArr.join(''));
                } else {
                    $('.lt_content>ul').html("没有数据了");
                }
            }
        })
    }

    /* 注意li标签是动态生成的 */
    $(".lt_menu").on("tap", "li", function() {
        var id = $(this).data("id");
        querySecondCategory(id);
    })
})