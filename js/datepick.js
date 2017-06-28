/**
 * Created by youhuahaohaoshuo on 2017/4/17 0017.
 */
(function(doc){
    var currentDate = new Date();
    function datePick(ele,options){
        this.triggerObj = doc.querySelector(ele);
        this.isOpen = false;
        this.init(options);
    }
    datePick.DEFAULT = {
        year : currentDate.getFullYear(),
        month : currentDate.getMonth(),
        day : currentDate.getDate(),
        separator : "-"
    }
    datePick.prototype = {
        init:function(options){
            /*if(options.length < 3){
             alert("参数不完整");
             return false;
             };*/
            this.extend(datePick.DEFAULT,options);
            this.getDays(this.year,this.month);
            this.renderMain();
            this.renderPage();
            this.bindEven();
        },
        extend:function(){
            var lenght = arguments.length;
            for(var i = 0; i < lenght; i++){
                for(prop in arguments[i]){
                    this[prop] = arguments[i][prop];
                };
            };
        },
        getDays:function(_year,_month){
            var firstDate = new Date(_year,_month,1);
            var firstDateWeek = firstDate.getDay();
            var lastDateOfLastMonth = new Date(_year,_month,0).getDate();
            var lastDate = new Date(_year,_month + 1,0).getDate();
            var preMonthDatCount = firstDateWeek;
            var renderSet = [];
            var year = firstDate.getFullYear();
            var month = firstDate.getMonth() + 1;
            for(var i=0; i<42; i++){
                var date = i + 1 - preMonthDatCount;
                var showDate = date;
                var thisMonth = _month + 1;
                if(date <= 0){
                    thisMonth--;
                    showDate = lastDateOfLastMonth + date;
                }else if(date > lastDate){
                    thisMonth++;
                    showDate = date - lastDate;
                };
                if(thisMonth === 0){
                    thisMonth = 12;
                };
                if(thisMonth === 13){
                    thisMonth = 1;
                }
                renderSet.push({
                    thisMonth:thisMonth,
                    date:date,
                    showDate:showDate
                });
            }
            this.time = {
                renderSet:renderSet,
                year:year,
                month:month
            };
        },
        renderMain:function(){
            var datePickWrap = doc.createElement("div");
            var datePickHeader = '<div class="z-datepick-header">'
                +'<a href="#" class="z-datepick-btn z-datepick-btn-pre">&lt;</a>'
                +'<a href="#" class="z-datepick-btn z-datepick-btn-next">&gt;</a>'
                +'<span class="js_show_year"></span><span>-</span><span class="js_show_month"></span>'
                +'</div>';
            var datePickBody = '<div class="z-datepick-body">'
                +'<table>'
                +'<thead>'
                +'<th>日</th>'
                +'<th>一</th>'
                +'<th>二</th>'
                +'<th>三</th>'
                +'<th>四</th>'
                +'<th>五</th>'
                +'<th>六</th>'
                +'</thead>'
                +'<tbody>'
                +'</tbody>'
                +'</table>';
            datePickWrap.className = "z-datepick-wrap";
            datePickWrap.innerHTML = datePickHeader + datePickBody;
            doc.body.appendChild(datePickWrap);
        },
        renderPage:function(){
            /*var currentDays = this.day;*/
            var time = this.time;
            var lastDate = new Date(time.year,time.month,0).getDate();
            var thSetStr = "";
            var tdClass = "";
            time.renderSet.forEach(function(item,i){
                if(i % 7 === 0){
                    thSetStr += '<tr>';
                };
                if(item.date <= 0 || item.date > lastDate){
                    tdClass = "z-other-month";
                }else{
                    tdClass = "";
                };/*else if(item.showDate != currentDays){
                    tdClass = "";
                }else{
                    tdClass = "z-current-day";
                };*/
                thSetStr += '<td data-date="'+item.date+'" class="'+tdClass+'">'+item.showDate+'</td>';
                if((i + 1) % 7 === 0){
                    thSetStr += '</tr>';
                };
            });
            console.log(time.month);
            doc.querySelector(".js_show_year").innerText = time.year;
            doc.querySelector(".js_show_month").innerText = time.month;
            doc.querySelector(".z-datepick-body tbody").innerHTML = thSetStr;
        },
        bindEven:function(){
            var self = this;
            var year = self.time.year;
            var month = self.time.month - 1;
            var datePickWrap = doc.querySelector(".z-datepick-wrap");
            var dataPickHead = doc.querySelector(".z-datepick-header");
            var datePickBody = doc.querySelector(".z-datepick-body");
            var triggerObj = self.triggerObj;
            triggerObj.addEventListener("click",function(e){
                if(self.isOpen){
                    datePickWrap.classList.remove("show");
                    self.isOpen = false;
                }else{
                    datePickWrap.classList.add("show");
                    self.isOpen = true;
                    var wrapTop = triggerObj.offsetTop + triggerObj.offsetHeight + 2 + "px";
                    var wrapLeft = triggerObj.offsetLeft + "px";
                    datePickWrap.style.top = wrapTop;
                    datePickWrap.style.left = wrapLeft;
                };
            });
            dataPickHead.addEventListener("click",function(e){
                if(e.target.classList.contains("z-datepick-btn-pre")){
                    month--;
                }else{
                    month++;
                };
                self.getDays(year,month);
                self.renderPage();
            });
            datePickBody.addEventListener("click",function(e){
                var _target = e.target;
                if(_target.nodeName.toLowerCase() == "td"){
                    var separator = self.separator;
                    var checkDate = new Date(year,month,_target.dataset.date);
                    var currentYear = checkDate.getFullYear();
                    var currentMonth = checkDate.getMonth() + 1;
                    var currentDay = checkDate.getDate();
                    if(currentMonth < 10){
                        currentMonth = "0" + currentMonth;
                    };
                    if(currentDay < 10){
                        currentDay = "0" + currentDay;
                    };
                    triggerObj.value = currentYear + separator + currentMonth + separator + currentDay;
					datePickWrap.classList.remove("show");
					self.isOpen = false;
                };
            });
        }
    }
    window.datePick = datePick;
})(document);
