(function (window, document) {
    var printRecords = window.printRecords = {
        render: gridRender
    }

    function gridRender() {
        var getSource = function (source, name) {
            var data = [];
            if (!source) {
                return data;
            }
            $.ajax({
                url: "/manage/" + source + "/source",
                async: false,
                type: "post",
                data: {},
                dataType: "json",
                success: function (res) {
                    for (var i = 0; i < res.length; i++) {
                        data.push(eval("res[i]." + name));
                    }
                },
                error: function (r, e, t) {
                    alert("ERROR:" + e);
                }
            });
            return data;
        };
        var records = function () {
            var data = null;
            $.ajax({
                url: "/manage/1000/data/noPage",
                async: false,
                data: {},
                type:"post",
                dataType: "json",
                success: function (records) {
                    data = records;
                },
                error: function (r, e, t) {
                    alert("ERROR:" + e);
                }
            });
            return data;
        };
        var $container = $(".records-container");
        $container.handsontable({
            data: records(),
            manualColumnResize: true,
            scrollH: 'auto',
            stretchV: 'auto',
            persistentState: true,
            rowHeaders: true,
            autoWrapRow: true,
            columnSorting: true,
            currentRowClassName: 'currentRow',
            persistentState: true,
            // currentColClassName: 'currentCol',
            colHeaders: [ "出单ID", "出单日期", "保险公司", "客户名称", "车船税", "保险类型", "金额",
                "发票号", "保单号", "保单流水号", "商家", "刷卡", "操作员", "回销" ],
            columns: [
                {
                    data: "recordId"
                },
                {
                    data: "printDate",
                    type: 'date'
                },
                {
                    data: "agentName",
                    type: 'dropdown',
                    source: getSource(0, "agentName"),
                    strict: true,
                    allowInvalid: true
                },
                {
                    data: "clientName",
                    type: 'autocomplete',
                    source: getSource(),
                    strict: false
                },
                {
                    data: "tavelTax",
                    type: 'numeric',
                    format: '$ 0,0.00'
                },
                {
                    data: "insuraceTypeId"
                },
                {
                    data: "sum",
                    type: 'numeric',
                    format: '$ 0,0.00'
                },
                {
                    data: "invoiceNo"
                },
                {
                    data: "insuranceNo"
                },
                {
                    data: "insuranceSerialNo"
                },
                {
                    data: "businessName"
                },
                {
                    data: "cardName",
                    type: 'dropdown',
                    source: getSource(2, "cardName"),
                    strict: true,
                    allowInvalid: false
                },
                {
                    data: "operatUserId"
                },
                {
                    data: "backOff"
                }
            ],
            minSpareRows: 1,
            width: $(".main").width(),
            height: $(".main").height() - 35,
            afterChange: function (change, source) {
                console.log(change);
                console.log("source=" + source);
                if (source === "loadData") {
                    return;
                }
                var data = $(".records-container").data('handsontable').getData();
                var chanageData={},addData={};
                for(var j=0;j<change.length;j++){
                    var d=data[change[j][0]];
                    var id = d.recordId;
                    if(id){
                        var ch=change[j][1];
                        var val=change[j][3];
                        changeData["data."+ch]=val;
                    }else{
                        var ch=change[j][1];
                        var val=change[j][3];
                        addData["data."+ch]=val;
                    }
                }
//                console.log(data);

//                console.log("recordId=" + id);
            },
//			afterSelectionEnd:function(startRow,startCol,endRow,endCol){
//				var hot = $container.handsontable('getInstance')
//			      , sel = hot.getSelected();
//				console.log(hot.getCell(sel[2],sel[3]));
//			},
            afterSelectionEndByProp: function (r, p, r2, p2) {
//                console.log(p);
//                console.log(p2);
            }
        });
        $container.handsontable("render");
    }
    function changeRecord(id,data){

    }
})(window, this);
$(function () {
    printRecords.render();
    $("table.htCore").width($(".main").width());
    $(".search-box .printDate").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 1
    }).click(function () {
            $(this).datetimepicker("show");
        });
    var toExcel = (function () {
        var uri = 'data:application/vnd.ms-excel;base64,', template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>', base64 = function (s) {
            return window.btoa(unescape(encodeURIComponent(s)))
        }, format = function (s, c) {
            return s.replace(/{(\w+)}/g, function (m, p) {
                return c[p];
            })
        }
        return function (table, name) {
            var table = table || $("table");
            var ctx = {
                worksheet: name || 'Worksheet',
                table: table.html()
            }
            window.location.href = uri + base64(format(template, ctx))
        }
    })()
    $(".exportToExcel").click(function () {
        var table = $("table.htCore").clone();
        table.find(".htAutocompleteArrow").remove();
        $(table.find("thead th").get(0)).remove();
        table.find("colgroup col").width(100);
        table.find("tbody th").remove();
        toExcel(table, "");
    });
});