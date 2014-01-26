/**
 * Created by Administrator on 14-1-15.
 */
$(function(){
    var cols=[{name:"姓名",field:"userName"},{name:"手机号",field:"mobile"},{name:"最后登录电脑名",field:"lastLoginPcName"},{name:"最后登录IP",field:"lastLoginPcIp"},{name:"操作",type:"operator",data:[]}]
    tableData=TableJS.init({
        titles:cols,
        container:".records-container",
        url:"/manage/1005/data",
        urlPara:{}
    });

});