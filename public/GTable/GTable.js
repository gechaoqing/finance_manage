(function(window, document) {
	function colResizer() {
		this.resizing = false;
		this.resizable = false;
		this.minWidth = 100;
		this.table=null;
		this.resizeHeader = null;
		this.leftLine = null;
		this.rightLine = null;
	}
	colResizer.prototype.bindMove = function(table) {
		var _this = this;
		this.table=table;
		var th = table.find("thead th");
		th.mousemove(function(e) {
			var target = $(e.target);
			if (_this.resizing) {
				// 当已经在拖动变化列宽时
				_this.onDraging(e);
			} else if (fnIsLeftEdge(e)) {
				// 靠近左边框时，将当前的处理header
				// 设置为左边的一个，这样就相当于是拖动列
				// 的右边框，可以只计算该header的右边框参
				// 考线的移动,方便处理
				_this.resizeHeader = target.prev();
				// 不响应第一列的左边框拖动事件
				if (_this.resizeHeader.length == 0)
					return;
				// 当鼠标停在左边框时，设置当前为可拖动状态
				_this.resizable = true;
				// 设置鼠标样式为拖动时的样式
				target.css("cursor", "col-resize");
			} else if (fnIsRightEdge(e)) {
				// 当鼠标停留在右边框时
				_this.resizeHeader = target;
				_this.resizable = true;
				target.css("cursor", "col-resize");
			} else {
				// 超出可拖动的区域，设为不可拖动状态
				_this.resizable = false;
				target.css("cursor", "default");
			}
		});
		// 当在拖动列上点击鼠标
		th.mousedown(function(e) {
			_this.onDragingStart(e, table);
		});
		// 当在document上移动鼠标,因为拖动可能超出表格的范围
		$(document).mousemove(function(e) {
			_this.onDraging(e);
		});
		// 当拖动而释放时候未在标题行的释放也需要结束拖动
		$(document).mouseup(function(e) {
			_this.onDragingEnd(e);
		});
	}
	colResizer.prototype.onDraging = function(e) {
		// 如果已经在拖动
		if (this.resizing) {
			// 拖动后的列宽不能小于最小列宽
			if (e.pageX - this.resizeHeader.offset().left > this.minWidth) {
				this.rightLine.css("left", e.pageX);
			}
		}
	}

	function _fnIsColEdge(e, side) {
		var target = $(e.target);
		var x = e.pageX;
		var offset = target.offset();
		var left = offset.left;
		var right = left + target.outerWidth();
		return side ? x <= left + 2 : x >= right - 2;
	}

	function fnIsLeftEdge(e) {
		return _fnIsColEdge(e, true);
	}

	function fnIsRightEdge(e) {
		return _fnIsColEdge(e, false);
	}

	colResizer.prototype.onDragingStart = function(e, table) {
		// 当前是否为拖动状态
		if (this.resizable) {
			var target = $(e.target);
			$(document).bind("selectstart", function() {
				return false;
			});
			$("body").css("-moz-user-select", "none");
			var rightLine = this.rightLine;
			// 创建参考线
			if (!this.leftLine) {
				var leftLine = this.leftLine = $("<div></div>");
				leftLine.addClass("resize_line");
				leftLine.appendTo("body");
				rightLine = this.rightLine = leftLine.clone();
				rightLine.appendTo("body");
			}
			// 显示参考线
			this.leftLine.css({
				"top" : this.resizeHeader.offset().top,
				"left" : this.resizeHeader.offset().left,
				"height" : table.innerHeight()
			});
			rightLine.css({
				"top" : this.resizeHeader.offset().top,
				"left" : e.pageX,
				"css" : "col-resize",
				"height" : table.innerHeight()
			});
			this.leftLine.show();
			rightLine.show();
			// 设置为已经在拖动
			this.resizing = true;
		}
	}

	colResizer.prototype.onDragingEnd = function(e) {
		// 如果已经在拖动
		if (this.resizing) {
			this.resizing = false;
			// 隐藏参考线
			this.rightLine.hide();
			this.leftLine.hide();
			$(document).unbind("selectstart");
			$("body").css("-moz-user-select", "");
			this.doResize();
		}
	}
	colResizer.prototype.doResize = function() {
		// 计算列宽的变化值
		var newWidth = parseInt(this.rightLine.css("left"), 10)
				- this.resizeHeader.offset().left - this.resizeHeader.width();
		// 设置新列宽
		var newThWidth=this.resizeHeader.width() + newWidth;
		this.resizeHeader.width(newThWidth);
		this.table.find("td[data-field="+this.resizeHeader.attr("data-field")+"]").width(newThWidth);
//		this.table.width(this.table.width()+newWidth);
	}

	var GTable = window.GTable = {
		options : {
			columns : [],
			dataset : [],
			container : "body"
		},
		build : build
	}
	function loadcss() {
		$("<link>").attr({
			rel : "stylesheet",
			type : "text/css",
			href : "GTable.css"
		}).insertAfter("title");
	}
	function build(opt) {
		loadcss();
		var options = $.extend(GTable.options, opt);
		var rows = options.dataset, cols = options.cols
		$(options.container).css("overflow", "auto");
		var tableDom = buildDom(rows, cols);
		tableDom.appendTo($(options.container));
		setCellWidth(tableDom);
		new colResizer().bindMove(tableDom);
		// setFixedThead(tableDom,options.container);
		$(document).keydown(
				function(e) {
					console.log(e.which);
					var code = e.which;
					if (code === 9) {
						e.preventDefault();
						moveFocus(tableDom, cols, rows);
					} else if (code === 13) {
						e.preventDefault();
						var input_ = $("input.cellEdit.text");
						var input_s = $("select.cellEdit.select");
						var input_d=$("input.cellEdit.date");
						if (input_.length == 0 && input_s.length == 0&&input_d.length==0) {
							var td = tableDom.find("td.td-focus");
							var td_col = parseInt(td.attr("col"));
							var td_row = parseInt(td.attr("row"));
							var editor_ = cols[(td_col - 1)].editor;
							editor(editor_, td, eval("rows[" + (td_row - 1)
									+ "]." + cols[(td_col - 1)].field));
						} else if(input_.length!=0){
							input_.trigger("evtEnter");
						} else if(input_s.length!=0){
							input_s.blur();
						}
					} else if (code >= 37 && code <= 40) {
						e.preventDefault();
						moveFocus(tableDom, cols, rows, code);
					}
				});
		return tableDom;
	}
	function setCellWidth(tableDom) {
		var thead_o = tableDom.find("thead");
		var o_th = thead_o.find("th");
		o_th.each(function(i) {
			if (i == o_th.length - 1) {
				thead_o.find(
						"th[data-field=" + $(this).attr("data-field") + "]")
						.width($(this).width() + 16);
			} else {
				thead_o.find(
						"th[data-field=" + $(this).attr("data-field") + "]")
						.width($(this).width());
			}
			tableDom.find("td[data-field=" + $(this).attr("data-field") + "]")
					.width($(this).width());
		});
	}
	function setFixedThead(tableDom, container) {
		var thead_o = tableDom.find("thead");
		var tableDom_ = tableDom.clone().width(tableDom.width());
		tableDom_.find("tbody").remove();
		var thead_ = tableDom_.find("thead");
		var head_div = div().css({
			"position" : "relative",
			"z-index" : 3,
			"background" : "#fff"
		});
		tableDom_.appendTo(head_div);
		var o_th = thead_o.find("th");
		o_th.each(function(i) {
			if (i == o_th.length - 1) {
				thead_
						.find(
								"th[data-field=" + $(this).attr("data-field")
										+ "]").width($(this).width() + 16);
			} else {
				thead_
						.find(
								"th[data-field=" + $(this).attr("data-field")
										+ "]").width($(this).width());
			}
			tableDom.find("td[data-field=" + $(this).attr("data-field") + "]")
					.width($(this).width());
		});
		thead_o.remove();
		tableDom.css({
			"padding" : 1
		});
		if (container === "body") {
			head_div.insertBefore(tableDom);
		} else {
			head_div.insertBefore($(container));
		}
		tableDom.parent().width(tableDom.width() + 2);
	}
	function moveFocus(table, cols, rows, code) {
		var td = table.find("td.td-focus");
		var input_ = $("input.cellEdit.text");
		var input_s = $("select.cellEdit.select");
		if (input_.length > 0) {
			input_.blur();
		}
		if (input_s.length > 0) {
			input_s.blur();
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
			$(".cellEdit.date").remove();
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
		var table_ = table().attr("data-resizable-columns-id", "GTable");
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
				var col_data = eval("rows[i]." + cols[j].field);
				if (cols[j].editor && cols[j].editor.type === "select") {
					var select_data = cols[j].editor.data;
					sedata: for ( var si = 0; si < select_data.length; si++) {
						if (col_data == eval("select_data[si]."
								+ cols[j].editor.valueField)) {
							col_data = eval("select_data[si]."
									+ cols[j].editor.labelField);
							break sedata;
						}
					}
				}
				if (col_data) {
					var col_ = col(col_data).attr("data-field", cols[j].field)
							.attr("row", i + 1).attr("col", j + 1).click(
									function(e) {
										var col_num = parseInt($(this).attr(
												"col"));
										var editor_ = cols[col_num - 1].editor;
										if (editor_ && editor_.type) {
											var row_num = parseInt($(this)
													.attr("row"));
											var cell_data = eval("rows["
													+ (row_num - 1) + "]."
													+ cols[col_num - 1].field);
											if ($(this).hasClass("td-focus")) {
												editor(editor_, $(this),
														cell_data);
												// $(this).removeClass("td-focus");
												return;
											}
										}
										$(".cellEdit.date").remove();
										$("td.td-focus")
												.removeClass("td-focus");
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
			rowSet.appendTo(tbody_).hover(function(){
				$(this).addClass("hover_row");
			},function(){
				$(this).removeClass("hover_row");
			});
		}
		return table_.append(thead_).append(tbody_).attr("cellspacing", 0);
	}
	function editor(editor_, _this, cell_data) {
		if ($("input.cellEdit").length == 0) {
			if (editor_.type === "text") {
				editorText(_this, cell_data);
			} else if (editor_.type === "select") {
				editorSelect(_this, editor_, cell_data);
			} else if(editor_.type==="date"){
				editorDate(_this,cell_data);
			}
		}
	}
	function editorSelect(_this, editor_, cell_data) {
		var select = $("<select></select>").addClass("cellEdit").addClass(
				"select").css({
			"top" : _this.offset().top - 2,
			"left" : _this.offset().left - 2,
			"width" : _this.outerWidth() + 3,
			"height" : _this.outerHeight() + 3,
			"padding-left" : 5
		});
		var options = editor_.data;
		var label = editor_.labelField;
		var value = editor_.valueField;
		for ( var i = 0; i < options.length; i++) {
			var opt = options[i];
			var val = eval("opt." + value);
			var lab = eval("opt." + label);
			if (_this.text() == lab) {
				select.append("<option selected value='" + val + "'>" + lab
						+ "</option>");
				continue;
			}
			select.append("<option value='" + val + "'>" + lab + "</option>");
		}
		return select.appendTo("body").focus().click().blur(function() {
			$(this).remove();
		}).change(function() {
			_this.html($(this).find(":selected").text());
		});
	}
	function editorText(_this, cell_data) {
		return $("<input type='text'/>").addClass("cellEdit").addClass("text")
				.css({
					"top" : _this.offset().top - 2,
					"left" : _this.offset().left - 2,
					"width" : _this.outerWidth() + 3,
					"height" : _this.outerHeight() + 3,
					"padding-left" : 5
				}).val(cell_data).appendTo("body").focus().blur(function() {
					// _this.html($(this).val());
					cell_data = $(this).val();
					$(this).remove();
				}).bind("evtEnter", function() {
					_this.html($(this).val());
					$(this).blur();
				});
	}
	function editorDate(_this,cell_data){
		$("<input type='text' readonly='readonly'/>").addClass("cellEdit").addClass("date")
		.css({
			"top" : _this.offset().top - 2,
			"left" : _this.offset().left - 2,
			"width" : _this.outerWidth() + 3,
			"height" : _this.outerHeight() + 3,
			"padding-left" : 5
		}).val(_this.text()).appendTo("body").focus(function(){
			$(this).datetimepicker({
				language : 'zh-CN',
				format:"yyyy-mm-dd",
				weekStart : 1,
				todayBtn : 1,
				autoclose : 1,
				todayHighlight : 1,
				startView : 2,
				minView : 2,
				forceParse : 1,
				initialDate: _this.text()
			});
			$(this).datetimepicker("show");
		}).focus().click(function(){
			$(this).datetimepicker("show");
		}).change(function(){
			_this.html($(this).val());
			$(this).remove();
			$(".datetimepicker").remove();
		});
	}
	function setCols(tr, cols) {
		for ( var i = 0; i < cols.length; i++) {
			var h = th(cols[i].title).appendTo(tr).attr("data-field",
					cols[i].field).attr("data-resizable-column-id",
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
		return $("<th></th>").html(html);
	}
	function div(html) {
		return $("<div></div>").html(html ? html : "");
	}
})(window, this);