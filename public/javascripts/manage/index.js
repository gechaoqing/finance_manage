$(function(){
	$("#index ul li").click(function(){
		if($(this).hasClass("active")){
			return;
		}
		$("#index li.active").removeClass("active");
		$(this).addClass("active");
	});
});