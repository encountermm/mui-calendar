/**
 * 作者：1120010842@qq.com
 * 时间：2017-12-04
 * 描述：档期的写入，添加与删除
**/
//定义档期数组
var schedule;
(function (w,$) {
    w.Calendar = function (opt) {
        // 创建日历控件基本结构	
        // 日历父级div
        var cldbox = document.createElement("div");
        cldbox.className = 'calendar-container';
        //子内容HTML字符串拼接
        var tpl = "";
        //头部
        tpl += '<div class="calendar-title">';
        //前一年
        tpl += '<div class="calendar-prevyear"><<</div>';
        //前一个月
        tpl += '<div class="calendar-prevmonth"><</div>';
        //年份
        tpl += '<div class="calendar-year"></div>';
        //月份
        tpl += '<div class="calendar-month"></div>';
        //下一个月
        tpl += '<div class="calendar-nextmonth">></div>';
        //下一年
        tpl += '<div class="calendar-nextyear">>></div>';
        //闭合头部div
        tpl += '</div>';
        //星期div
        tpl += '<div class="calendar-week"><div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div></div>';
        //清除浮动
        tpl += '<div class="calendar-content clearfix"></div>';
        //innerHTML 将字符串写入cldbox
        cldbox.innerHTML = tpl;
        document.getElementById("calenderContent").insertBefore(cldbox, document.getElementById("calenderContent").childNodes[0])

        // dom 对象
        //年
        var oyear = cldbox.querySelector(".calendar-year");

        //月
        var omonth = cldbox.querySelector(".calendar-month");

        //前一年
        var prevyear = cldbox.querySelector(".calendar-prevyear");
        //前一个月
        var prevmonth = cldbox.querySelector(".calendar-prevmonth");
        //下一年
        var nextyear = cldbox.querySelector(".calendar-nextyear");
        //下一个月
        var nextmonth = cldbox.querySelector(".calendar-nextmonth");
        //日历父级div
        var content = cldbox.querySelector(".calendar-content");

        // 时间对象(默认当前)
        var dateObj;
        //默认当前date
        if (opt.value) {
            dateObj = opt.value;
        } else {
            dateObj = new Date();
        }

        if (opt.scheduleArr) {
            schedule = opt.scheduleArr;
        } else {
            schedule = [];
        }

        this.show = function showSchedule() {
            alert("您选择的档期为" + schedule);
        }

        // 年 
        var year = getYear(dateObj);
        //月
        var month = getMonth(dateObj);

        // 月年的显示
        oyear.innerHTML = year + "年";
        omonth.innerHTML = month + "月";
        //年份
        var oyearNum = oyear.innerText;
        //月份
        var omonthNum = omonth.innerText;

        // 本月1号为周几
        var firstWeek = getCurmonWeeknum(dateObj);

        // 本月总天数
        var monDaynum = getCurmonDaynum(dateObj);

        // 当前日期
        var nowDay = getDay(dateObj);


        //初始化显示本月信息
        setContent(content, oyear, omonth, firstWeek, monDaynum, nowDay, schedule);

        //是否支持mui
        var isSupportMUI = (typeof mui === 'function');
        var evt = {
            type: isSupportMUI ? 'tap' : 'click'
        }

        // 显示当前时间
        $(document).on(evt.type,".canChoose",function(){
        	 var nowYear = parseInt(oyearNum);
            var nowMonth = parseInt(omonthNum);
            //class为 canChoose 的div
            if (event.target.tagName == "DIV" && event.target.nodeType == "1" && hasclass(event.target.className, "canChoose")) {
                var day = event.target.innerHTML;
                //new Obj
                var dateObj = new Date(year, month - 1, day);
                //week
                var week = getWeek(dateObj);

                var hasChoose = event.target.getAttribute("data-choose");
                if (hasChoose === 'true') {
                    if (hasclass(event.target.className, "today")) {
                        event.target.style.color = "#fff";
                        event.target.style.background = "#9E9E9E";
                    } else {
                        event.target.style.color = "#333";
                        event.target.style.background = "#f2f5f9";
                    }
                    event.target.setAttribute("data-choose", "false");
                    //删除
                    schedule.removeValue(nowYear + "-" + nowMonth + "-" + day);
                } else {
                    if (hasclass(event.target.className, "today")) {
                        event.target.style.color = "#fff";
                        event.target.style.background = "#f15e5e";
                    } else {
                        event.target.style.color = "#fff";
                        event.target.style.background = "#09F";
                    }

                    event.target.setAttribute("data-choose", "true");
                    //增加
                    schedule.push(nowYear + "-" + nowMonth + "-" + day);
                }

                var scheduleSort = schedule.sort();

                console.log(schedule);
            };
        	
        })

        // 上一月
        prevmonth.addEventListener(evt.type, function () {
            //js月
            var ddm = null;
            //年
            var ddy = null;

            if ((dateObj.getMonth() - 1) == -1) {
                ddm = 11;
                ddy = dateObj.getFullYear() - 1;
            } else {
                ddm = dateObj.getMonth() - 1;
                ddy = dateObj.getFullYear();
            };
            //设置
            dateObj.setFullYear(ddy);
            dateObj.setMonth(ddm);
            //
            omonth.innerHTML = getMonth(dateObj) + "月";
            oyear.innerHTML = dateObj.getFullYear() + "年";
            //年份
            oyearNum = oyear.innerText;
            //月份
            omonthNum = omonth.innerText;

            //一个月有周数
            firstWeek = getCurmonWeeknum(dateObj);
            //一个月的天数
            monDaynum = getCurmonDaynum(dateObj);
            nowDay = getDay(dateObj);

            var ele = document.createElement("div");
            ele.className = "calendar-content";
            document.getElementsByClassName('calendar-content')[0].parentNode.appendChild(ele);
            setContent(ele, oyear, omonth, firstWeek, monDaynum, nowDay, schedule);
            clearContent();
        })

        // 下一月
        nextmonth.addEventListener(evt.type, function () {
            var ddm = null;
            var ddy = null;
            if ((dateObj.getMonth() + 1) == 12) {
                ddm = 0;
                ddy = dateObj.getFullYear() + 1;
            } else {
                ddm = dateObj.getMonth() + 1;
                ddy = dateObj.getFullYear();
            };
            dateObj.setFullYear(ddy);
            dateObj.setMonth(ddm);
            omonth.innerHTML = getMonth(dateObj) + "月";
            oyear.innerHTML = dateObj.getFullYear() + "年";

            firstWeek = getCurmonWeeknum(dateObj);
            monDaynum = getCurmonDaynum(dateObj);
            //年份
            oyearNum = oyear.innerText;
            //月份
            omonthNum = omonth.innerText;

			var ele = document.createElement("div");
            ele.className = "calendar-content";
            document.getElementsByClassName('calendar-content')[0].parentNode.appendChild(ele);
            setContent(ele, oyear, omonth, firstWeek, monDaynum, nowDay, schedule);
            clearContent();
        })

        // 上一年
        prevyear.addEventListener(evt.type, function () {
            var ddy = dateObj.getFullYear() - 1;
            dateObj.setFullYear(ddy);
            oyear.innerHTML = dateObj.getFullYear() + "年";
            //年份
            oyearNum = oyear.innerText;
            //月份
            omonthNum = omonth.innerText;
            firstWeek = getCurmonWeeknum(dateObj);
            monDaynum = getCurmonDaynum(dateObj);
            nowDay = getDay(dateObj);
            
           	var ele = document.createElement("div");
            ele.className = "calendar-content";
            document.getElementsByClassName('calendar-content')[0].parentNode.appendChild(ele);
            setContent(ele, oyear, omonth, firstWeek, monDaynum, nowDay, schedule);
            clearContent();
        })

        // 下一年
        nextyear.addEventListener(evt.type, function () {
            var ddy = dateObj.getFullYear() + 1;
            dateObj.setFullYear(ddy);
            oyear.innerHTML = dateObj.getFullYear() + "年";
            //年份
            oyearNum = oyear.innerText;
            //月份
            omonthNum = omonth.innerText;
            firstWeek = getCurmonWeeknum(dateObj);
            monDaynum = getCurmonDaynum(dateObj);
            nowDay = getDay(dateObj);
            
            var ele = document.createElement("div");
            ele.className = "calendar-content";
            document.getElementsByClassName('calendar-content')[0].parentNode.appendChild(ele);
            setContent(ele, oyear, omonth, firstWeek, monDaynum, nowDay, schedule);
            clearContent();
        })
    }

    //有无指定类名的判断
    function hasclass(str, cla) {
        var i = str.search(cla);
        if (i == -1) {
            return false;
        } else {
            return true;
        };
    }

    // 初始化日期显示方法
    function setContent(el, oyear, omonth, firstWeek, monDaynum, nowDay, scheduleDays) {
        //年份
        oyearNum = oyear.innerText;
        //月份
        omonthNum = omonth.innerText;

        var nowYear = parseInt(oyearNum);
        var nowMonth = parseInt(omonthNum);

        // 留空
        for (var i = 1; i <= firstWeek; i++) {
            var subContent = document.createElement("div");
            subContent.innerHTML = "";
            el.appendChild(subContent);
        }
        // 正常区域
        for (var i = 1; i <= monDaynum; i++) {
            var subContent = document.createElement("div");
            subContent.className = "canChoose";
            subContent.setAttribute("data-choose", "false");
            if (i == nowDay) {
                subContent.classList.add("today");
            }
            subContent.innerHTML = i;
            el.appendChild(subContent);
            var date = nowYear + "-" + nowMonth + "-" + i;
            var nowdate = nowYear + "-" + nowMonth + "-" +nowDay;
            if (contains(scheduleDays, date)) {
                subContent.style.background = "rgb(0, 153, 255)";
                subContent.style.color = "rgb(255, 255, 255)";
                subContent.setAttribute("data-choose", "true");
            } else {
                subContent.setAttribute("data-choose", "false");
            }
            if(date == nowdate){
            	if(contains(scheduleDays, date)){
            		subContent.style.background = "rgb(241, 94, 94)";
	                subContent.style.color = "rgb(255, 255, 255)";
	                subContent.setAttribute("data-choose", "true");
            	}else{
            		subContent.style.background = "#9e9e9e";
	                subContent.style.color = "rgb(255, 255, 255)";
	                subContent.setAttribute("data-choose", "false");
            	}
            }
        }
    }

    // 清除内容
    function clearContent() {
        var ele = document.getElementsByClassName('calendar-container')[0].getElementsByClassName("calendar-content")[0];
        ele.remove();
    }

    // 判断闰年
    function isLeapYear(year) {
        if ((year % 4 == 0) && (year % 100 != 0 || year % 400 == 0)) {
            return true;
        } else {
            return false;
        }
    }

    // 得到当前年份
    function getYear(dateObj) {
        return dateObj.getFullYear()
    }

    // 得到当前月份
    function getMonth(dateObj) {
        var month = dateObj.getMonth()
        switch (month) {
            case 0: return "1"; break;
            case 1: return "2"; break;
            case 2: return "3"; break;
            case 3: return "4"; break;
            case 4: return "5"; break;
            case 5: return "6"; break;
            case 6: return "7"; break;
            case 7: return "8"; break;
            case 8: return "9"; break;
            case 9: return "10"; break;
            case 10: return "11"; break;
            case 11: return "12"; break;
            default:
        }
    }

    // 得到当前日数
    function getDay(dateObj) {
        return dateObj.getDate();
    }

    // 得到周期数
    function getWeek(dateObj) {
        var week;
        switch (dateObj.getDay()) {
            case 1: week = "星期一"; break;
            case 2: week = "星期二"; break;
            case 3: week = "星期三"; break;
            case 4: week = "星期四"; break;
            case 5: week = "星期五"; break;
            case 6: week = "星期六"; break;
            default: week = "星期日";
        }
        return week;
    }

    // 获取本月总日数方法
    function getCurmonDaynum(dateObj) {
        var year = dateObj.getFullYear();
        var month = dateObj.getMonth();
        if (isLeapYear(year)) {//闰年
            switch (month) {
                case 0: return "31"; break;
                case 1: return "29"; break; //2月
                case 2: return "31"; break;
                case 3: return "30"; break;
                case 4: return "31"; break;
                case 5: return "30"; break;
                case 6: return "31"; break;
                case 7: return "31"; break;
                case 8: return "30"; break;
                case 9: return "31"; break;
                case 10: return "30"; break;
                case 11: return "31"; break;
                default:
            }
        } else {//平年
            switch (month) {
                case 0: return "31"; break;
                case 1: return "28"; break; //2月 
                case 2: return "31"; break;
                case 3: return "30"; break;
                case 4: return "31"; break;
                case 5: return "30"; break;
                case 6: return "31"; break;
                case 7: return "31"; break;
                case 8: return "30"; break;
                case 9: return "31"; break;
                case 10: return "30"; break;
                case 11: return "31"; break;
                default:
            }
        }
    }

    // 获取本月1号的周值
    function getCurmonWeeknum(dateObj) {
        var oneyear = new Date();
        var year = dateObj.getFullYear();
        var month = dateObj.getMonth(); //0--12月
        oneyear.setFullYear(year);
        oneyear.setMonth(month); //0--12月
        oneyear.setDate(1);
        return oneyear.getDay();
    }

    //删除数组指定元素
    Array.prototype.removeValue = function (val) {
        for (var i = 0; i < this.length; i++) {
            var getDay = this[i].split('-')[2];
            if (parseInt(getDay) < 10) {
                getDay = parseInt(getDay);
            }
            var getDate = this[i].split('-')[0] + '-' + this[i].split('-')[1] + "-" + getDay;
            if (getDate == val) {
                this.splice(i, 1);
                break;
            }
        }
    }
    //数组排序
    function sortNumber(a, b) {
        return a - b
    }
    
    function contains(arr, value) {
        for (var i = 0; i < arr.length; i++) {
            var year = arr[i].split('-')[0];
            var month = arr[i].split('-')[1];
            var day = arr[i].split('-')[2];
            year = parseInt(year);
            month = parseInt(month);
            day = parseInt(day);
            var date = year + "-" + month + "-" + day;
            if (date == value) {
                return true;
            }
        }
        return false;
    }
})(window,jQuery);