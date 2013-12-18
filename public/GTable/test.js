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
	tel : "18845612009908 09887974872847 237492sdfsdfs32f156w4ef654wef654sdf1s323793215679865e45454sd56f4s65f489wef4sdf564s56f6f654564sdf6efbf4bh3d498w8fw6f4s64f51q4wfe654f9bg8d79g7df4",
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
	bir : "2013123"
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
	field : "bir",
	editor:{
		type:"date"
	}
} ];
$(function() {
	GTable.build({
		cols : cols,
		dataset : data,
		container : ".table-container"
	});
	$(".toExcel").click(function(){
		GTable.exportToExcel();
	});
});