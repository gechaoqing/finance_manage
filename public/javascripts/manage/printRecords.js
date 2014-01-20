(function (window, document) {
    var printRecords = window.printRecords = {
        render: gridRender,
        reload: reload
    }

    function reload() {
        var para = [];
        if (!$("input.printDate-start").val().isEmpty()) {
            var ob = {};
            ob.key = ">printDate";
            ob.value = $("input.printDate-start").val();
            para[para.length] = ob;
        }
        if (!$("input.printDate-end").val().isEmpty()) {
            var ob = {};
            ob.key = "<printDate";
            ob.value = $("input.printDate-end").val();
            para[para.length] = ob;
        }
        if (!$("input.customer").val().isEmpty()) {
            var ob = {};
            ob.key = "%businessName";
            ob.value = "%" + $("input.customer").val() + "%";
            para[para.length] = ob;
        }
        if ($("select.users").val() != -1) {
            var ob = {};
            ob.key = "userName";
            ob.value = $("select.users").val();
            para[para.length] = ob;
        }
        var urlPara = {};
        for (var i = 0; i < para.length; i++) {
            urlPara["key[" + i + "]"] = para[i].key;
            urlPara["value[" + i + "]"] = para[i].value;
        }
        //if (para.length > 0) {
            var l = TableJS.layer();
            $.ajax({
                url: "/manage/query/records",
                data: urlPara,
                type: "post",
                dataType: "json",
                success: function (records) {
                    var condata = $(".records-container").data('handsontable');
                    condata.loadData(records);
                    $("#" + l).remove();
                },
                error: function (r, e, t) {
                    alert("ERROR:" + e);
                }
            });
       // }

    }

    function gridRender() {
        var l = TableJS.layer();
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
                url: "/manage/query/records",
                async: false,
                data: {isFirst:1},
                type: "post",
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
        $("#" + l).remove();
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
            colHeaders: [ "出单日期", "保险公司", "客户名称", "车船税", "保险类型", "金额",
                "发票号", "保单号", "保单流水号", "商家", "刷卡", "操作员", "回销" ],
            columns: [
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
                if (source === "loadData") {
                    return;
                }
                var data = $(".records-container").data('handsontable').getData();
                for (var j = 0; j < change.length; j++) {
                    var d = data[change[j][0]];
                    console.log(d);
                    var id = d.recordId;
                    if (id) {
                        var changeData = {};
                        var ch = change[j][1];
                        var val = change[j][3];
                        changeData["data." + ch] = val;
                        changeData["data.recordId"] = id;
                        changeRecord(changeData);
                    } else {
                        var addData = {};
                        var ch = change[j][1];
                        var val = change[j][3];
                        if (val) {
                            addData["data." + ch] = val;
                            addRecord(addData,d);
                        }
                    }
                }
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

    function changeRecord(data) {
        $.ajax({
            type: "post",
            url: "/manage/printRecord/update",
            data: data,
            dataType: "json",
            success: function (res) {
                console.log(res);
            }, error: function (r, e) {
                alert(e);
            }
        });
    }

    function addRecord(data,d) {
        $.ajax({
            type: "post",
            url: "/manage/printRecord/add",
            data: data,
            dataType: "json",
            success: function (res) {
                d.recordId=res.response;
                console.log(d);
            }, error: function (r, e) {
                alert(e);
            }
        });
    }
})(window, this);
$(function () {
    printRecords.render();
    $(".doSearch").click(function () {
        printRecords.reload();
    });
    $("table.htCore").width($(".main").width());
    var now = new Date().format("yyyy-MM-dd");
    $(".search-box .printDate-start").datetimepicker({
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
        }).on('changeDate',function (ev) {
            if ($(this).val() > $(".search-box .printDate-end").val()) {
                $(".search-box .printDate-end").val("");
            }
            $(".search-box .printDate-end").datetimepicker('setStartDate', $(this).val());
        }).val(now);
    $(".search-box .printDate-end").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        weekStart: 1,
        todayBtn: 1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        startDate: now,
        minView: 2,
        forceParse: 1
    }).click(function () {
            $(this).datetimepicker("show");
        }).val(now);
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