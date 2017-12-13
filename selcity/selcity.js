var provinces = {
    "B": [{
        "ID": "3",
        "Code": "3",
        "Name": "上海",
        "Initial": "S",
        "Hotline": "3333"
    }, {"ID": "4", "Code": "4", "Name": "深圳", "Initial": "S", "Hotline": "444444"}],
    "H": [{"ID": "3", "Code": "3", "Name": "上海", "Initial": "S", "Hotline": "3333"}, {
        "ID": "4",
        "Code": "4",
        "Name": "深圳",
        "Initial": "S",
        "Hotline": "444444"
    }],
    "N": [{"ID": "3", "Code": "3", "Name": "上海", "Initial": "S", "Hotline": "3333"}, {
        "ID": "4",
        "Code": "4",
        "Name": "深圳",
        "Initial": "S",
        "Hotline": "444444"
    }],
    "Q": [{"ID": "3", "Code": "3", "Name": "上海", "Initial": "S", "Hotline": "3333"}, {
        "ID": "4",
        "Code": "4",
        "Name": "深圳",
        "Initial": "S",
        "Hotline": "444444"
    }],
    "S": [{"ID": "3", "Code": "3", "Name": "上海", "Initial": "S", "Hotline": "3333"}, {
        "ID": "4",
        "Code": "4",
        "Name": "深圳",
        "Initial": "S",
        "Hotline": "444444"
    }]
};

(function ($, win, doc) {
    var CityPickerIndex = function (options) {
        this.provinces = options;
        this.pro = null;
        this.city = null;
        this.letterStr = "";
        this.init();
    };

    var p = CityPickerIndex.prototype;

    p.init = function () {
        this.createProList();
        this.proClick();
        this.createNavBar();
    };

    p.createCityPickerBox = function () {
        var proBox = "<div class='city-list'></div>";
        $("body").append(proBox);
    };

    p.createProList = function () {
        var provinces = this.provinces;
        var proBox;
        var dl = "";
        for (var letterKey in provinces) {
            var cityArray = provinces[letterKey];
            if (provinces.hasOwnProperty(letterKey)) {
                this.letterStr += letterKey;
                var dt = "<dt id='" + letterKey + "' class='city-list-symbol'>" + letterKey + "</dt>";
                var dd = "";
                for(var i=0,l=cityArray.length;i<l;i++){
                    dd += "<dd data-letter=' + letterKey + ' class='city-list-item' data-hotline='"+cityArray[i].Hotline+"' data-code='"+cityArray[i].Code+"'>" + cityArray[i].Name + "</dd>";
                }
                dl += "<dl>" + dt + dd + "</dl>";
            }
        }

        proBox = "<section class='pro-picker'>" + dl + "</section>";

        $(".city-list").append(proBox);
    };

    p.proClick = function () {
        var that = this;
        // $(".pro-picker").on("click", function (e) {
        //     var target = e.target;
        //     if ($(target).is("dd")) {
        //          that.city = $(target).html();
        //         $('#'+that.city_v).val(that.city);
        //         this.$router.push('/ensureIntent');
        //         $(this).hide();
        //     }
        // });
    };
    p.createNavBar = function () {
        // var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var arr = this.letterStr.split("");
        var a = "";
        arr.forEach(function (item, i) {
            a += '<a href="javascript:void(0)" data-name="'+item+'">' + item + '</a>';
        });

        var div = '<div class="navbar">' + a + '</div>';

        $(".city-letter").append(div);
    };
    p.navEvent = function () {
        var that = this;
        var navBar = $(".navbar");
        var width = navBar.find("a").width();
        var height = navBar.find("a").height();
        navBar.on("touchstart", function (e) {
            $(this).addClass("active");
            that.createLetterPrompt($(e.target).html());
        });

        navBar.on("touchmove", function (e) {
            e.preventDefault();
            var touch = e.originalEvent.touches[0];
            var pos = {"x": touch.pageX, "y": touch.pageY};
            var x = pos.x, y = pos.y;
            $(this).find("a").each(function (i, item) {
                var offset = $(item).offset();
                var left = offset.left, top = offset.top;
                if (x > left && x < (left + width) && y > top && y < (top + height)) {
                    location.href = item.href;
                    that.changeLetter($(item).html());
                }
            });
        });

        navBar.on("touchend", function () {
            $(this).removeClass("active");
            $(".prompt").hide();
        })
    };

    p.createLetterPrompt = function (letter) {
        var prompt = $(".prompt");
        if (prompt[0]) {
            prompt.show();
        } else {
            var span = "<span class='prompt'>" + letter + "</span>";
            $(".city-list").append(span);
        }
    };


    p.changeLetter = function (letter) {
        var prompt = $(".prompt");
        prompt.html(letter);
    };

    $.fn.CityPickerIndex = function (options) {
        return new CityPickerIndex(options);
    }
}(window.Zepto, window, document));
