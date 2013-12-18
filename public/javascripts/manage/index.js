$(function(){
	$.get($("#index ul li.active a").attr("href"),function(data){
		$("#main-content").html(data);
	});
	$("#index ul li").click(function(e){
		e.preventDefault();
		if($(this).hasClass("active")){
			return;
		}
		$("#index li.active").removeClass("active");
		$(this).addClass("active");
	});
});