(function(window, document) {
	var printRecords = window.printRecords = {
			render:gridRender
	}
	function gridRender() {
		var agents = function() {
			var data = null;
			$.ajax({
				url : "agent/data",
				async : false,
				data : {},
				dataType : "json",
				success : function(agents) {
					data = agents;
				},
				error : function(r, e, t) {
					alert("ERROR:" + e);
				}
			});
			return data;
		};
		var agentsData=agents();
		var records = function() {
			var data = null;
			$.ajax({
				url : "printRecords/data",
				async : false,
				data : {},
				dataType : "json",
				success : function(records) {
					data = records;
				},
				error : function(r, e, t) {
					alert("ERROR:" + e);
				}
			});
			return data;
		};
		var $container = $(".records-container");
		$container.handsontable({
		  data: records(),
		  manualColumnResize: true,
		  minSpareRows: 1,
		  persistentState: true,
		  rowHeaders: true,
		  colHeaders: ["出单ID","出单日期","保险公司","客户名称","车船税","保险类型","金额","发票号","保单号","保单流水号","商家","刷卡","操作员","回销"],
		  columns: [
		    {data: "recordId"},
		    {data: "printDate"},
		    {data: "insuranceAgentId"},
		    {data: "clientName"},
		    {data:"tavelTax"},
		    {data:"insuraceTypeId"},
		    {data:"sum"},
		    {data:"invoiceNo"},
		    {data:"insuranceNo"},
		    {data:"insuranceSerialNo"},
		    {data:"businessName"},
		    {data:"cardId"},
		    {data:"operatUserId"},
		    {data:"backOff"}
		  ],
		  minSpareRows: 1
		});
	}
})(window, this);
$(function(){
	printRecords.render();
	 $(".records-container").width($(".main-content").width()).height($(".main-content").height());
});