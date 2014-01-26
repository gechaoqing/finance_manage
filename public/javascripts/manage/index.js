var tableData;
function parseEq(eq){
    return eq=="="?'':eq=="&gt;"||eq==">"?">":"<";
}
$(function(){
	$.get($("#index ul li.active a").attr("href"),function(data){
		$("#main-content").html(data);
	});
	$("#index ul li a").click(function(e){
		e.preventDefault();
		if($(this).parent().hasClass("active")){
			return;
		}
        if($(this).hasClass("logout")){
            window.location.href="/manager/logout";
        }else{
            $("#index li.active").removeClass("active");
            $(this).parent().addClass("active");
            getHtml($(this).attr("href"));
        }
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