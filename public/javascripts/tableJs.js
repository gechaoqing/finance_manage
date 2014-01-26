(function (window, document) {
    var TableJS = window.TableJS = {
        opts: {
            id: "tableJsId_" + new Date().getTime(),
            urlPara: {},
            complete: defaultComplete
        },
        init: init,
        loadData: loadData,
        nextPage: next,
        prePage: pre,
        layer: function (txt, style) {
            return getLayer(txt, style);
        },
        modal: function (url, drop) {
            $.get(url, function (data) {
                $('<div class="modal hide fade">' + data + '</div>').modal({
                    backdrop: (!drop ? "static" : drop)
                });
            });
        }
    }

    function adjustHeight(){
        function getHeight(){
            var ph=$(".tableJs-container").next().outerHeight();
            return $(".main").outerHeight()-$(".search-box").outerHeight()-ph;
        }
        var h=getHeight();
        $(".tableJs-container").css({"min-height":h,"height":h});
        $(window).resize(function(){
            var h=getHeight();
            $(".tableJs-container").css({"min-height":h,"height":h});
        });
    }

    function defaultComplete() {
        $('a.btn').unbind("click");
        $('a.btn').click(
            function (e) {
                var tog = $(this).attr("data-toggle");
                var url = $(this).attr('href');
                if (url.indexOf('#') == 0) {
                    // $(url).modal('open');
                    return;
                }
                if (tog === "modal") {
                    e.preventDefault();
                    $.get(url,
                        function (data) {
                            $(
                                '<div class="modal hide fade">'
                                    + data + '</div>').modal({
                                    backdrop: "static"
                                });
                        });
                } else if (tog === "_blank") {
                    var tar = $(this).attr("data-target");
                    if (tar !== "_blank") {
                        e.preventDefault();
                        if (tar && tar != "") {
                            $.get(url, function (data) {
                                $(tar).html(data);
                            });
                        }
                    }
                }
            });
        adjustHeight();
    }

    function getLayer(txt, txtstyle) {
        txt = typeof (txt) != "undefined" ? txt : "";
        style = "";
        if (txt != "") {
            if (txtstyle) {
                for (var st in txtstyle) {
                    style += ";" + st.replace("_", "-") + ":"
                        + eval("txtstyle." + st);
                }
            }
            style = style == "" ? "" : style.substr(1);
            style = " style='" + style + "'";
        }
        id = "layer_" + new Date().getTime()
        $("<div id='" + id + "'><div id='hide'></div><div id='loading'><div class='layer-content'><img src='/public/images/loading.gif'/><span "
            + style + ">" + txt + "</span></div></div></div>").appendTo("body");
        return id;
    }

    function next(current) {
        var c = (parseInt(current) + 1);
        this.opts.urlPara.current = c;
        this.loadData();
    }

    function pre(current) {
        var c = (parseInt(current) - 1);
        this.opts.urlPara.current = c;
        this.loadData();
    }

    function loadcss() {
        $("head").append($("<link>").attr({
            rel: "stylesheet",
            type: "text/css",
            href: "/public/stylesheets/tableJs.css"
        }));
    }

    function init(opts) {
        loadcss();
        var opt = $.extend(this.opts, opts);
        var table = getTable("id='" + opt.id + "'");
        fillTableTitles(opt.titles, table.find("thead tr"));
        if ((typeof (opts.data) == "undefined" || opts.data.length == 0) && opts.url) {
            var layer = this.layer();
            $.ajax({
                type: "post",
                url: opts.url,
                data: opts.urlPara,
                dataType: "json",
                success: function (data) {
                    fillTableData(opt.titles, data, table.find("tbody"), opt.noneDataTip);
                    $(opt.container).html($("<div class='tableJs-container'></div>").append(table));
                    imgTooltip();
                    if (data.page) {
                        var page = getPagination(data.page.currentPage,
                            data.page.totalPage, data.page.totalRecord,
                            opt.id).appendTo($(opt.container));
                        setPageClickClass(page, data.page.currentPage,
                            data.page.totalPage);
                        pageClick();
                    }
                    $("#" + layer).remove();
                    opt.complete(table.find("tbody").find(
                        "tr td a[role=button]"));
                },
                error: function () {
                    $("#" + layer).remove();
                }
            })
        } else {
            fillTableData(opt.titles, opt.data, table.find("tbody"), opt.noneDataTip);
            $(opt.container).html($("<div class='tableJs-container'></div>").append(table));
            imgTooltip();
            if (opt.data.page) {
                page = getPagination(opt.data.page.currentPage,
                    opt.data.page.totalPage, opt.data.page.totalRecord,
                    opt.id);
                $(opt.container).append(page);
                setPageClickClass(page, opt.data.page.currentPage,
                    opt.data.page.totalPage);
                pageClick();
            }
            opt.complete(table.find("tbody").find("tr td a[role=button]"));
        }
        return this;
    }

    function imgTooltip() {
        $(".tableJS tbody tr td img.fieldImg").hover(function (e) {
            var _this = $(this);
            var src_ = _this.attr("src");
            var t = $(e.target);
            var x = t.offset().left;
            var y = t.offset().top;
            var img_ = new Image();
            img_.src = src_;
            img_ = $(img_).addClass("imgTooltip");
            $("body").append(img_);
            img_.load(function () {
                img_.css({
                    "left": x - $(this).width() - 10,
                    "top": y - ($(this).height() + _this.height()) / 2
                });
            });
        }, function () {
            $(".imgTooltip").remove();
        });
    }

    function getTable(id) {
        return $("<table "
            + id
            + " class=\"table table-striped table-bordered table-hover tableJS\"><thead><tr></tr></thead><tbody></tbody></table>");
    }

    function fillTableTitles(titles, head) {
        for (var i = 0; i < titles.length; i++) {
            if (titles[i].type == "checkbox") {
                $("<th scope='col' class='checkbox-th'></th>").append($("<input type='checkbox' data-name='check-" + titles[i].field + "'>").click(function () {
                    if ($(this).prop("checked")) {
                        $("input[type=checkbox][name='" + $(this).attr("data-name") + "']").prop("checked", true);
                    } else {
                        $("input[type=checkbox][name='" + $(this).attr("data-name") + "']").prop("checked", false);
                    }
                })).attr("title", titles[i].name).appendTo(head);
            } else {
                $("<th scope='col'>" + titles[i].name + "</th>").appendTo(head);
            }
        }
    }

    function setPageClickClass(page, current, total) {
        if (current == 1) {
            page.find("#pagination_pre").parent().addClass("disabled");
        } else {
            page.find("#pagination_pre").parent().removeClass("disabled");
        }
        if (current == total) {
            page.find("#pagination_next").parent().addClass("disabled");
        } else {
            page.find("#pagination_next").parent().removeClass("disabled");
        }
    }

    function loadData() {
        var table = $("table#" + this.opts.id).length > 0 ? $("table#"
            + this.opts.id) : $("table.table");
        var tb = table.find("tbody");
        var _this = this;
        tb.html("");
        var layer = this.layer();
        $.ajax({
            type: "post",
            url: this.opts.url,
            data: this.opts.urlPara,
            dataType: "json",
            success: function (data) {
                $("#" + layer).remove();
                fillTableData(_this.opts.titles, data, tb, _this.opts.noneDataTip);
                if (data.page) {
                    var c = data.page.currentPage, t = data.page.totalPage, tre = data.page.totalRecord;
                    var page = $("div#" + _this.opts.id + "_pagination");
                    page.attr("current", c);
                    page.find("b#" + _this.opts.id + "_current_total")
                        .html(c + "/" + t);
                    setPageClickClass(page, c, t);
                    $("#" + _this.opts.id + "_pagination_totalRecord")
                        .html(tre);
                }
                imgTooltip();
                _this.opts.complete(tb.find("tr td a[role=button]"));
            },
            error: function (e, r, t) {
                $("#" + layer).remove();
            }
        });
    }

    function fillTableData(title, data, tbody, noneDataTip) {
        var list = null;
        var page = {};
        if (typeof (data) != "undefined") {
            page = data.page ? data.page : page;
            list = data.list;
            if (typeof (list) == "undefined") {
                list = data;
            }
            if (typeof (list) == "string") {
                list = eval(list);
            }
        }
        if (list && list.length == 0) {
            var tr_ = $("<tr class='data_tr_'></tr>").appendTo(tbody);
            var tip = (noneDataTip) ? noneDataTip : "无数据可显示。";
            var _s = title.length;
            $("<tr class='data_tr_'></tr>").appendTo(tbody).append(
                "<td colspan='" + _s
                    + "'><i style='color:#aaa'>" + tip + "</i></td>");
        }
        if (list)
            for (var i = 0; i < list.length; i++) {
                var tr_ = $("<tr class='data_tr_'></tr>").appendTo(tbody);
                for (var j = 0; j < title.length; j++) {
                    if (!list[i] || list[i] == "") {
                        list[i] = "&nbsp;";
                    }
                    if (title[j].type == "No") {
                        $(
                            "<td>"
                                + ((page.currentPage - 1)
                                * page.displayCountOfPerPage + (i + 1))
                                + "</td>").appendTo(tr_);
                    } else if (title[j].type == "checkbox") {
                        var val_ = eval("list[i]." + title[j].field);
                        $("<td></td>").append($("<input type='checkbox' value='" + val_ + "' name='check-" + title[j].field + "'/>").click(function () {
                            if ($("input[name='" + $(this).attr("name") + "']:checked").length == $("input[name='" + $(this).attr("name") + "']").length) {
                                $("input[data-name='" + $(this).attr("name") + "'").prop("checked", true);
                            } else {
                                $("input[data-name='" + $(this).attr("name") + "'").prop("checked", false);
                            }
                        })).appendTo(tr_);
                    } else if (title[j].type == "convert") {
                        var da_ = title[j].data;
                        var td_ = $("<td></td>");
                        if (da_) {
                            var val_ = eval("list[i]." + title[j].field);
                            td_.html(da_[val_]);
                        }
                        td_.appendTo(tr_);
                    } else if (title[j].type == "image") {
                        var src;
                        try {
                            src = eval("list[i]." + title[j].field);
                        } catch (e) {
                            src = "";
                        }
                        var td_ = $("<td></td>");
                        if (src) {
                            $("<img class='fieldImg' src='" + src + "' />").error(function () {
                                $(this).attr("src", "");
                            }).appendTo(td_);
                        }
                        td_.appendTo(tr_);
                    } else if (title[j].type == "style") {
                        var style_;
                        try {
                            style_ = eval("list[i]." + title[j].field);
                        } catch (e) {
                        }
                        var td_ = $("<td></td>");
                        if (style_) {
                            if (style_.indexOf(".") == 0) {
                                style_ = "class=" + style_.substr(1);
                            } else if (style_.indexOf("#") == 0) {
                                style_ = "id=" + style_.substr(1);
                            } else {
                                style_ = "style='" + style_ + "'";
                            }
                            td_.append("<span " + style_ + "></span>");
                        }
                        td_.appendTo(tr_);
                    } else if (title[j].type == "operator") {
                        var ops = "";
                        titleLoop: for (var k = 0; k < title[j].data.length; k++) {
                            var d = title[j].data[k];
                            var hr = d.href;
                            if (hr && hr.indexOf("?") != -1) {
                                bf = hr.substr(0, hr.indexOf("?") + 1);
                                af = "";
                                para = hr.substr(hr.indexOf("?") + 1);
                                para = para.split("&");
                                for (var m = 0; m < para.length; m++) {
                                    if (para[m] in list[i]) {
                                        var pa = eval("list[i]." + para[m]);
                                        af += "&" + para[m] + "=" + pa;
                                    } else if (para[m].indexOf("shield_field") == 0) {
                                        var shield = para[m].split("=");
                                        shield[2] = shield[2] == "null" ? null : shield[2];
                                        if (eval("list[i]." + shield[1]) == shield[2]) {
                                            continue titleLoop;
                                        }
                                    } else {
                                        af += "&" + para[m];
                                    }
                                }
                                hr = bf + af.substr(1);
                            }
                            if (hr && hr.indexOf("{") != -1) {
                                hr = linkReplace(list[i], hr);
                            }
                            var tog = typeof (d.toggle) == 'undefined' ? "data-toggle='modal'"
                                : " data-toggle=\"" + d.toggle + "\"";
                            var tar = typeof (d.target) == 'undefined' ? ""
                                : " data-target=\"" + d.target + "\" target=" + d.target;
                            var drop = typeof (d.backdrop) == 'undefined' ? ""
                                : " data-backdrop=\"" + d.backdrop + "\" ";
                            var onclick = typeof (d.onclick) == 'undefined' ? ""
                                : " onclick=\"" + d.onclick + "\" ";
                            var cn = typeof (d.className) == 'undefined' ? "btn-info"
                                : d.className;
                            ops += " <a href=\"" + hr + "\" role=\"button\" "
                                + onclick + drop + " class=\"btn " + cn
                                + " btn-mini\" " + tog + tar + ">" + d.name
                                + "</a>";
                        }
                        $("<td>" + ops + "</td>").appendTo(tr_);
                    } else {
                        var str;
                        try {
                            str = eval("list[i]." + title[j].field);
                        } catch (e) {
                            str = "";
                        }
                        if (typeof (str) == "undefined" || str == 'undefined'
                            || str == null) {
                            str = "";
                        }
                        if (title[j].type == "join") {
                            join = title[j].data;
                            if (join && typeof (join) == "object") {
                                for (var n = 0; n < join.length; n++) {
                                    if(join[n].field){
                                        str += join[n].type
                                            + eval("list[i]." + join[n].field);
                                    }else{
                                        if(join[n].pos==1){
                                            var _t=join[n].text;
                                            _t+=str;
                                            str=_t;
                                        }else{
                                            str+=join[n].text;
                                        }
                                    }
                                }
                            }
                        }
                        $(
                            "<td title='" + title[j].name + ":" + str + "'>"
                                + str + "</td>").appendTo(tr_);
                    }
                }
            }
    }

    function linkReplace(dataJson, strLink) {
        var retValue = strLink;
        var matchs = retValue.match(/\{.*?\}/gi);
        for (var i = 0; i < matchs.length; i++) {
            retValue = retValue.replace(matchs[i], dataJson[matchs[i].replace(
                /\{*\}*/gi, '')]);
        }
        return retValue;
    }

    function getPagination(current, total, totalRecord, id) {
        return $("<div id='"
            + id
            + "_pagination' current="
            + current
            + ">"
            + "<ul class=\"pagination\"><li><a href=\"javascript:void(0)\" id='pagination_pre' >上一页</a></li>"
            + "<li class='active'><a href=\"javascript:void(0)\" style=\"color:#333;"
            + "cursor: default;background:#eee;border-color:#ccc;\"><i class='glyphicon glyphicon-list-alt'></i> 总数据 <b id='"
            + id
            + "_pagination_totalRecord'>"
            + totalRecord
            + "</b> 条</a></li>"
            + "<li class='active'><a href=\"javascript:void(0)\" id='current_page' "
            + "style=\"color:#0088cc;background:#eee;border-color:#ccc;"
            + "cursor: default;\"><b id='"
            + id
            + "_current_total'>"
            + current
            + "/"
            + total
            + "</b></a></li>"
            + "<li><a href=\"javascript:void(0)\" id='pagination_next'>下一页</a></li></ul></div>");
    }

    function pageClick() {
        $("a#pagination_pre").click(
            function () {
                if ($(this).parent().attr("class") != "disabled")
                    TableJS.prePage($(
                        "div#" + TableJS.opts.id + "_pagination").attr(
                            "current"));
            });
        $("a#pagination_next").click(
            function () {
                if ($(this).parent().attr("class") != "disabled")
                    TableJS.nextPage($(
                        "div#" + TableJS.opts.id + "_pagination").attr(
                            "current"));
            });
    }
})(this, document);