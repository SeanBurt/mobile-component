;(function($, window, document) {
	"use strict";
	//option
	var defaults = {
		indicators: 3,
		instructions: ['可使用', '已使用', '已过期'],
		duration:20,
		distance:60
	};
	//constructor
	function Slider($ele, options) {
		this.$ele = $ele;
		this.options = $.extend(defaults, options || {});
		this.init();
	}
	Slider.prototype = {
		//构造函数
		constructor: Slider,
		touch: ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,
		init: function() {
			this.renderHtml();
			if(!!this.touch) {
				this.bindEvent();
			}
		},
		renderHtml: function() {
			var options = this.options,
				html = [];
			html.push('<div class="slider-indicator">');
			for(var i = 0, l = options.instructions.length; i < l; i++) {
				if(i === 0) {
					html.push('<a class="slider-indicator-item slider-active">' + options.instructions[i] + '</a>');
				} else {
					html.push('<a class="slider-indicator-item">' + options.instructions[i] + '</a>');
				}
			}
			html.push('</div><div class="slider-bar"></div><div class="slider-content"></div>');
			this.$ele.html(html.join(''));
			this.setWidth($('.slider-indicator-item'));
			this.setWidth($('.slider-bar'));
			this.setCotentHeight($('.slider-content'));
			this.sliderContent = window.document.getElementsByClassName('slider-content')[0];
		},
		bindEvent: function() {
			console.log('bind event');
			this.sliderContent.addEventListener('touchstart', this.handleEvents, false);
		},
		//设置指示器，下滑条宽度
		setWidth: function(obj) {
			var options = this.options,
				width = $(document).width() / options.indicators;
			$(obj).width(width);
		},
		//设置内容高度
		setCotentHeight: function(obj) {
			$(obj).height($(document).height() - $('.slider-indicator').height() - $('.slider-bar').height());
		},
		//滑动处理事件
		handleEvents: function(event) {
			//this指触发事件的对象
			if(event.type == 'touchstart') {
				slider.start(event);
			} else if(event.type == 'touchmove') {
				slider.move(event);
			} else if(event.type == 'touchend') {
				slider.end(event);
			}
		},
		//开始滑动
		start: function(event) {
			//touches数组对象获得屏幕上所有的touch，取第一个touch
			var touch = event.targetTouches[0];
			//取第一个touch的坐标值
			this.startPos = {
				x: touch.pageX,
				y: touch.pageY,
				time: +new Date
			};
			this.sliderContent.addEventListener('touchmove', this.handleEvents, false);
			this.sliderContent.addEventListener('touchend', this.handleEvents, false);
			touch = null;
		},
		//移动
		move: function(event) {
			//当屏幕有多个touch或者页面被缩放过，就不执行move操作
			if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
			var touch = event.targetTouches[0];
			this.endPos = {
				x: touch.pageX - this.startPos.x,
				y: touch.pageY - this.startPos.y
			};
			//isScrolling为1时，表示纵向滑动，0为横向滑动
			this.isScrolling = Math.abs(this.endPos.x) < Math.abs(this.endPos.y) ? 1 : 0;
			if(this.isScrolling === 0) {
				//阻止触摸事件的默认行为，即阻止滚屏
				event.preventDefault();
			}
			touch = null;
		},
		//滑动释放
		end: function(event) {
			//未滑动
			if(!this.endPos) {
				return;
			}
			//滑动的持续时间
			var duration = +new Date - this.startPos.time;
			//当为水平滚动时
			if(this.isScrolling === 0) {
				if(Number(duration) > this.options.duration) {
					//判断是左移还是右移，当偏移量大于10时执行
					if(this.endPos.x > this.options.distance) {
						console.log('right');
					} else if(this.endPos.x < -this.options.distance) {
						console.log('left');
					}
				}
			} else {
				if(Number(duration) > this.options.duration) {
					//判断是上移还是下移，当偏移量大于10时执行
					if(this.endPos.y > this.options.distance) {
						console.log('down');
					} else if(this.endPos.y < -this.options.distance) {
						console.log('top');
					}
				}
			}
			this.endPos = null;
			this.startPos = null;
			//解绑事件
			this.sliderContent.removeEventListener('touchmove', function() {}, false);
			this.sliderContent.removeEventListener('touchend', function() {}, false);
		}
	};
	//JQuery原型
	$.fn.slider = function(options) {
		//融合 defaults options 的属性
		options = $.extend(defaults, options || {});
		return new Slider($(this), options);
	};
})(jQuery, window, document);

