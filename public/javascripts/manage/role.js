$(function(){
	suiteHeight();
	var cols=[{
		name:"角色名称",
		field:"name"
	},{
		name:"管理类型",
		field:"type",
		type:"convert",
		data:{"0":"全局管理","1":"学校管理"}
	},{
		name:"最后更新日期",
		field:"updateAt"
	},{
		name:"创建日期",
		field:"createAt"
	},{
		name:"操作",
		data:[{
			name:"修改",
			href:"/schoolres/4/data/{id}"
		},{
			name:"<b>&times;</b> 删除",
			href:"/schoolres/4/delConfirm/{id}",
			className:"btn-danger"
		},{
			name:"分配权限",
			href:"/schoolres/assignPrivilege/{id}?name={name}",
			className:"btn-primary"
		}],
		type:"operator"
	}];
	dataTable=TableJS.init({
		titles:cols,
		container:".data-list",
		url:"/schoolres/4/data",
		urlPara:{}
	});
});