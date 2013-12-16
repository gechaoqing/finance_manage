var data = [ {
	id : "01",
	name : "ming",
	tel : "136458",
	bir:"2013-12-3"
},{
	id : "02",
	name : "ge",
	tel : "1354412",
	bir:"2013-12-3"
},{
	id : "03",
	name : "huang",
	tel : "18845612",
	bir:"2013-12-3"
},{
	id : "04",
	name : "yang",
	tel : "1342568",
	bir:"2013-12-3"
},{
	id : "05",
	name : "kun",
	tel : "1324487",
	bir:"2013-12-3"
},{
	id : "06",
	name : "li",
	tel : "0215654",
	bir:"2013-12-3"
} ,
{
	id : "06",
	name : "li",
	tel : "6545987",
	bir:"2013-12-3"
} ,
{
	id : "06",
	name : "li",
	tel : "5444844",
	bir:"2013-12-3"
} ,
{
	id : "06",
	name : "li",
	tel : "15478225",
	bir:"2013-12-3"
} ];
var cols = [ {
	title : "数据标识",
	type : "text",
	field : "id",
	editor:{
		type:"text"
	}
}, {
	title : "姓名",
	type : "text",
	field : "name",
	editor:{
		type:"text"
	}
}, {
	title : "电话",
	type : "text",
	field : "tel",
	editor:{
		type:"text"
	}
},{
	title:"生日",
	type:"text",
	field:"bir"
} ];
$(function(){
	GTable.build({cols:cols,dataset:data,container:".table-container"});
});