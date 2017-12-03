# countdown

#### 简介：
在研读了 Jquery.countdown.js 后，封装了此插件
可以选择使用服务器时间或本地时间，优化了性能

----

#### 依赖：
需要 jquery.js

----

#### 使用方法：

```
<div class="countdown"></div>
<div class="countdown2"></div>
```

```
countdown.deploy(
    {
        $el: $(".countdown"),                                  // （必选）选择器
        date: '2020/12/12 12:00',                              // （必选）到达日期
        format: '%Y 年 %m 月 %n 日 %H 小时 %M 分钟 %S 秒',        // （必选）倒计时格式 时间设置中间可以写html
        dateType: 'serverDate',                                // （可选）倒计时的时间类型 ：serverDate（服务器时间） localDate（本地时间） 默认本地时间
        leadTime: 0,                                           // （可选）设置提前多久执行函数   默认为 0
        callback: function () {                                // （可选）设置回调函数，配合 leadTime 使用
            alert('11')
        }
    },
    {
        $el: $(".countdown2"),
        date: '2020/12/12 12:00',
        format: '%Y 年 %m 月 %n 日 %H 小时 %M 分钟 %S 秒',
        dateType: 'serverDate',
        leadTime: 0,
        callback: function () {
            alert('11')
        }
    }
)
```

各参数的用法：

| 参数     | 含义    |
| ----     | :-----  |
| $el      | （必选）选择器 |
| date     | （必选）到达日期 |
| format   | （必选）倒计时格式 时间设置中间可以写html |
| dateType | （可选）倒计时的时间类型 ：serverDate（服务器时间） localDate（本地时间） 默认本地时间 |
| leadTime | （可选）设置提前多久执行函数   默认为 0 |
| callback |（可选）设置回调函数，配合 leadTime 使用  |

----

#### format 写法：

```
 %Y %m %W %d %H %M %S   剩余的 年 月 周 日 时 分 秒
 %Y %m $n %H %M %S   剩余的 年 月 日 时 分 秒


 %w $d %H %M %S   剩余的 周 日 时 分 秒
 %D %H %M %S   剩余的 日 时 分 秒
 %I %M %S   剩余的 时 分 秒
 %N %S   剩余的 分 秒
 %T    剩余的 秒
 ```
| 参数     | 含义    |
| ----     | :-----  |
| %Y|	剩余的年份|
|%m	|	剩余的月份|
|%n	|	剩余的天数（月份计算后多余下来的天数）|
|%w	|	剩余的周数|
|%W|	剩余的周数（月份计算后多余下来的周数）|
|%d	|       剩余的天数（周数计算后多余下来的天数）|
|%H	|	剩余的小时数（天数计算后多余的小时数）|
|%M|	剩余的分钟数（小时数计算后多余下来的分钟数）|
|%S|		剩余的秒数（分钟计算后多余下来的秒数）|
|%D	|	剩余的总天数|
|%I	|	剩余的总小时数|
|%N|	剩余的总分钟数|
|%T|		剩余的总秒数|

----

#### 另外
  可以给每个字符设置一个<span> 或者 <div> 添加class给每个设置单独的样式 比如：
```
 format: '<span class="yyyy">%Y</span> <span class="year">年</span> %m 月 %n 日 %H 小时 %M 分钟 %S 秒'
```
 这样就可以单独设置 .yyyy 和 .year 的样式了


