(function(window,document){
	var GTable=window.GTable={
		options:{
			
		}
	}
	GTable.prototype.build=function(opt){
		var options=$.extend(GTable.options, opt);
	};
	GTable.prototype.buildDom=function(rows,cols){
		var table=$("<table></table");
		for ( var i=0;i<rows.length;i++) {
			var rowSet=row();
			for ( var j=0;j<cols.length;j++) {
				rowSet.append(col(""));
			}
			table.append(rowSet);
		}
	};
	function row(){
		return $("<tr></tr>");
	}
	function col(html){
		return $("<td></td>").html(html);
	}
	function th(html){
		return $("<th></th>").html(html);
	}
})(window,this);