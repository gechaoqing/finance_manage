(function(window, document) {
	var printRecords = window.printRecords = {
			render:gridRender
	}
	function getData(data) {
		var dsOption = {
			fields : [ {
				name : 'recordId'
			}, {
				name : 'printDate'
			}, {
				name : 'clientName'
			}, {
				name : 'insuranceAgentId'
			}, {
				name : 'tavelTax',
				type : 'float'
			}, {
				name : 'insuraceTypeId'
			}, {
				name : 'sum',
				type : 'float'
			}, {
				name : 'invoiceNo'
			}, {
				name : 'insuranceNo'
			}, {
				name : "businessName"
			}, {
				name : "cardId"
			}, {
				name : "payment"
			}, {
				name : "operatUserId"
			}, {
				name : "backOff"
			} ],
			recordType : 'json',
			data : data
		}
		return dsOption;
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
		var colsOption = [ {
			id : 'recordId',
			header : "记录ID",
			width : 60,
			editor : {
				type : "text"
			}
		}, {
			id : 'printDate',
			header : "出单日期",
			width : 80,
			editor : {
				type : "date"
			}
		}, {
			id : 'insuranceAgentId',
			header : "公司",
			width : 70,
			editor : {
				type : "select",
				options :agentsData
			},
			// Below function call by us
			renderer : function(value, record, columnObj, grid, colNo, rowNo) {
				var options = agentsData;
				var ret = options[value];
				if (ret == null) {
					ret = value;
				}
				return ret;
			}
		}, {
			id : 'clientName',
			header : "客户名称",
			width : 150,
			editor : {
				type : "text"
			}
		}, {
			id : 'tavelTax',
			header : "车船税",
			width : 100,
			editor : {
				type : "text"
			}
		}, {
			id : 'insuraceTypeId',
			header : "保险类型",
			width : 60,
			editor : {
				type : "select"
			}
		}, {
			id : 'sum',
			header : "金额",
			width : 60,
			editor : {
				type : "text"
			}
		}, {
			id : 'invoiceNo',
			header : "发票号",
			width : 80,
			editor : {
				type : "text"
			}
		}, {
			id : 'insuranceNo',
			header : "保单号",
			width : 80,
			editor : {
				type : "text"
			}
		}, {
			id : 'insuranceSerialNo',
			header : "保单流水号",
			width : 80,
			editor : {
				type : "text"
			}
		}, {
			id : 'businessName',
			header : "商家",
			width : 60,
			editor : {
				type : "text"
			}
		}, {
			id : 'cardId',
			header : "银行卡",
			width : 60,
			editor : {
				type : "text"
			}
		}, {
			id : 'operatUserId',
			header : "操作员",
			width : 60,
			editor : {
				type : "text"
			}
		}, {
			id : 'backOff',
			header : "回销",
			width : 60,
			editor : {
				type : "text"
			}
		} ];
		var gridOption = {
			id : "records",
			width : "100%", // "100%", // 700,
			height : "100%", // "100%", // 330,
			container : 'records',
			replaceContainer : true,
			dataset : getData(records()),
			columns : colsOption,
			toolbarPosition : null
		};
		var mygrid = new Sigma.Grid(gridOption);
		Sigma.Grid.render(mygrid);
	}
})(window, this);
$(function(){
	printRecords.render();
});