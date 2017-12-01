/*
* 用了 Jquery.countdown.js 后 觉得可以优化，从而写下本插件
* 优化之处包括：
* 1.使用系统时间；
* 2.
* */






var countdown = (function() {
    "use strict";

    function _countdown($el,date, format, callback){
        this.$el = $el;
        this.date = date;
        this.format = format;
        this.callback = callback;
        this.init();
        this.bind();
    }

    _countdown.prototype= {
        init: function () {
            this.standardDate = this.parseDate(this.date)  // 解析后的时间
            this.currentDate = this.getCurrentDate()       // 获取服务器时间
            this.totalSecTime = this.getTime(this.currentDate,this.standardDate) // 获取倒计时总共的秒数
            this.distributeTime = this.getDistributeTime(this.totalSecTime)   // 分配时间，用以组合。
            this.formatHtml = this.getFormatHtml(this.format)   // 配置倒计时的 html 赋给 this.format
            this.setFormatHtml(this.formatHtml)
            this._setInterval()
        },

        bind : function () {

        },

        parseDate: function (date) {  // 这个函数来源于 Jquery.countdown.js
            var matchers = [];
            matchers.push(/^[0-9]*$/.source);
            matchers.push(/([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/.source);
            matchers.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/.source);
            matchers = new RegExp(matchers.join("|"));

            if (date instanceof Date) {
                return date;
            }
            if (String(date).match(matchers)) {
                if (String(date).match(/^[0-9]*$/)) {
                    date = Number(date);
                }
                if (String(date).match(/\-/)) {
                    date = String(date).replace(/\-/g, "/");
                }
                return new Date(date);
            } else {
                throw new Error("date:'" + date + "' 格式不正确");
            }
        },

        getCurrentDate: function () {
            return new Date($.ajax({async: false}).getResponseHeader("Date"));
        },

        getTime: function (currentDate, setDate) {
            var currentTime = currentDate.getTime(),
                setTime = setDate.getTime(),
                totalTime = Math.ceil((setTime - currentTime) / 1e3);
            if(totalTime <= 0) return 0;
            else return totalTime;
        },

        getDistributeTime: function (second) {
            return {
                seconds: second % 60,
                minutes: Math.floor(second / 60) % 60,
                totalMinutes: Math.floor(second / 60),
                hours: Math.floor(second / 60 / 60) % 24,
                totalHours: Math.floor(second / 60 / 60),
                days: Math.floor(second / 60 / 60 / 24) % 7,
                daysToWeek: Math.floor(second / 60 / 60 / 24) % 7,
                daysToMonth: Math.floor(second / 60 / 60 / 24 % 30.4368),
                totalDays: Math.floor(second / 60 / 60 / 24),
                weeks: Math.floor(second / 60 / 60 / 24 / 7),
                months: Math.floor(second / 60 / 60 / 24 / 30.4368),
                years: Math.abs(this.standardDate.getFullYear() - this.currentDate.getFullYear())
            };
        },

        getFormatHtml: function (format) {
            var directives = format.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);
            var _formatHtml = this.format;
            for(var i=0; i<directives.length; i++) {
                switch (directives[i]) {
                    case '%Y':
                        _formatHtml = _formatHtml.replace('%Y', this.distributeTime.years);
                        break;
                    case '%m':
                        _formatHtml = _formatHtml.replace('%m', this.distributeTime.months);
                        break;
                    case '%n':
                        _formatHtml = _formatHtml.replace('%n', this.distributeTime.daysToMonth);
                        break;
                    case '%w':
                        _formatHtml = _formatHtml.replace('%w', this.distributeTime.weeks);
                        break;
                    case '%W':
                        _formatHtml = _formatHtml.replace('%W', this.distributeTime.daysToWeek);
                        break;
                    case '%d':
                        _formatHtml = _formatHtml.replace('%d', this.distributeTime.days);
                        break;
                    case '%H':
                        _formatHtml = _formatHtml.replace('%H', this.distributeTime.hours);
                        break;
                    case '%M':
                        _formatHtml = _formatHtml.replace('%M', this.distributeTime.minutes);
                        break;
                    case '%S':
                        _formatHtml = _formatHtml.replace('%S', this.distributeTime.seconds);
                        break;
                    case '%D':
                        _formatHtml = _formatHtml.replace('%D', this.distributeTime.totalDays);
                        break;
                    case '%I':
                        _formatHtml = _formatHtml.replace('%I', this.distributeTime.totalHours);
                        break;
                    case '%N':
                        _formatHtml = _formatHtml.replace('%N', this.distributeTime.totalMinutes);
                        break;
                    case '%T':
                        _formatHtml = _formatHtml.replace('%T', this.totalSecTime);
                        break;
                }
            }
            return _formatHtml;
        },

        setFormatHtml: function (format) {
            this.$el.html(format);
        },

        updateCountdown: function () {
            var _this = this;
      
                _this.totalSecTime -= 1;
                _this.distributeTime = _this.getDistributeTime(_this.totalSecTime)   // 分配时间，用以组合。
                _this.formatHtml = _this.getFormatHtml(_this.format)   // 配置倒计时的 html 赋给 this.format
                _this.setFormatHtml(_this.formatHtml)
         



        },
        _setInterval: function(){
            var _this = this
            setInterval(function(){
                _this.updateCountdown()
            },1000)
        }
        
        // _setTimeout: function (callback) {
        //     setTimeout(callback)
        // }
    }


    return {
        deploy: function (obj) {
            var $el = obj.$el,
                date = obj.date,
                format = obj.format,
                callback = obj.endcallback || obj.fixcallback;
            new _countdown($el,date,format,callback)
        }
    }
})()

countdown.deploy({
    $el:$(".countdown"),
    date:'2017/12/12 12:12:12',
    format:'%Y 年 %m 月 %n 日 %H 小时 %M 分钟 %S 秒',       // 倒计时格式 时间设置中间可以写html
    endcallback:function () {           // endcallback 结束时执行的函数  fixcallback(600) 剩余600秒时执行的函数
        console.log('aa')
    }
})


/*
*
* %Y %m %W %d %H %M %S   剩余的 年 月 周 日 时 分 秒
* %Y %m $n %H %M %S   剩余的 年 月 日 时 分 秒

*
* %w $d %H %M %S   剩余的 周 日 时 分 秒
* %D %H %M %S   剩余的 日 时 分 秒
* %I %M %S   剩余的 时 分 秒
* %N %S   剩余的 分 秒
* %T    剩余的 秒
*
*
*
*
* */



