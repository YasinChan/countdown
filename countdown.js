/*
* 用了 Jquery.countdown.js 后 觉得可以优化，从而写下本插件
* 优化之处包括：
* 1.使用系统时间；
* 2.可以选择使用本地时间或者系统时间
* 3.
* */






var countdown = (function() {
    "use strict";

    function _countdown($el,date,format,dateType,leadTime, callback){
        this.$el = $el;
        this.date = date;
        this.format = format;
        this.dateType = dateType==undefined?'localDate':dateType;
        this.leadTime = leadTime==undefined?0:leadTime;
        this.callback = callback;
        this.init();
    }

    _countdown.prototype= {
        init: function () {
            this.interval = null
            this.currentDate = null
            this.standardDate = null
            this.totalSecTime = null
            this.distributeTime = null
            this.formatHtml = null
            this.parseDate(this.date)  // 解析后的时间
            this.getCurrentDate()       // 获取服务器时间
            this.getTime(this.currentDate,this.standardDate) // 获取倒计时总共的秒数
            this.getDistributeTime(this.totalSecTime)   // 分配时间，用以组合。
            this.getFormatHtml(this.format)   // 配置倒计时的 html 赋给 this.format
            this.setFormatHtml(this.formatHtml)     // 画html
            this._setInterval()    // 倒计时函数
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
                this.standardDate = new Date(date);
            } else {
                throw new Error("date:'" + date + "' 格式不正确");
            }
        },

        getCurrentDate: function () {
            if(this.dateType == 'localDate') {
                this.currentDate = new Date()
            }else {
                this.currentDate = new Date($.ajax({async: false}).getResponseHeader("Date"));
            }
        },

        getTime: function (currentDate, setDate) {
            var currentTime = currentDate.getTime(),
                setTime = setDate.getTime(),
                totalTime = Math.ceil((setTime - currentTime) / 1e3);
            if(totalTime <= 0) this.totalSecTime = 0;
            else this.totalSecTime = totalTime;
        },

        getDistributeTime: function (second) {
            this.distributeTime = {
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
            var timeObj = this.distributeTime;
            for(var i=0; i<directives.length; i++) {
                switch (directives[i]) {
                    case '%Y':
                        _formatHtml = _formatHtml.replace('%Y', timeObj.years<10?'0'+timeObj.years:timeObj.years);
                        break;
                    case '%m':
                        _formatHtml = _formatHtml.replace('%m', timeObj.months<10?'0'+timeObj.months:timeObj.months);
                        break;
                    case '%n':
                        _formatHtml = _formatHtml.replace('%n', timeObj.daysToMonth<10?'0'+timeObj.daysToMonth:timeObj.daysToMonth);
                        break;
                    case '%w':
                        _formatHtml = _formatHtml.replace('%w', timeObj.weeks<10?'0'+timeObj.weeks:timeObj.weeks);
                        break;
                    case '%W':
                        _formatHtml = _formatHtml.replace('%W', timeObj.daysToWeek<10?'0'+timeObj.daysToWeek:timeObj.daysToWeek);
                        break;
                    case '%d':
                        _formatHtml = _formatHtml.replace('%d', timeObj.days<10?'0'+timeObj.days:timeObj.days);
                        break;
                    case '%H':
                        _formatHtml = _formatHtml.replace('%H', timeObj.hours<10?'0'+timeObj.hours:timeObj.hours);
                        break;
                    case '%M':
                        _formatHtml = _formatHtml.replace('%M', timeObj.minutes<10?'0'+timeObj.minutes:timeObj.minutes);
                        break;
                    case '%S':
                        _formatHtml = _formatHtml.replace('%S', timeObj.seconds<10?'0'+timeObj.seconds:timeObj.seconds);
                        break;
                    case '%D':
                        _formatHtml = _formatHtml.replace('%D', timeObj.totalDays<10?'0'+timeObj.totalDays:timeObj.totalDays);
                        break;
                    case '%I':
                        _formatHtml = _formatHtml.replace('%I', timeObj.totalHours<10?'0'+timeObj.totalHours:timeObj.totalHours);
                        break;
                    case '%N':
                        _formatHtml = _formatHtml.replace('%N', timeObj.totalMinutes<10?'0'+timeObj.totalMinutes:timeObj.totalMinutes);
                        break;
                    case '%T':
                        _formatHtml = _formatHtml.replace('%T', this.totalSecTime<10?'0'+this.totalSecTime:this.totalSecTime);
                        break;
                }
            }
            this.formatHtml = _formatHtml;
        },

        setFormatHtml: function (format) {
            this.$el.html(format);
        },

        _setInterval: function(){
            var _this = this
            this.interval = setInterval(function(){
                _this.updateCountdown()
            },1000)
        },

        // destroy: function(){
        //     if(this.interval) clearInterval(this.interval);
        // },

        updateCountdown: function () {
            if(this.totalSecTime == this.leadTime) {
                if(this.callback != undefined) {
                    this.callback();
                    this.getCurrentDate()
                    this.totalSecTime = this.getTime(this.currentDate,this.standardDate)
                }
            }
            if(!this.totalSecTime) {
                clearInterval(this.interval)
                return
            }
            this.totalSecTime -= 1;
            this.getDistributeTime(this.totalSecTime)
            this.getFormatHtml(this.format)
            this.setFormatHtml(this.formatHtml)
        }

    }


    return {
        deploy: function () {
            var $el,date,format,dateType,leadTime,callback
            for(var i=0; i<arguments.length; i++) {
                $el = arguments[i].$el;
                date = arguments[i].date;
                format = arguments[i].format;
                dateType = arguments[i].dateType;
                leadTime = arguments[i].leadTime;
                callback = arguments[i].callback;
                new _countdown($el,date,format,dateType,leadTime,callback)
            }

        }
    }
})()



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






