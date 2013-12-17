var resizing = false; //是否为拖动状态  
var resizable = false; //当时是否可拖动  
var minWidth = 20;  //没列的最小宽度  
var resizeHeader;   //当前拖动的列  
var leftLine;       //左参考线  
var rightLine;      //有参考线  
/**  
 * 计算当前鼠标位置是不是在可拖动的范围内  
 * @param event e目标事件  
 * @side boolean true表示在左边边框附近，false表示右边  
 * @return boolean true在表格边框附近，false未在  
 */  
function _fnIsColEdge(e, side){  
    var target = $(e.target);  
    var x = e.pageX;  
    var offset = target.offset();  
    var left = offset.left;  
    var right = left + target.outerWidth();  
    return side ? x<=left+2 : x >=right-2;  
}  
/**  
 * 计算当前鼠标位置是不是在左边框附近  
 * @param event e目标事件  
 * @return boolean true是， false否  
 */  
function fnIsLeftEdge(e){  
    return _fnIsColEdge(e, true);  
}  
/**  
 * 计算当前鼠标位置是不是在右边框附近  
 * @param event e目标事件  
 * @return boolean true是， false否  
 */  
function fnIsRightEdge(e){  
    return _fnIsColEdge(e, false);  
}  
/**  
 * 初始化拖动状态  
 * @param event e目标事件  
 * @return void  
 */  
function onDragingStart(e){  
    //当前是否为拖动状态  
    if(resizable){  
        var target = $(e.target);  
//        //设置当前文本不可选中，否则拖动时会选中文本  
//        if(!$.browser.mozilla){  
//            $(document).bind("selectstart", function(){ return false; });  
//        }else{  
//            $("body").css("-moz-user-select", "none");  
//        }  
        $(document).bind("selectstart", function(){ return false; });
        $("body").css("-moz-user-select", "none");
        //创建参考线  
        if(!leftLine){  
            leftLine = $("<div></div>");  
            leftLine.addClass("resize_line");  
            leftLine.appendTo("body");  
            rightLine = leftLine.clone();  
            rightLine.appendTo("body");  
        }  
        //显示参考线  
        leftLine.css({"top":resizeHeader.offset().top, "left": resizeHeader.offset().left, "height": $("table").innerHeight()});  
        rightLine.css({"top":resizeHeader.offset().top, "left": e.pageX, "css":"col-resize", "height": $("table").innerHeight()});  
        leftLine.show();  
        rightLine.show();  
        //设置为已经在拖动  
        resizing = true;  
    }  
}  
/**  
 * 列宽拖动中  
 * @param event e目标事件  
 * @return void  
 */  
function onDraging(e){  
    //如果已经在拖动  
    if(resizing){  
        //拖动后的列宽不能小于最小列宽  
        if(e.pageX - resizeHeader.offset().left > minWidth){  
            rightLine.css("left", e.pageX);  
        }  
    }  
}  
/**  
 * 鼠标释放拖动结束，改变列宽，结束拖动状态  
 * @param event e目标事件  
 * @return void  
 */  
function onDragingEnd(e){  
    //如果已经在拖动  
    if(resizing){  
        resizing = false;  
        //隐藏参考线  
        rightLine.hide();  
        leftLine.hide();  
        //设置文本可以选中  
//        if(!$.browser.mozilla){  
//            $(document).unbind("selectstart");  
//        }else{  
//            $("body").css("-moz-user-select", "");  
//        }
        $(document).unbind("selectstart");
        $("body").css("-moz-user-select", "");
        //计算设置新的列宽  
        doResize();  
    }  
}  
/**  
 * 设置新的列宽  
 * @param event e目标事件  
 * @return void  
 */  
function doResize(){  
    //计算列宽的变化值  
    var newWidth = parseInt(rightLine.css("left"), 10) - resizeHeader.offset().left - resizeHeader.width();  
    //设置新列宽  
    resizeHeader.width(resizeHeader.width() + newWidth);  
}