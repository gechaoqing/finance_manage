var tableData;
$(function(){
	$.get($("#index ul li.active a").attr("href"),function(data){
		$("#main-content").html(data);
	});
	$("#index ul li a").click(function(e){
		e.preventDefault();
		if($(this).parent().hasClass("active")){
			return;
		}
		$("#index li.active").removeClass("active");
		$(this).parent().addClass("active");
        getHtml($(this).attr("href"));
	});
    function getHtml(url) {
        if(typeof(url)=='undefined'||url=="#"){
            return;
        }
        var l=TableJS.layer();
        $.get(url, function(res) {
            $("#main-content").html(res);
            $("#"+l).remove();
        });
    }
});