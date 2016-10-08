$.fn.focusList = function (option) {
	var o = {
		initIndex : 0,
		autoPlay : false,
		duration : 3000
	};
	$.extend(o, option);
	$.each(this, function (idx, ele) {
		var me = $(ele),
			wrap = me.find(".wrap"),
			list = wrap.find("li"),
			nav = $('<ul class="navs" />'),
			prevArrow = $('<a href="javascript:void(0);" class="arrow arrow_prev">&lt;</a>'),
			nextArrow = $('<a href="javascript:void(0);" class="arrow arrow_next">&gt;</a>'),
			index,
			timer;
		if (list.length <= 1) {
			return;
		}
		list.each(function () {
			var imgsrc = $(this).find('img').attr('src');
			nav.append($('<li><a href="#"><img src="'+ imgsrc +'" width="71" height="47" /></a><span class="mask"></span></li>'));
		});
		wrap.after(nextArrow).after(prevArrow).after(nav);
		nav.find("a").click(function (e) {
			list.eq(index).stop();
			e.preventDefault();
			var link = $(this),
				cur = list.filter(".current");
			index = link.parent().index();
			cur.hide().css("opacity", "0.4").removeClass("current");
			list.eq(index).css("opacity", "0.4").show().animate({"opacity":"1"},600).addClass("current");
			nav.find(".cur").removeClass("cur");
			link.parent().addClass("cur");
		});

		function init() {
			list.hide();
			nav.find("a").eq(o.initIndex).click();
			if (o.autoPlay) {
				autoplay();
				me.hover(function () {
					window.clearInterval(timer);
				},function () {
					autoplay();
				});
			}
		}

		function prev() {
			var idx = index == 0 ? list.length-1 : index-1;
			nav.find("a").eq(idx).click();
		}

		function next() {
			var idx = (index+1) % list.length;
			nav.find("a").eq(idx).click();
		}

		prevArrow.click(prev);
		nextArrow.click(next);

		function autoplay() {
			timer = window.setInterval(function () {
				next();
			}, o.duration);
		}

		init();
	});
};

$.fn.tabMenu = function (options) {
	var o = {  // 缺省设置
		type : "click",  // 事件类型
		currentClass : "cur",  // 切换的当前类
		tabListItem : null,  // 导航列表项 (如：tablist中的项)
		targetBoxItem : null,  // 切换目标列表项 (如：detailBox中的项)
		currentIndex : 0,  // 初始化索引
		callback : null  // 回调函数
	}
	for (var p in options) {  // 载入自定义设置
		o[p] = options[p];
	}
	$.each(this, function (idx, element) {
		var ele = $(element),
			tabListItem = typeof o.tabListItem=="function" ? o.tabListItem(ele) : o.tabListItem,
			targetBoxItem = typeof o.targetBoxItem=="function" ? o.targetBoxItem(ele) : o.targetBoxItem;
		if (o.tabListItem.length < o.currentIndex + 1) {
			o.currentIndex = 0;
		}
		targetBoxItem.each(function () {
			var cur = $(this);
			cur.data("position", cur.css("position"));
			cur.data("visibility", cur.css("visibility"));
			cur.data("left", cur.css("left"));
			cur.data("top", cur.css("top"));
		});
		function skipToItem(idx) {  // 跳转函数
			var idx_2 = idx;
			tabListItem.removeClass(o.currentClass);
			targetBoxItem.each(function () {
				var cur = $(this);
				cur.css({
					"position" : "absolute",
					"visibility" : "hidden",
					"left" : "-9999px",
					"top" : "0"
				});
			});
			tabListItem.eq(idx).addClass(o.currentClass);
			if (idx_2+1 > targetBoxItem.length) {
				idx_2 = targetBoxItem.length-1;
			}
			var curItem = targetBoxItem.eq(idx_2);
			curItem.css({
				"position" : curItem.data("position"),
				"visibility" : "visible",
				"left" : curItem.data("left"),
				"top" : curItem.data("top")
			});
			if (o.callback != null && typeof o.callback == "function") {
				o.callback(idx);
			}
		}

		skipToItem(o.currentIndex);  // 初始化项目

		tabListItem.each(function (idx, element) {
			var ele = $(element);
			if (element.tagName.toLowerCase() != "a") {
				ele = $(element).find("a").eq(0);
			}
			ele[0].hideFocus = true;
			ele.css("outline", "0 none");
			ele[o.type](function (event) {  // 添加事件
				skipToItem(idx);
				event.preventDefault();
			});
		});
	})
};

/* 滚动 */
$.fn.rolling = function (option) {
	var o = {
		style : $.rollStyle.slider_01,
		item : "li",
		skip : 1,
		autoPlay : true,
		duration : 600,
		delay : 3000,
		callback : null
	};
	$.extend(o, option);

	$(this).each(function (idx, ele) {
		var me = $(ele),
			wrap = me.find(".wrap").eq(0),
			ww = wrap.innerWidth(),
			target = wrap.children(),
			tw = target.outerWidth(),
			tarCount = 1,
			out,
			items,
			autoPlayFn;
		out = target.wrapAll('<div class="roll_outer" style="position:relative; overflow:hidden; zoom:1;" />').parent();

		if (wrap.find(o.item).length === 0) {
			return;
		}

		function cloneTarget() {
			out.append(target.clone().addClass("clone"));
			out.prepend(target.clone().addClass("clone"));
			tarCount += 2;
			out.width(tarCount * tw);
		}

		var initClone = wrap.find(o.item).length % o.skip;
		if (initClone > 1) {
			cloneTarget();
		}

		do {
			cloneTarget();
		} while(out.width() < ww*4);

		target.addClass("sourceRoll");

		var eles = {
			target : me,
			source : target,
			wrap : wrap,
			out : me.find(".roll_outer").eq(0),
			items : out.find(o.item),
			copy : out.find(".clone").eq(0)
		};
		o.style(eles, o);

		autoPlayFn = me.data("autoPlayFn");

		if (autoPlayFn && typeof autoPlayFn === "function") {
			autoPlayFn();
			me.hover(
				function () {
					o.autoPlay = false;
					autoPlayFn();
				},
				function () {
					o.autoPlay = true;
					autoPlayFn();
				}
			);
		}
	});
};
/* 滚动类型 */
$.rollStyle = {};

$.rollStyle.slider_01 = function (eles, param) {
	var me = eles.target,
		out = eles.out,
		outSrc = out[0],
		wrapW = out.parent().width(),
		//items = out.find("items").eq(0),
		copy = eles.copy,
		mal = 0,
		copyW = copy.width(),
		diffOfl,
		timer;

	if (copyW > wrapW) {
		diffOfl = copyW;
	} else {
		diffOfl = Math.ceil(wrapW/copyW)*copyW;
	}
	
	outSrc.style.left = 0;
	function autoPlay() {
		if (timer) {
			window.clearInterval(timer);
		}
		if (param.autoPlay) {
			timer = window.setInterval(function () {
				if (mal === -diffOfl) {
					outSrc.style.left = 0;
					mal = 0;
				}
				mal -= 1;
				outSrc.style.left = mal + "px";
			}, param.duration);
		}
	}
	me.data("autoPlayFn", autoPlay);
};

$().ready(function () {
	$(".placeholder").each(function () {
		var c = $(this);
		if (c.data("placeholder") == "true") {
			return;
		}
		c.data("color", c.css("color"));
		if (this.value == this.defaultValue) {
			c.css("color", "#CCCCCC");
		}
		c.focus(function () {
			if (this.value == this.defaultValue) {
				this.value = "";
				c.css("color", c.data("color"));
			}
		}).blur(function () {
			if (this.value == "") {
				this.value = this.defaultValue;
				c.css("color", "#CCCCCC");
			}
		});
		c.data("placeholder","true");
	});
});