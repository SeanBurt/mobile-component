; (function (win, doc, $) {
  'use strict'

  var defaluts = {
    duration: 20,
		distance: 50,
    imgs: [],
    articles: [],
    index: 1
  }

  function ImgBox(opts, ele) {
    this.opts = opts
    this.$ele = $(ele)
    this.init()
  }

  ImgBox.prototype = {
    constructor: ImgBox,
    touchDirection: 0,//滑动方向：1右 2左 3下 4上
    xOffset: 0,//横向偏移距离
    yOffset: 0,//纵向偏移距离
    init: function () {
      this.render();
      this.bind();
    },
    render: function () {
      var htm = '';
      for(var i=0,l=this.opts.imgs.length; i<l; i++) {
        htm = htm + '<div class="ib-item"><img src="' + this.opts.imgs[i]
              + '" alt="imgbox" class="ib-item-content"></div>'
      }
      $('.ib-container').append(htm);
    },
    show: function(index) {
      this.opts.index = index;
      $('.ib-mask').css('opacity','1');
      this.$ele.show();
      this.resetIndicator();
      this.resetView();
    },
    bind: function() {
      var _self = this;
      $('.ib-close').click(function() {
        // _self.$ele.css('opacity','0');
        $('.ib-mask').css('opacity','0');
        $('.ib-item').attr('style','');
        _self.$ele.hide();
      })
      //绑定滑动
      $('.ib-container').on('touchstart', function (e) {
        _self.handleTouch(e, _self);
      }).on('touchmove', function (e) {
        _self.handleTouch(e, _self);
      }).on('touchend', function (e) {
        _self.handleTouch(e, _self);
      });
    },
    //重置显示内容
    resetView: function() {
      this.xOffset = $(doc).width(); 
      this.imgsPos = []
      var selector = '.ib-item:nth-child('

      for(var i=this.opts.index; i>0; i--) {
        this.imgsPos.push({
          x: -(i-1)*this.xOffset,
          y: this.yOffset,
          z: 0
        })
      }
      for(var j=this.opts.index; j<this.opts.imgs.length; j++) {
        this.imgsPos.push({
          x: (j-this.opts.index+1)*this.xOffset,
          y: this.yOffset,
          z: 0
        })
      }

      var winHeight = $(win).height()
      var indicatorHeight = $('.ib-bar').height()
      var captionHeight = $('.ib-caption').height()
      var contentHeight = winHeight-indicatorHeight-captionHeight
      var imgHeight = 0
      var tmpImg =  null
      
      for(var k=0;k<this.opts.imgs.length;k++) {
        tmpImg = $('.ib-container').children(selector + (k+1) + ')')
        //图片高度>=(窗体高度-指示器高度-文字描述高度)时图片进行等高比缩放
        imgHeight = tmpImg.children().height()
        if(imgHeight >= contentHeight) {
          this.imgsPos[k].y = indicatorHeight
          tmpImg.children().css('width','86%')
        }else {
          this.imgsPos[k].y = (winHeight-imgHeight) / 2;
        }

        tmpImg.css({'transform':'translate3d('+ this.imgsPos[k].x +'px, '+ this.imgsPos[k].y +'px, 0)'})
      }    
      
      this.opts.articles && this.opts.articles.length && $('.ib-caption').text(this.opts.articles[this.opts.index-1]);
    },
    //切换显示内容
    changeView: function(direction) {
      var offset = 0;
      var tmpIndex = 0;
      switch (direction) {
        case 1:
          offset = this.xOffset;
          tmpIndex = -1;
          break;
        case 2:
          offset = -this.xOffset;
          tmpIndex = 1;
          break;
        case 3:
          break;
        case 4:
          break;
        default:
          break;
      }

      var selector = '.ib-item:nth-child('
      for(var i=0,l=this.opts.imgs.length; i<l; i++) {
        this.imgsPos[i].x += offset;
        //左右极限判断禁止滑动
        if(this.imgsPos[0].x > 0 || this.imgsPos[0].x < -(this.xOffset*(this.opts.imgs.length-1))) {
          this.imgsPos[0].x -= offset;
          return;
        }
        $('.ib-container').children(selector + (i+1) + ')').css({'transform':'translate3d('+ this.imgsPos[i].x +'px, '+ this.imgsPos[i].y +'px, 0)','transition':'transform 300ms ease'})
      }
      this.opts.index += tmpIndex;
      this.changeIndicator(this.opts.index);
      this.opts.articles && this.opts.articles.length && $('.ib-caption').text(this.opts.articles[this.opts.index-1]);
    },
    //重置指示器
    resetIndicator: function() {
      $('.ib-counter').text(this.opts.index + ' / ' + this.opts.imgs.length)
    },
    //切换指示器
    changeIndicator: function(index) {
      $('.ib-counter').text(index + ' / ' + this.opts.imgs.length)
    },
    startTouch: function(e){
			var touch = e.targetTouches[0];
			this.startPos = {
				x: touch.pageX,
				y: touch.pageY,
				time: +new Date
			};
    },
    moveTouch: function(e) {
      //当屏幕有多个touch或者页面被缩放过，就不执行move操作
			if(e.targetTouches.length > 1 || e.scale && e.scale !== 1) return;
			var touch = e.targetTouches[0];
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
    },
    endTouch: function() {
      //未滑动
			if(!this.endPos) {
				return;
			}
			//滑动的持续时间
			var duration = +new Date - this.startPos.time;
			//当为水平滚动时
			if(this.isScrolling === 0) {
				if(Number(duration) > this.opts.duration) {
					if(this.endPos.x > this.opts.distance) {
            this.touchDirection = 1;
						console.log('right');
					} else if(this.endPos.x < -this.opts.distance) {
            this.touchDirection = 2;
						console.log('left');
					}
				}
			} else {
				if(Number(duration) > this.opts.duration) {
					if(this.endPos.y > this.opts.distance) {
            this.touchDirection = 3;
						console.log('down');
					} else if(this.endPos.y < -this.opts.distance) {
            this.touchDirection = 4;
						console.log('top');
					}
				}
			}

      this.changeView(this.touchDirection)
    },
    //处理touch事件
    handleTouch: function(e,_self) {
			if(e.type == 'touchstart') {
				_self.startTouch(e);
			} else if(e.type == 'touchmove') {
				_self.moveTouch(e);
			} else if(e.type == 'touchend') {
				_self.endTouch(e);
			}
		},
    destroy: function() {
      if(!!this.touch) {
				$('.ib-container').off('touchstart').off('touchmove').off('touchend');
			}
      this.imgsPos = null
    }
  }

  $.fn.imgbox = function (opts) {
    opts = $.extend(defaluts, opts || {})
    return new ImgBox(opts, this)
  }
})(window, document, Zepto || JQuery)
