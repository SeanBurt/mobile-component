;(function($, window, document) {
	"use strict";
	//options
	let defaults = {
		duration: 3000,
		tips:'底部提示框',
		isAuto:true,
		width:'100%',
		height:50,
		position:'bottom'
	};
	//constructor
	function Toast($ele, options) {
		this.$ele = $ele;
		this.options = $.extend(defaults, options || {});
		this.init();
	}
	//prototype
	Toast.prototype = {
			constructor: Toast,
			init: function() {
				this.renderHtml();
				this.bindEvent();
				this.setSize();
				this.setPosition();
			},
			renderHtml: function() {
				let options = this.options,
					html = '';
				html+='<p class="toast-tip">'+options.tips+'</p>';
				this.$ele.html(html);
			},
			bindEvent: function() {
				this.options.isAuto && this.disappear();
			},
			disappear:function(){
				let that = this;
				let t = setTimeout(function(){
					that.$ele.fadeOut();
					clearTimeout(t);
				},this.options.duration);
			},
			//API
			setPosition:function(position){
				let ele = this.$ele,
					x = 0,
					y = 0,
					pTemp = this.options.position;
				pTemp=!position==true?pTemp:position;
				if(pTemp==='top'){
					x = 0;
					y = $(window).height()-ele.height();
				}else if(pTemp==='center'){
					x = ($(window).width()-ele.width())/2;
					y = ($(window).height()-ele.height())/2;
				}else if(pTemp==='bottom'){
					x = 0;
					y = 0;
				}
				ele.css({
					left:x,
					bottom:y
				});
				return this;
			},
			setSize:function(w,h){
				let options = this.options,
					wTemp = options.width,
					hTemp = options.height;
				wTemp=!w==true?wTemp:w;
				hTemp=!h==true?hTemp:h;
				let ele = this.$ele;
				ele.width(wTemp);
				ele.height(hTemp);
				ele.children().css('lineHeight',hTemp+'px');
				return this;
			},
			manualDisappear:function(){
				this.$ele.hide();
				return this;
			},
			manualShow:function(){
				this.$ele.show();
				return this;
			}
		}
		//Zepto prototype
	$.fn.toast = function(options) {
		//融合 defaults options 的属性
		options = $.extend(defaults, options || {});
		return new Toast($(this), options);
	};
})(Zepto, window, document);

