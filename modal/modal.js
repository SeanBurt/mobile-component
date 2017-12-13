;(function($, window, document) {
	"use strict";
	//options
	let defaults = {

	};
	//constructor
	function Modal($ele, options) {
		this.$ele = $ele;
		this.options = $.extend(defaults, options || {});
		this.init();
	}
	//prototype
	Modal.prototype = {
		constructor: Modal,
		init: function() {
			this.bindEvent();
		},
		bindEvent: function() {

		},
		show: function() {
			let ele = this.$ele;
			$('body').append('<div class="modal-backdrop fade"></div>');
			ele.show();
			setTimeout(function() {
				$('.modal-backdrop').addClass('show');
				ele.addClass('show');
			}, 100);
		},
		hide: function() {
			let ele = this.$ele;
			ele.removeClass('show');
			$('.modal-backdrop').removeClass('show');
			setTimeout(function() {
				ele.hide();
				$('.modal-backdrop').remove();
			}, 300);
		}
	};
	//zepto prototype
	$.fn.modal = function(options) {
		//融合 defaults options 的属性
		options = $.extend(defaults, options || {});
		return new Modal($(this), options);
	};
})(Zepto, window, document);

