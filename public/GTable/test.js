var data = [ {
	id : "01",
	name : "ming",
	tel : "136458"
},{
	id : "02",
	name : "ge",
	tel : "1354412"
},{
	id : "03",
	name : "huang",
	tel : "18845612"
},{
	id : "04",
	name : "yang",
	tel : "1342568"
},{
	id : "05",
	name : "kun",
	tel : "1324487"
},{
	id : "06",
	name : "li",
	tel : "15478225"
} ,
{
	id : "06",
	name : "li",
	tel : "15478225"
} ,
{
	id : "06",
	name : "li",
	tel : "15478225"
} ,
{
	id : "06",
	name : "li",
	tel : "15478225"
} ];
var cols = [ {
	title : "数据标识",
	type : "text",
	field : "id"
}, {
	title : "姓名",
	type : "text",
	field : "name"
}, {
	title : "电话",
	type : "text",
	field : "tel"
} ];
$(function(){
	GTable.build({cols:cols,dataset:data});
});