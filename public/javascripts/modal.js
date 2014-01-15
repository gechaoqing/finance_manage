(function(window, document) {
	var modalJs = window.modalJs = {
		close : modal_slideUp,
		response : res
	}
	var validate = window.validate = {
		empty : empty,
		num : num
	}
	function empty(input) {
		if (input.val().isEmpty()) {
			input.focus();
			return true;
		}
		return false;
	}
	function num(input) {
		input.keypress(function(e) {
			var w = e.which;
			return w >= 48 && w <= 57;
		}).paste(function(e) {
			return !clipboardData.getData('text').match(/\D/);
		}).dragenter(function() {
			return false;
		}).css("ime-mode", "disabled");
	}
	function res(res, callback) {
		if (res.responseCode == 0) {//ok
			$(".modal-header").html("<h3 class='modal-title'>处理完成</h3>");
			$(".modal-body").html(
					"<i class=' icon-info-sign' style='color:#0088cc;font-size:26px;vertical-align: middle;'></i> "
							+ res.response);
			$(".modal-footer").html(
					$("<span class='btn'>确定</span>").click(function(e) {
						e.preventDefault();
						modal_slideUp();
						if (callback && typeof (callback) == "function") {
							callback();
						}
					}));
		}
		else if(res.responseCode<=-1){//error
			$(".modal-header .alert.alert-error").remove();
			$('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">×</button><strong>有误!</strong> '+res.response+' </div>').css({"margin-bottom":0,"margin-top":0}).click(function(){
				$(this).slideUp('fast',function(){
					$(this).remove();
				});
			}).appendTo(".modal-header");
		}
	}
	function modal_slideUp(dur) {
		$(".modal").animate({
			height : 0,
			opacity : 0,
			top : "-=200"
		}, (typeof (dur) == "undefined" ? 300 : dur), function() {
			$(".modal-backdrop").remove();
			$(".modal").remove();
		});
	}
})(this, document);
$(function() {
	$(".modal-dialog button.close").click(function() {
		modalJs.close();
	});
	$('[data-dismiss="modal"]').click(function() {
		modalJs.close();
	});
	$('#cancel_C').click(function() {
		modalJs.close();
	})
});
