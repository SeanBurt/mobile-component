(function($) {
	$.extend($.fn, {
		fadeIn: function(ms) {
			if(typeof(ms) === 'undefined') {
				ms = 250;
			}
			$(this).css({
				display: 'block',
				opacity: 0
			}).animate({
				opacity: 1
			}, ms);
			return this;
		},
		fadeOut:function(ms){
			if(typeof(ms) === 'undefined') {
				ms = 250;
			}
			$(this).css({
				display: 'block',
				opacity: 1
			}).animate({
				opacity: 0
			}, ms);
			return this;
		}
	});
})(Zepto);

