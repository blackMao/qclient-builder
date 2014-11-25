/**
 * @Overview  UI模块
 * 页面交互，通知状态
 */
(function(Q){
	'use strict';

	var $ = Q.$;
	var $skinlist = $('.skin-list');
	
	var ui = {
		init : function(model) {
			this.model = model;
			this.initEvent();
			this.initModelEvent();
		},
		
		initModelEvent: function() {
			var _this = this;
			
			this.model
				.on('setDownLoadFailed', function( e, key ){
					var $item = _this.getCurrentItem( key );
					_this.stopLoading( $item );
					$item.addClass('err');
				})
				.on('setDownLoadSuccess', function( e, key ){
					var $item = _this.getCurrentItem( key );
					_this.stopLoading( $item );
				})
				.on('setDownLoadStart', function( e, key ){
					var $item = _this.getCurrentItem( key );
					var $loading = $item.find('i span');
					var i = 0;
					$item.addClass('loading').removeClass('err hover');
					$item[0].timer = setInterval(function(){
						i = i >= 12 ? 0 : i;
						var x = -i*32 ;
						$loading.css('left' , x );
						i++;
					},100)
				})
				.on('setCurrentSkin', function( e, key ){
					var $item = _this.getCurrentItem( key );
					_this.stopLoading( $item );
					$item.addClass('selected').siblings().removeClass('selected');
				});
		},
		
		initEvent: function() {
			var _this = this;
			//Q.utils.disabledKey();
			
			$skinlist.on('click','a',function(){
				var $item = $(this).parent();
				if( $item.hasClass('loading') || $item.hasClass('selected')){
					return false;
				}
			});
			
			//hover状态
			$skinlist.on('mouseover','a',function(){
				var $parent = $(this).parent();
				(!$parent.hasClass('loading') && !$parent.hasClass('selected')) && $parent.addClass('hover');
			}).on('mouseout','a',function(){
				$(this).parent().removeClass('hover');
			});

			//图片延迟加载
			var $img = $skinlist.find('img');

			$img.lazyload({
				container: $skinlist
			});

			//初始化滚动条
			_this.scrollBar = new CusScrollBar({
				scrollDir:"y",
				contSelector: $skinlist ,
				scrollBarSelector:".scroll",
				sliderSelector:".slider",
				wheelBindSelector:".wrapper",
				wheelStepSize:151
				
			});
			_this.scrollBar._sliderW.hover(function(){ 
				$(this).addClass('cus-slider-hover');
			}, function(){
				$(this).removeClass('cus-slider-hover');
			})
			_this.scrollBar.on("resizeSlider",function(){
				$(".slider-bd").css("height",this.getSliderSize()-10);
			}).resizeSlider();
		},
		
		reload: function () {
			var _this = this;
			var $cur = [];
			$(".item").each(function(){
				if( $(this).css('display') == 'block' ){
					$cur.push($(this));
				}
			});
			$.each( $cur , function( index ){
				if( index <= 9 ){
					var $img = $(this).find('img');
					$img.attr('src',$img.attr('data-original'));
				}
			});
			if( $cur.length <=6 ){
				$(_this.scrollBar.options.scrollBarSelector).hide();
			}
			else{
				$(_this.scrollBar.options.scrollBarSelector).show();
			}
			$(_this.scrollBar.options.sliderSelector).css('top',0);
			_this.scrollBar.resizeSlider().scrollToAnim(0);
		},
		
		LoadCatgory : function( type ){
			if( type && type!="all" ){
				var $items = $skinlist.find('.item[data-type="'+ type +'"]');
				$skinlist.find('.item').hide();
				$items.fadeIn(100);
			}
			else{
				$skinlist.find('.item').fadeIn(100);
			}
			this.reload();
		},
		
		setErrByLevel : function(){
			console&&console.log('等级不符，快去升级吧！');
		},
		
		getCurrentItem: function( key ){
			return $skinlist.find('.item[data-key="'+ key +'"]');
		},
		
		stopLoading : function( $item ){
			if( $item.hasClass('loading') ){
				clearInterval($item[0].timer);
				$item[0].timer = null;
				$item.removeClass('loading');
				$item.find('i span').css('left','0');
			}
		}
	};

	Q.ui.changeSkin = {
		init : function() {
			ui.init.apply(ui, arguments);
		}
	};
})(QClient);