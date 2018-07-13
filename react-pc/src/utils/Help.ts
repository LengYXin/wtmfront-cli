export class Help {
    // 日期格式化
    static DateFormat(date, fmt) {
        try {
            if (!date) {
                return date;
            }
            if (typeof date == "number") {
                date = new Date(date);
            }
            // console.log(date);
            var o = {
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        } catch (error) {
            return date;
        }
    }
    /**
        * 返回随机颜色
        * @param cls 追加颜色值
        */
    static randomColor(cls = []) {
        const colors = ["#f3b07d", "#d3b865", "#62a1a6", "#5bb287", "#74abcf", "#f87163", "#837fd4", "#fdb405", "#22b0c4", "#88b8ce", "#f19c1ff", "#75c4b7", "#63ab5d", "#97807f", "#8aa9d8", "#b56ffd", "#03cdcb", "#4184e0", "#5a93c2", ...cls];
        const randomNum = Math.floor(Math.random() * colors.length);
        //   console.log(colors[randomNum])
        return colors[randomNum];
    }
}