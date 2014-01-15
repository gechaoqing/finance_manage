/**
 * Created by Administrator on 14-1-15.
 */
$(function(){
    var cols=[{name:"卡名称",field:"cardName"},{name:"卡号",field:"cardNo"},{name:"操作",type:"operator",data:[]}]
    tableData=TableJS.init({
        titles:cols,
        container:".records-container",
        url:"/manage/1003/data",
        urlPara:{}
    });

});