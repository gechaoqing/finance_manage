var data = [ {
	id : "01",
	name : "01",
	tel : "136458",
	bir : "2013-12-3"
}, {
	id : "02",
	name : "02",
	tel : "1354412",
	bir : "2013-12-3"
}, {
	id : "03",
	name : "01",
	tel : "18845612",
	bir : "2013-12-3"
}, {
	id : "04",
	name : "02",
	tel : "1342568",
	bir : "2013-12-3"
}, {
	id : "05",
	name : "03",
	tel : "1324487",
	bir : "2013-12-3"
}, {
	id : "06",
	name : "04",
	tel : "0215654",
	bir : "2013-12-3"
}, {
	id : "06",
	name : "05",
	tel : "6545987",
	bir : "2013-12-3"
}, {
	id : "06",
	name : "03",
	tel : "5444844",
	bir : "2013-12-3"
}, {
	id : "06",
	name : "01",
	tel : "15478225",
	bir : "2013-12-3"
} ];
var cols = [ {
	title : "数据标识",
	type : "text",
	field : "id",
	editor : {
		type : "text"
	}
}, {
	title : "姓名",
	type : "text",
	field : "name",
	editor : {
		type : "select",
		labelField : "name",
		valueField : "id",
		data : [ {
			id : "01",
			name : "小明"
		}, {
			id : "02",
			name : "小花"
		},{
			id : "03",
			name : "月月"
		},{
			id : "04",
			name : "kimi"
		},{
			id : "05",
			name : "石头"
		} ]
	}
}, {
	title : "电话",
	type : "text",
	field : "tel",
	editor : {
		type : "text"
	}
}, {
	title : "生日",
	type : "text",
	field : "bir"
} ];
$(function() {
	GTable.build({
		cols : cols,
		dataset : data,
		container : ".table-container"
	});
	//监听标题行的mouosemove事件  
    $("table th").mousemove(function(e){  
        var target = $(e.target);  
        if(resizing){  
            //当已经在拖动变化列宽时  
            onDraging(e);  
        }else if(fnIsLeftEdge(e)){  
            //靠近左边框时，将当前的处理header  
                        //设置为左边的一个，这样就相当于是拖动列  
            //的右边框，可以只计算该header的右边框参  
                        //考线的移动,方便处理  
            resizeHeader = target.prev();  
            //不响应第一列的左边框拖动事件  
            if(resizeHeader.length == 0)  
                return;  
            //当鼠标停在左边框时，设置当前为可拖动状态  
            resizable = true;             
            //设置鼠标样式为拖动时的样式  
            target.css("cursor", "col-resize");  
        }else if(fnIsRightEdge(e)){  
            //当鼠标停留在右边框时  
            resizeHeader = target;  
            resizable = true;  
            target.css("cursor", "col-resize");   
        }else{  
            //超出可拖动的区域，设为不可拖动状态  
            resizable = false;  
            target.css("cursor", "default");  
        }  
    });  
    //当在拖动列上点击鼠标  
    $("table th").mousedown(function(e){  
        onDragingStart(e);        
    });  
    //当在document上移动鼠标,因为拖动可能超出表格的范围  
    $(document).mousemove(function(e){  
        onDraging(e);  
    });  
    //当拖动而释放时候未在标题行的释放也需要结束拖动  
    $(document).mouseup(function(e){  
        onDragingEnd(e);  
    });  
});