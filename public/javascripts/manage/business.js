/**
 * Created by Administrator on 14-1-15.
 */
$(function(){
    var cols=[{name:"商家名称",field:"businessName"},{name:"店面名称",field:"businessStore"},{name:"操作",type:"operator",data:[]}]
    tableData=TableJS.init({
        titles:cols,
        container:".records-container",
        url:"/manage/1002/data",
        urlPara:{}
    });

});