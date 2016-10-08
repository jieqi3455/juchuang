
	var companyClass;
	$(document).ready(function(){
		companyClass = new companyFn();

		companyClass.focusList({
			targetEl:$('.focus_img_list li'),
			from:$('.focus_img_idx li')
		})		

		companyClass.init();
	})

	function refresh(e){
		var link = $(e).attr('href');
		var html = link.split('#')[0];
		html = _.last(html.split('/'));
		var pathname = location.pathname;
		var pathArry = pathname.split('/');
		if($.browser.msie && $.browser.version==6.0){
				pathArry = pathname.split('/');

				pathArry = _.last(pathArry);
				pathArry = pathArry.split('\\');
		}
		var curHtml = _.last(pathArry);

		if(html===curHtml){
			window.location = link;
			location.reload();
		}
	}



