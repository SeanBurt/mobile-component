;(function($){
    var defaults = {
        len:120
    };
    function ViewTxt(opts,ele) {
        this.opts = opts || {};
        this.$ele = ele;
        this.contents = [];
        this.init();
    }
    ViewTxt.prototype = {
        constructor: ViewTxt,
        init:function () {
            this.createWrap();
            this.bindEvent();
        },
        createWrap:function () {
            for(var i=0,l=this.$ele.length;i<l;i++) {
                var span = document.createElement("span");
                var a = document.createElement("a");
                var content = this.$ele[i].innerHTML;
                this.contents.push(content);
                span.innerHTML = content.substring(0,this.opts.len);
                a.innerHTML = content.length>this.opts.len?"... 全文":"";
                a.href = "javascript:void(0)";
                this.$ele[i].innerHTML = "";
                this.$ele[i].appendChild(span);
                this.$ele[i].appendChild(a);
            }
        },
        bindEvent:function () {
            var _self = this;
            for(var i=0,l=this.$ele.length;i<l;i++) {
                (function (i) {
                    _self.$ele[i].lastElementChild.onclick = function(){
                        if(_self.$ele[i].lastElementChild.innerHTML.indexOf("全文")>0){
                            _self.$ele[i].lastElementChild.innerHTML = "<<&nbsp;收起";
                            _self.$ele[i].firstElementChild.innerHTML = _self.contents[i];
                        }else{
                            _self.$ele[i].lastElementChild.innerHTML = "... 全文";
                            _self.$ele[i].firstElementChild.innerHTML = _self.$ele[i].innerText.substring(0,_self.opts.len);
                        }
                    }
                })(i)
            }
        }
    }
    $.fn.viewTxt = function (opts) {
        opts = $.extend(defaults, opts || {});
        return new ViewTxt(opts,$(this));
    }
})(Zepto);

