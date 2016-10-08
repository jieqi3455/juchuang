function companyFn(){
	this.newsData = $.extend(true,{},newsData);
	this.modelKey = this.getValueByPart('model');
	this.typeKey = this.getValueByPart('type');
	this.listKey = this.getValueByPart('list');	
	$('a').bind("focus", function(){
	    $(this).blur();
	})	
}
companyFn.prototype = {
	init:function(){
		this.mainMenuCur();

	},
	// 首页初始化
	indexInit:function(){
			var newsData = this.newsData;
			var curJson = newsData;
			var index = 0;

			$('.model_box_wrap').html('');
			
			_.each(curJson,function(obj,key){
				
				var modelKey = key;
				var modelName = obj.name;
				var subObj = obj.submenu;
				var tplModel = _.template($("#newsListTpl").html());
				var arry = index%3;
				var firstData = subObj[0];
				var firstList = firstData.list;

				if(!firstList){
					var moreLink = "content.html#model:"+modelKey+"/type:"+firstData.key
				}else{
					var firstListKey = _.keys(firstList)[0];
					var moreLink = "sublist.html#model:"+modelKey+"/type:"+firstData.key;
				}
				if(arry===0){
					wrap = '<div class="news_list_box clearfix"></div>';
					wrap = $(wrap);
					$('.model_box_wrap').append(wrap);
				}

				tplModel = $(tplModel({modelName:modelName,moreLink:moreLink}));
				
				wrap.append(tplModel);
				index +=1;
				_.each(subObj,function(subobjval,index){
					var typeKey = subobjval.key;
					var date = subobjval.date;
					var list = subobjval.list;
					if(!list){
						// 子菜单
						var linkTxt= subobjval.linkTxt;
						var hrefStr = "content.html#model:"+modelKey+"/type:"+typeKey;
						var subtpl = _.template($("#itemTpl").html());

						subtpl = subtpl({linkTxt:linkTxt,linkHref:hrefStr,linkDate:date});
						subtpl = $(subtpl);
						tplModel.find('.model_list').append(subtpl);
					}else{
						// 子列表
						_.each(list,function(listObj,key){
							var listkey = key;
							var listTittle = listObj.title;
							var listDate = listObj.date;
							var hrefStr = "content.html#model:"+modelKey+"/type:"+typeKey+"/list:"+listkey;
							var subtpl = _.template($("#itemTpl").html());

							subtpl = subtpl({linkTxt:listTittle,linkHref:hrefStr,linkDate:listDate});
							subtpl = $(subtpl);
							tplModel.find('.model_list').append(subtpl);							
						})
					}
				})
			})		
	},
	// 内容页初始化
	contentInit:function(){
		this.creatAsideMenu();
		this.creatContent();

	},
	// 列表页初始化
	subListInit:function(){
		var newsData = this.newsData;
		var curData = newsData[this.modelKey];
		var curDataItem = curData.submenu;
		curDataItem = _.where(curDataItem,{key:this.typeKey});
		this.creatAsideMenu();
		this.creatSubList();
		$(".article_head").text(curDataItem[0].name);

	},
	// 生成内容
	creatContent:function(){
		var that = this;
		var newsData = this.newsData;
		$.get("news.html",function(xml){
			var modelKey = that.modelKey;
			var typeKey = that.typeKey;
			var listKey = that.listKey;
			var curData = newsData[modelKey];
			var submenu = curData.submenu;
			var curDataItem = _.where(submenu,{key:typeKey});
			
			var date = '';
			var headTpl = _.template($("#tplNewsHead").html());
			typeKey = typeKey?typeKey:'';
			listKey = listKey?listKey:'';

			var newsId = modelKey+typeKey+listKey;
			var newsBody = $(xml).find('#'+newsId);
			var title = newsBody.find('.titleName').html();
			var content = newsBody.find('.content').html();			
			
			curDataItem = curDataItem[0];

			$(".article_head").text(curDataItem.name);

			if(listKey){
				var newsTitle = curDataItem.list[listKey].title;
				date = curDataItem.list[listKey].date;
			}else{
				var newsTitle = curDataItem.name;
				date = curDataItem.date;
			}
			date = date?date:'';
			title = title?title:newsTitle;
			content = content?content:'<div style="text-align:center;">暂无数据</div>';
	
			headTpl = headTpl({newsTitle:title,newsDate:date});

			$(".article_title").html('');
			$(".article_title").append(headTpl);
			$(".article_content").html(content);
		})
	},
	// 创建侧边栏
	creatAsideMenu:function(){

		var newsData = this.newsData;
		var model = this.modelKey;
		var curData = newsData[model];
		var submenu = curData.submenu;
		var modelName = curData.name;
		var curLevel = this.modelKey+this.typeKey;

		var titleTpl = _.template($('#asideTitleTpl').html());
		if(!submenu){
			return;
		}

		$('.aside_title').html('');
		$('.aside_list').html('');

		titleTpl = titleTpl({modelName:modelName});
		$('.aside_title').append(titleTpl);
		_.each(submenu,function(valObj,idx){
			var menuName = valObj.name;
			var menuKey = valObj.key;
			var list = valObj.list;
			var hrefStr= '';
			var menuTpl = _.template($('#asideMenuTpl').html());
			var id = 'aside'+model+menuKey;
			if(list){
				hrefStr = 'sublist.html#model:'+model+'/type:'+menuKey;
			}else{
				hrefStr = 'content.html#model:'+model+'/type:'+menuKey;
			}

			menuTpl = menuTpl({hrefStr:hrefStr,menuName:menuName,id:id});
			menuTpl = $(menuTpl);

			$('.aside_list').append(menuTpl);

			if(id==='aside'+curLevel){
				menuTpl.addClass('cur');
			}

		})
	},
	// 创建列表
	creatSubList:function(){
		var listTpl = _.template($('#sublistTpl').html());
		var newsData = this.newsData;
		var typeKey = this.typeKey;
		var modelKey = this.modelKey;
		var curData = newsData[modelKey];
		var submenu = curData.submenu;
		$('.news_title_list').html('');
		_.each(submenu,function(listData,index){
			var listData = listData.list;
			var idx = 0;
			_.each(listData,function(obj,key){
				var date = obj.date;
				var title = obj.title;
				var hrefStr = 'content.html#model:'+modelKey+'/type:'+typeKey+'/list:'+key;
				
				idx+=1;
				// console.log(arguments)
				var tpl = listTpl({idx:idx,date:date,title:title,hrefStr:hrefStr});
				$('.news_title_list').append(tpl);
			})
		})
	},

	// 判断hash
	getValueByPart:function(e){
		var d=location.hash,
			d = d.substr(1),
			c=d.split("/"),
			b=c.length,
			h="",
			g,f;
			for(f=0;f<b;f++){
				g=c[f].split(":");
				if(g.length===1){continue}
				if(g[0]===e){h=g[1];break}
			}
			return h;		
	},

	// 菜单定位
	mainMenuCur:function(){
		var id = 'main_'+this.modelKey;
		if(!this.modelKey){
			return;
		}
		$('.index_menu td').removeClass('cur_menu');
		$('.index_menu').find('#'+id).closest('td').addClass('cur_menu');

	},

	tabMenu:function(option){
		var curClass = option.cls?option.cls:'cur';
		var from = option.from;
		var callback = option.callback;
		var target = option.target;
		var events = option.events;
		var moveout = option.moveout?option.moveout:false;
		var moveoutFn = option.moveoutFn;

		$(target).hide();
		$.each(from,function(index){
			if($(this).hasClass(curClass)){
				$(target).eq(index).show();
				if(callback){
					callback(index);
				}				
			}
		})
		function hideShowFn(el,index){
			if(el.hasClass(curClass)){
				return;
			}
			from.removeClass(curClass);
			el.addClass(curClass);

			$(target).hide();
			$(target).eq(index).show();

			if(callback){
				callback(index);
			}
					
		}

		$.each(from,function(index){
			var num = index;

			if(events==='hover'){
				$(this).hover(function(e){
					e.preventDefault();
					hideShowFn($(this),index);
				},function(e){
					e.preventDefault();

					if(moveout){
						hideShowFn($(this),index);
						$(this).removeClass(curClass);
						$(target).eq(index).hide();						
					}

					if(moveoutFn){
						moveoutFn();
					}
				})	
				return;	
			}

			$(this).bind(events,function(e){
				e.preventDefault();
				hideShowFn($(this),index);
			})

		})
	},
	// 焦点图
	focusList:function (arg) {
		var targetEl = arg.targetEl;
		var events = arg.events;
		var from = arg.from;
		var len = targetEl.length;
		var initEq = 0;
		var that = this;

		function toggleTarget(index){

			targetEl.eq(initEq).hide();
			from.eq(initEq).removeClass('cur');
			from.eq(initEq+1).addClass('cur');
			targetEl.eq(initEq+1).show();
		}

		function animateFn(){
			that.focusListTime = setInterval(function(){

				if(initEq===len-1){
					targetEl.eq(initEq).hide();
					targetEl.eq(0).show();
					from.eq(initEq).removeClass('cur');
					from.eq(0).addClass('cur');				
					initEq = 0;
					return;
				}

				toggleTarget(initEq);
				initEq+=1;

			},2000);			
		}

		animateFn();

		from.hover(function(){
			var index = from.index($(this));
			initEq = index;
			from.removeClass('cur')
			$(this).addClass('cur');
			targetEl.hide();
			targetEl.eq(index).show();
			clearInterval(that.focusListTime);
		},function(){
			animateFn();
		})
	}
}
