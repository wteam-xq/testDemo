(function($,w){
	
	var calendarConfig = {
        id : 1
    };
	
    w.Calendar = function (o){
        this.initialize(o);
    };
	
	w.Calendar.prototype = {
		initialize: function(options) {
			this._setOptions(options);
			this._calendarId = "uiCalendar_" + calendarConfig.id++
			
            if(typeof this._options.target == "string"){
				this._options.target = $("#" + this._options.target);
			}else{
                this._options.target = $(this._options.target);
            }

            this._createFrame();
			this._container = $("#" + this._calendarId + " tbody");
			this._compareDate = "no";
			
			if(this._options.setDate !== null){
				this._options.year = this._options.setDate.getFullYear();
				this._options.month = this._options.setDate.getMonth() + 1;
			}else{
				this._options.year = new Date().getFullYear();
				this._options.month = new Date().getMonth() + 1;
			}
			
			if(this._options.minDate !== 0 && this._options.maxDate !== 0){
				this._compareDate = "between";
			}else if(this._options.minDate !== 0){
				this._compareDate = "less";
			}else if(this._options.maxDate !== 0){
				this._compareDate = "more";
			}
            
			
			this._draw();
			
		},
		//设置默认属性
		_setOptions: function(options) {
			this._options = {//默认值
				setDate:  null,//选择日期
				minDate:  0,
				maxDate:  0,
				popup:    false,
				target:   null,
                onSelect: null,
                dateFormat: "default"
			};
			$.extend(this._options, options);
		},
		//当前月
		_nowMonth: function() {
			this._draw(new Date());
		},
		//上一月
		_preMonth: function() {
			this._draw(new Date(this._options.year, this._options.month - 2, 1));
		},
		//下一月
		_nextMonth: function() {
			this._draw(new Date(this._options.year, this._options.month, 1));
		},
		//上一年
		_preYear: function() {
			this._draw(new Date(this._options.year - 1, this._options.month - 1, 1));
		},
		//下一年
		_nextYear: function() {
			this._draw(new Date(this._options.year + 1, this._options.month - 1, 1));
		},
		//画日历
		_draw: function(d) {
		
			if(arguments.length===1){
				this._options.year = d.getFullYear(); 
				this._options.month = d.getMonth() + 1;
			}
			//用来保存日期列表
			var arr = [],
				days = [],
				row,
				cell,
				cDate,
				tDate = new Date(),
				i,
				on,
				a,
				firstDay = firstDay = new Date(this._options.year, this._options.month - 1, 1).getDay(),
				monthDay = new Date(this._options.year, this._options.month, 0).getDate(),
				frag = document.createDocumentFragment();
				
			//用当月第一天在一周中的日期值作为当月离第一天的天数
			for(i = 1;i <= firstDay; i++){ 
				arr.push(0);
			}
			//用当月最后一天在一个月中的日期值作为当月的天数
			for(i = 1;i <= monthDay; i++){
				arr.push(i);
			}
			
			while(arr.length){
				//每个星期插入一个tr
				row = document.createElement("tr");
				//每个星期有7天
				for( i = 1; i <= 7; i++ ){
					cell = document.createElement("td"); 
					if(arr.length){
						cDate = arr.shift();
						if(cDate){
							
							days[cDate] = cell;
							on = new Date( this._options.year, this._options.month - 1, cDate );
							
							//判断是否今天
							this._isSame(on,tDate) && this._onToday(cell);
							
							this._setDate(on,cell)
							
							a = document.createElement("a");
							a.href = "javascript:void(0);"
							a.innerHTML = cDate;
							
							cell.appendChild(a);
							
						}
					}
					row.appendChild(cell);
				}
				frag.appendChild(row);
			}
			this._container.html(frag);
			

			$("#"+ this._calendarId +" .year").html(this._options.year);
			$("#"+ this._calendarId +" .month").html(this._options.month);
			
		},
		//判断是否同一日
		_isSame: function(d1, d2) {
			return (d1.getFullYear() == d2.getFullYear() && d1.getMonth() == d2.getMonth() && d1.getDate() == d2.getDate());
		},
		_setDate : function (d , cell){
		
			var that = this,
				date = Date.UTC( d.getFullYear(), d.getMonth(), d.getDate() ),
				outOfRange = false;
									
			switch (this._compareDate){
				case "less":
					if( !( date - that._options.minDate >= 0 ) ){
						outOfRange = true;
						that._setUnavailable(cell);
					}
					break;
				case "between":
					if( !( (that._options.minDate - date < 0 && that._options.maxDate - date  > 0) ) ){
						outOfRange = true;
						that._setUnavailable(cell);
					}
					break;
				case "more":
					if( !(date - that._options.maxDate <= 0) ){
						outOfRange = true;
						that._setUnavailable(cell);
					}
					break;					
			}
			
			//判断是否选中的日期
			if( this._options.setDate!== null && this._isSame(d, this._options.setDate) ){
				if(outOfRange === true){
					alert("你输入的日期超出可选范围");
				}else{
					this._onSelectDay(cell);
				}
			}
		
		},
		_setUnavailable: function(o){
			$(o).addClass("disable");
		},
		_onSelectDay: function(o){
			$(o).addClass("select");
		},
		_onToday: function(o){ 
			$(o).addClass("today");
		},
		//生成日历的框架
		_createFrame: function(){
			var div = document.createElement("div");
			var html = '<div class="ui_calendar_hd">';
			html +=        '<a href="javascript:;" class="pre_y">&lt;&lt;</a> ';
			html +=        '<a href="javascript:;" class="pre_m">&lt;</a> ';
			html +=        '<a href="javascript:;" class="next_y">&gt;&gt;</a>';
	        html +=        '<a href="javascript:;" class="next_m">&gt;</a> ';  
	        html +=        '<span class="calendar_title"><span class="year"></span>年<span class="month"></span>月</span>';
			html +=    '</div>';
			html +=    '<table>';
			html +=        '<thead><tr><td class="weekend">日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td class="weekend">六</td></tr></thead>';
	        html +=        '<tbody></tbody>';
			html +=    '</table>';
			
			div.className = 'ui_calendar';
			div.id = this._calendarId;
			div.innerHTML = html;
			
			
			var target = this._options.target;
			
			(this._options.popup === true) && (div.style.display = "none");
			
			if( this._options.popup === true ){
				if( target !== null){
					document.body.appendChild(div);
					//获取弹出的位置
					this.setPopupPosition();
				}else{
					alert("请设置target参数");
				}
			}else{
				(target !== null) ? target.append(div) : document.body.appendChild(div);
			}
			
			var that = this;
			
			//绑定事件
			$(div).delegate("a","click",function(e){
				var self = this;
				switch (this.className){
					case "pre_m":
						that._preMonth();
						break;
					case "next_m":
						that._nextMonth();
						break;
					case "pre_y":
						that._preYear();
						break;
					case "next_y":
						that._nextYear();
						break;
					default:
						if(self.parentNode.className === "disable"){
							break;
						}
						var date = new Date( that._options.year, that._options.month-1, self.innerHTML );
						
						that.selectDate(date);
						if(that._options.popup === true){
                            var t =  that._options.target,
                                df = that._options.dateFormat;
                            t.is("input") ? t.attr("value", that.getDate(df)) : t.html(that.getDate(df));
							$("#" + that._calendarId).hide();
						}
				}
				
				return false;
			});
			
		},
		setPopupPosition : function(){
			var target = this._options.target,
				calendar = "#" + this._calendarId;
			
			target.click(function(e){
				e.stopPropagation();
				var position = $(this).offset();
				$(calendar).css({"left":position.left,"top":position.top + 25,"position":"absolute","display":"block"});
			});
			//绑定事件
			$("body").click("click",function(e){
				//console.log(e.target);
				$(calendar).hide();
			});
			$(calendar).click(function(e) { 
				e.stopPropagation(); 
			});

		},
		hide : function (){
			$("#" + this._calendarId).hide();
		},
		show : function (){
			$("#" + this._calendarId).show();
		},
		selectDate : function (d){
			this._options.setDate = d;
			this._draw(d);
            //配置的回调函数
            (typeof(this._options.onSelect)==="function") && this._options.onSelect.call(this);
		},
		getDate : function (df){
			if(this._options.setDate === null){
				//alert("你还没有选择日期");
				return false;
			}
            
            var setDate = this._options.setDate,
                printDate ="",
				year =  setDate.getFullYear(),
				month = setDate.getMonth() + 1,
				date = setDate.getDate();

            if(df === "fullDate"){
                printDate = year + "年" + month + "月" + date +"日";	 
            }else{
                printDate = year + "/" + month + "/" + date;	               
            }

            return printDate;
		},
		remove : function (){
			$("#" + this._calendarId).remove();
		}
	}
})(jQuery,window);
