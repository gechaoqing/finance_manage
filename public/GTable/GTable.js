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
		var rows = options.dataset, cols = options.cols
		$(options.container).css("overflow","auto");
		var tableDom = buildDom(rows, cols);
		tableDom.appendTo($(options.container));
		setFixedThead(tableDom,options.container);
		$(document).keydown(function(e) {
			console.log(e.which);
			var code = e.which;
			if (code === 9) {
				e.preventDefault();
				moveFocus(tableDom, cols, rows);
			} else if (code === 13) {
				e.preventDefault();
				var input_ = $("input.cellEdit");
				if (input_.length == 0) {
					var td = tableDom.find("td.td-focus");
					var td_col = parseInt(td.attr("col"));
					var editor_ = cols[(td_col - 1)].editor;
					editor(editor_.type, td, td);
				} else {
					input_.blur();
				}
			} else if (code >= 37 && code <= 40) {
				e.preventDefault();
				moveFocus(tableDom, cols, rows, code);
			}
		});
	}
	function setFixedThead(tableDom,container){
		var thead_o=tableDom.find("thead");
		var tableDom_=tableDom.clone().width(tableDom.width());
		tableDom_.find("tbody").remove();
		var thead_=tableDom_.find("thead");
		var head_div=div().css({"position":"relative","z-index":3,"background":"#fff"});
		tableDom_.appendTo(head_div);
		var o_th=thead_o.find("th");
		o_th.each(function(i){
			if(i==o_th.length-1){
				thead_.find("th[data-field="+$(this).attr("data-field")+"]").width($(this).width()+16);
			}
			else{
				thead_.find("th[data-field="+$(this).attr("data-field")+"]").width($(this).width());
			}
			tableDom.find("td[data-field="+$(this).attr("data-field")+"]").width($(this).width());
		});
		thead_o.remove();
		tableDom.css({"padding":1});
		if(container==="body")
		{
			head_div.insertBefore(tableDom);
		}else{
			head_div.insertBefore($(container));
		}
		tableDom.parent().width(tableDom.width()+2);
	}
	function moveFocus(table, cols, rows, code) {
		var td = table.find("td.td-focus");
		var input_ = $("input.cellEdit");
		if (input_.length > 0) {
			input_.blur();
		}
		if (td.length !== 0) {
			var next = {};
			var td_col = parseInt(td.attr("col"));
			var td_row = parseInt(td.attr("row"));
			var cl = cols.length;
			var rl = rows.length;
			if (!code) {
				next = moveNext(td_col, td_row, cl, rl);
			} else {
				if (code === 38) {// up
					next.row = moveUp(td_row, rl);
					next.col = td_col;
				} else if (code === 40) {// down
					next.row = moveDown(td_row, rl);
					next.col = td_col;
				} else if (code === 37) {// left
					next.row = td_row;
					next.col = moveLeft(td_col, cl);
				} else if (code === 39) {// right
					next.row = td_row;
					next.col = moveRight(td_col, cl);
				}
			}
			td.removeClass("td-focus");
			table.find("td[row=" + next.row + "][col=" + next.col + "]")
					.addClass("td-focus");
		} else {
			table.find("td[row=1][col=1]").addClass("td-focus");
		}
	}
	function moveUp(td_row, rl) {
		td_row -= 1;
		if (td_row < 1) {
			td_row = rl;
		}
		return td_row;
	}
	function moveDown(td_row, rl) {
		td_row += 1;
		if (td_row > rl) {
			td_row = 1;
		}
		return td_row;
	}
	function moveLeft(td_col, cl) {
		td_col -= 1;
		if (td_col < 1) {
			td_col = cl;
		}
		return td_col;
	}
	function moveRight(td_col, cl) {
		td_col += 1;
		if (td_col > cl) {
			td_col = 1;
		}
		return td_col;
	}
	function moveNext(td_col, td_row, cl, rl) {
		if (td_col === cl) {
			if (td_row < rl) {
				td_row += 1;
				td_col = 1;
			} else {
				td_row = 1;
				td_col = 1;
			}
		} else {
			td_col += 1;
		}
		return {
			row : td_row,
			col : td_col
		}
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
				var editor_ = cols[j].editor;
				var col_data = eval("rows[i]." + cols[j].field);
				if (col_data) {
					var col_ = col(col_data).attr("data-field", cols[j].field)
							.attr("row", i + 1).attr("col", j + 1)
							.click(function(e) {
								if (editor_ && editor_.type) {
									if ($(this).hasClass("td-focus")) {
										editor(editor_.type, $(this));
										$(this).removeClass("td-focus");
										return;
									}
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
	function editor(editor_, _this) {
		if ($("input.cellEdit").length == 0) {
			if (editor_ === "text") {
				editorText(_this);
			}
		}
	}
	function editorText(_this) {
		$("<input type='text'/>").addClass("cellEdit").css({
			"top" : _this.offset().top - 2,
			"left" : _this.offset().left - 2,
			"width" : _this.outerWidth() + 4,
			"height" : _this.outerHeight() + 4,
			"padding-left" : 5
		}).val(_this.text()).appendTo("body").focus().blur(function() {
			_this.html($(this).val());
			$(this).remove();
		});
	}
	function setCols(tr, cols) {
		for ( var i = 0; i < cols.length; i++) {
			var h = th(cols[i].title).appendTo(tr).attr("data-field",
					cols[i].field);
			if (i == cols.length - 1) {
				h.addClass("no-border-right");
			}
		}
	}
	function table() {
		return $("<table class='GTable'></table>");
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
	function div(html){
		return $("<div></div>").html(html?html:"");
	}
})(window, this);