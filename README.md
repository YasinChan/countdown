# countdown
### 简介：
在研读了 Jquery.countdown.js 后，封装了此插件
包括使用了服务器时间，优化了性能

### 使用方法：

```
countdown.deploy({
    $el:$(".countdown"),
    date:'2017/12/12 12:12:12',
    format:'%Y 年 %m 月 %n 日 %H 小时 %M 分钟 %S 秒',       // 倒计时格式 时间设置中间可以写html
    endcallback:function () {           // endcallback 结束时执行的函数  fixcallback(600) 剩余600秒时执行的函数
        console.log('aa')
    }
})
```



format 写法：

 %Y %m %W %d %H %M %S   剩余的 年 月 周 日 时 分 秒
 %Y %m $n %H %M %S   剩余的 年 月 日 时 分 秒


 %w $d %H %M %S   剩余的 周 日 时 分 秒
 %D %H %M %S   剩余的 日 时 分 秒
 %I %M %S   剩余的 时 分 秒
 %N %S   剩余的 分 秒
 %T    剩余的 秒



