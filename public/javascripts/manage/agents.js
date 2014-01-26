/**
 * Created by Administrator on 14-1-15.
 */
$(function () {
    var cols = [
        {name: "公司名称", field: "agentName"},
        {name: "返点", field: "agentRebate",type:"join",data:[{text:"%"}]},
        {name: "操作", type: "operator", data: []}
    ]
    tableData = TableJS.init({
        titles: cols,
        container: ".records-container",
        url: "/manage/1001/data",
        urlPara: {}
    });
    $(".doSearch").click(function () {
        var para = [];
        if (!$("input.name").val().isEmpty()) {
            var ob = {};
            ob.key = "%agentName";
            ob.value = "%" + $("input.name").val() + "%";
            para[para.length] = ob;
        }
        if (!$("input.rebate").val().isEmpty()) {
            var ob = {};
            ob.key = "agentRebate";
            ob.value = $("input.rebate").val();
            para[para.length] = ob;
        }
        var urlPara = {};
        for (var i = 0; i < para.length; i++) {
            urlPara["key[" + i + "]"] = para[i].key;
            urlPara["value[" + i + "]"] = para[i].value;
        }
        tableData.opts.urlPara = urlPara;
        tableData.loadData();
    });
});