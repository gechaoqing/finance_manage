$(function(){
	$(".login-btn").click(function(){
		if(validated()){
			$(".form-signin").submit();
		}
	});
	$(".volidecode").click(function(){
        var img=new Image();
        var _this=$(this);
        img.src="verifyCode?id="+$("input[name=randomID]").val()+"&time="+ new Date().getTime();
        _this.html("");
        img.onload=function(){
            _this.append(img);
        }
	})
	function validated(){
		if($("input[name='account']").val().isEmpty()){
			$(".response-text").html("没有输入登录账户");
			$("input[name='account']").focus();
			return false;
		}
		if($("input[name='pass']").val().isEmpty()){
			$(".response-text").html("没有输入登录密码");
			$("input[name='pass']").focus();
			return false;
		}
		if($("input[name='code']").val().isEmpty()){
			$(".response-text").html("没有输入验证码");
			$("input[name='code']").focus();
			return false;
		}
		return true;
	}
	$("input[name='pass']").keypress(function(e){
		var k=e.which;
		if(k===13){
			$(".login-btn").click();
		}
	});
	$("input[name='account']").keypress(function(e){
		var k=e.which;
		if(k===13){
			$(".login-btn").click();
		}
	});
    $("input[name='code']").keypress(function(e){
        var k=e.which;
        if(k===13){
            $(".login-btn").click();
        }
    });
});