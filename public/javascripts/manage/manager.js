$(function(){
	suiteHeight();
	$(".btn.data-search").click(function(e){
		e.preventDefault();
		var para=[];
		if(!$("input[name='name']").val().isEmpty()){
			var ob={};
			ob.key="%name";
			ob.value="%"+$("input[name='name']").val()+"%";
			para[para.length]=ob;
		}
		if(!$("input[name='account']").val().isEmpty()){
			var ob={};
			ob.key="%account";
			ob.value="%"+$("input[name='account']").val()+"%";
			para[para.length]=ob;
		}
		if($("select[name='school']").val()!=-1){
			var ob={};
			ob.key="schoolid";
			ob.value=$("select[name='school']").val();
			para[para.length]=ob;
		}
		dataTable.opts.urlPara={};
		for(var i=0;i<para.length;i++){
			dataTable.opts.urlPara["key["+i+"]"]=para[i].key;
			dataTable.opts.urlPara["value["+i+"]"]=para[i].value;
		}
		dataTable.loadData();
	});
	getSchools();
	function getSchools(){
		$.ajax({
			async:false,
			url:"/schoolres/0/data/noPage",
			type:"post",
			dataType:"json",
			success:function(res){
				if(res){
					for(var i=0;i<res.length;i++){
						$("select[name='school']").append("<option value='"+res[i].id+"'>"+res[i].name+"</option>");
					}
				}
			},
			error:function(r,e,t){
				alert("ERROR:"+e);
			}
		});
	}
	var cols=[{
		name:"姓名",
		field:"name"
	},{
		name:"登录账户",
		field:"account"
	},{
		name:"管理员类型",
		field:"type",
		type:"convert",
		data:{"0":"全局管理员","1":"学校管理员"}
	},{
		name:"最后登录日期",
		field:"loginDate"
	},{
		name:"最后登录IP",
		field:"loginIp"
	},{
		name:"登录成功次数",
		field:"loginSuccess"
	},{
		name:"登录失败次数",
		field:"loginFial"
	},{
		name:"操作",
		data:[{
			name:"修改",
			href:"/schoolres/5/data/{id}",
			className:"btn-info"
		},{
			name:"<b>&times;</b> 删除",
			href:"/schoolres/5/delConfirm/{id}?shield_field=id="+$("#logid").val(),
			className:"btn-danger"
		},{
			name:"分配角色",
			href:"/schoolres/assignRole/{id}?name={account}",
			className:"btn-primary"
		}],
		type:"operator"
	}];
	dataTable=TableJS.init({
		titles:cols,
		container:".data-list",
		url:"/schoolres/5/data",
		urlPara:{}
	});
});