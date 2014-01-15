/**
 * Created by Administrator on 14-1-15.
 */
$(function(){
    var cols=[{name:"公司名称",field:"agentName"},{name:"返点",field:"agentRebate"},{name:"操作",type:"operator",data:[]}]
    tableData=TableJS.init({
        titles:cols,
        container:".records-container",
        url:"/manage/1001/data",
        urlPara:{}
    });
});