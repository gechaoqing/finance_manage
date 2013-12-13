(function(window, document) {
	var GTable = window.GTable = {
		options : {
			columns : [],
			dataset : [],
			container : "body"
		},
		build : build
	}
	function build(opt) {
		var options = $.extend(GTable.options, opt);
		var table = buildDom(options.dataset, options.cols);
		table.appendTo($(options.container));

	}
	function buildDom(rows, cols) {
		var table_ = table();
		var thead_ = thead();
		var tr_ = row().appendTo(thead_);
		setCols(tr_, cols);
		var tbody_ = tbody();
		for ( var i = 0; i < rows.length; i++) {
			var rowSet = row();
			if ((i + 1) % 2 == 0) {
				rowSet.addClass("e-row");
			}
			for ( var j = 0; j < cols.length; j++) {
				if (cols.editor) {

				}
				var data = eval("rows[i]." + cols[j].field);
				if (data) {
					var col_ = col(data)
							.attr("data-field", cols[j].field)
							.click(
									function(e) {
										if ($(this).hasClass("td-focus")) {
											var t = e.target;
											if ($(this).find("input.cellEdit").length == 0) {
												$("<input type='text'/>")
														.addClass("cellEdit")
														.css(
																{
																	"top" : $(t).offset().top-2,
																	"left" : $(t).offset().left-2,
																	"width":$(t).outerWidth()+4,
																	"height":$(t).outerHeight()+4
																}).val(data).appendTo(
																col_);
											}
											$("td.td-focus").removeClass("td-focus");
											return;
										}
										$("td.td-focus").removeClass("td-focus");
										$(this).addClass("td-focus");
									});
					rowSet.append(col_);
					if (j == cols.length - 1) {
						col_.addClass("no-border-right");
					}
				} else {
					alert("can not find " + cols[j].field + " field in row");
				}
			}
			rowSet.appendTo(tbody_);
		}
		return table_.append(thead_).append(tbody_).attr("cellspacing", 0);
	}
	function setCols(tr, cols) {
		for ( var i = 0; i < cols.length; i++) {
			var h = th(cols[i].title).appendTo(tr);
			if (i == cols.length - 1) {
				h.addClass("no-border-right");
			}
		}
	}
	function table() {
		return $("<table></table>");
	}
	function tbody() {
		return $("<tbody></tbody>");
	}
	function thead() {
		return $("<thead></thead>");
	}
	function row() {
		return $("<tr></tr>");
	}
	function col(html) {
		return $("<td></td>").html(html);
	}
	function th(html) {
		return $("<th scope='col'></th>").html(html);
	}
})(window, this);