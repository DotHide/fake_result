// Sub show
function SubShowClass(C,i,c,l,I){var V=this,v=V;V.parentObj=V.$(C);if(V.parentObj==null&&C!="none"){throw new Error("SubShowClass(ID)参数错误:ID 对像不存在!(value:"+C+")")};V.lock=false;V.label=[];V.defaultID=c==null?0:c;V.selectedIndex=V.defaultID;V.openClassName=l==null?"selected":l;V.closeClassName=I==null?"":I;V.mouseIn=false;var O=function(){v.mouseIn=true},o=function(){v.mouseIn=false};if(C!="none"&&C!=""){if(V.parentObj.attachEvent){V.parentObj.attachEvent("onmouseover",O)}else{V.parentObj.addEventListener("mouseover",O,false)}};if(C!="none"&&C!=""){if(V.parentObj.attachEvent){V.parentObj.attachEvent("onmouseout",o)}else{V.parentObj.addEventListener("mouseout",o,false)}};if(typeof(i)!="string"){i="onmousedown"};i=i.toLowerCase();switch(i){case "onmouseover":V.eventType="mouseover";break;case "onmouseout":V.eventType="mouseout";break;case "onclick":V.eventType="click";break;case "onmouseup":V.eventType="mouseup";break;default:V.eventType="mousedown"};V.autoPlay=false;V.autoPlayTimeObj=null;V.spaceTime=5000};SubShowClass.prototype={version:"1.31",author:"mengjia",_setClassName:function(l,I){var o=this,i;i=l.className;if(i){i=i.replace(o.openClassName,"");i=i.replace(o.closeClassName,"");i+=" "+(I=="open"?o.openClassName:o.closeClassName)}else{i=(I=="open"?o.openClassName:o.closeClassName)};l.className=i},addLabel:function(labelID,contID,parentBg,springEvent,blurEvent){var t=this,labelObj=this.$(labelID),contObj=this.$(contID);if(labelObj==null&&labelID!="none"){throw new Error("addLabel(labelID)参数错误:labelID 对像不存在!(value:"+labelID+")")};var TempID=this.label.length;if(parentBg==""){parentBg=null};this.label.push([labelID,contID,parentBg,springEvent,blurEvent]);var tempFunc=function(){t.select(TempID)};if(labelID!="none"){if(labelObj.attachEvent){labelObj.attachEvent("on"+this.eventType,tempFunc)}else{labelObj.addEventListener(this.eventType,tempFunc,false)}};if(TempID==this.defaultID){if(labelID!="none"){this._setClassName(labelObj,"open")};if(this.$(contID)){contObj.style.display=""};if(this.ID!="none"){if(parentBg!=null){this.parentObj.style.background=parentBg}};if(springEvent!=null){eval(springEvent)}}else{if(labelID!="none"){this._setClassName(labelObj,"close")};if(contObj){contObj.style.display="none"}};var mouseInFunc=function(){t.mouseIn=true},mouseOutFunc=function(){t.mouseIn=false};if(contObj){if(contObj.attachEvent){contObj.attachEvent("onmouseover",mouseInFunc)}else{contObj.addEventListener("mouseover",mouseInFunc,false)};if(contObj.attachEvent){contObj.attachEvent("onmouseout",mouseOutFunc)}else{contObj.addEventListener("mouseout",mouseOutFunc,false)}}},select:function(num,force){if(typeof(num)!="number"){throw new Error("select(num)参数错误:num 不是 number 类型!(value:"+num+")")};if(force!=true&&this.selectedIndex==num){return};var i;for(i=0;i<this.label.length;i++){if(i==num){if(this.label[i][0]!="none"){this._setClassName(this.$(this.label[i][0]),"open")};if(this.$(this.label[i][1])){this.$(this.label[i][1]).style.display=""};if(this.ID!="none"){if(this.label[i][2]!=null){this.parentObj.style.background=this.label[i][2]}};if(this.label[i][3]!=null){eval(this.label[i][3])}}else if(this.selectedIndex==i||force==true){if(this.label[i][0]!="none"){this._setClassName(this.$(this.label[i][0]),"close")};if(this.$(this.label[i][1])){this.$(this.label[i][1]).style.display="none"};if(this.label[i][4]!=null){eval(this.label[i][4])}}};this.selectedIndex=num},random:function(){var O=this;if(arguments.length!=O.label.length){throw new Error("random()参数错误:参数数量与标签数量不符!(length:"+arguments.length+")")};var l=0,o;for(o=0;o<arguments.length;o++){l+=arguments[o]};var I=Math.random(),i=0;for(o=0;o<arguments.length;o++){i+=arguments[o]/l;if(I<i){O.select(o);break}}},order:function(){var O=this;if(arguments.length!=O.label.length){throw new Error("order()参数错误:参数数量与标签数量不符!(length:"+arguments.length+")")};if(!(/^\d+$/).test(SubShowClass.sum)){return};var i=0,o;for(o=0;o<arguments.length;o++){i+=arguments[o]};var I=SubShowClass.sum%i;if(I==0){I=i};var l=0;for(o=0;o<arguments.length;o++){l+=arguments[o];if(l>=I){O.select(o);break}}},play:function(spTime){var t=this;if(typeof(spTime)=="number"){this.spaceTime=spTime};clearInterval(this.autoPlayTimeObj);this.autoPlayTimeObj=setInterval(function(){t.autoPlayFunc()},this.spaceTime);this.autoPlay=true},autoPlayFunc:function(){var i=this;if(i.autoPlay==false||i.mouseIn==true){return};i.nextLabel()},nextLabel:function(){var t=this,index=this.selectedIndex;index++;if(index>=this.label.length){index=0};this.select(index);if(this.autoPlay==true){clearInterval(this.autoPlayTimeObj);this.autoPlayTimeObj=setInterval(function(){t.autoPlayFunc()},this.spaceTime)}},previousLabel:function(){var t=this,index=this.selectedIndex;index--;if(index<0){index=this.label.length-1};this.select(index);if(this.autoPlay==true){clearInterval(this.autoPlayTimeObj);this.autoPlayTimeObj=setInterval(function(){t.autoPlayFunc()},this.spaceTime)}},stop:function(){var i=this;clearInterval(i.autoPlayTimeObj);i.autoPlay=false},$:function(objName){if(document.getElementById){return eval('document.getElementById("'+objName+'")')}else{return eval('document.all.'+objName)}}};SubShowClass.readCookie=function(O){var o="",l=O+"=";if(document.cookie.length>0){var i=document.cookie.indexOf(l);if(i!=-1){i+=l.length;var I=document.cookie.indexOf(";",i);if(I==-1)I=document.cookie.length;o=unescape(document.cookie.substring(i,I))}};return o};SubShowClass.writeCookie=function(i,l,o,c){var O="",I="";if(o!=null){O=new Date((new Date).getTime()+o*3600000);O="; expires="+O.toGMTString()};if(c!=null){I=";domain="+c};document.cookie=i+"="+escape(l)+O+I};SubShowClass.sum=SubShowClass.readCookie("SSCSum");if((/^\d+$/).test(SubShowClass.sum)){SubShowClass.sum++}else{SubShowClass.sum=1};SubShowClass.writeCookie("SSCSum",SubShowClass.sum,12);
$(document).ready(function() {
	// Animate bar
	window.animateBar = function(){
	    $(".item .precent").each(function(){
	        var pre;
	        $(this).css("width","0px");
	        if ($(this).attr("precent")) {
	            pre = $(this).attr("precent");
	        }
	        else {
	            pre = 0;
	        }
	        $(this).animate({width: pre},"slow");
	    });
	}
	animateBar();

	// Analysis
	;(function(win, $, undefined){
		var 
		doc = win.document
		, analysis_trigger = $("#JS_Analysis_Trigger")
		, analysis_target = $("#JS_Analysis_Target")
		, ACTIVED_CLASS = "analysis-opened";

		var analysisBuilder = function(container, type, callback) {
			this._type = type || "global";
			this.container = container;
			this.buildCallback = callback;
			this.init.apply(this, arguments);
		};
		analysisBuilder.prototype = {
			constructor : analysisBuilder,
			init : function() {
				var me = this;
				me.dataAPI = 'http://survey.sports.sina.com.cn/api/fusioncharts/get_from_data.php?sid=' + $CONFIG.sid + '&aid=' + (me._type === 'global' ? '' : me._type) + '&jsoncallback=?';
				if (!me.container) {
					throw "Container must be specified!"
				}
				if (me.container.attr('loaded') == '1') {
					me.buildCallback.apply(this);
				} else {
					setTimeout(function() {
						$.getJSON(me.dataAPI, function(msg) {
							me.container.html(me.builder(msg, me._type));
							me.container.attr('loaded', '1');
							me.drawPie(msg, me._type);
							if(typeof(me.buildCallback) === 'function') {
								me.buildCallback.apply(this);
							}
						});
					},0);
				}
			},
			clipstring : function(str, start, len, replace) {
				var s = str.replace(/([\u4e00-\u9fa5])/g,"\xff\$1");
			    if(s.length > len) {
			        if(s.length == str.length)return str.substring(start, len);
			        return (s.substring(start, len).replace(/\xff/g, '') + replace);
			    }
			    return str;
			},
			addslashes : function(str) {
				return (str+'').replace(/([\\"'])/g, "\\$1").replace(/\0/g, "\\0");
			},
			builder : function(msg, type) {
				var html = '', prefix = 'JS_Analysis_';
				if(!msg || (msg.constructor == Array && msg.length <= 0)){
			        html += '<div class="analysis-without-data">\u6682\u65e0\u6570\u636e</div>';
			        return html;
			    }
			    /* Tabs */
			    html += '<div class="analysis-pie-tabs"><ul>';
			    var index = 1;
			    for ( var pro in msg ){
			        if (index == 1) {// first
			            html += '<li id="' + prefix + type + '_Tabs_' + index + '" class="selected">';  
			        } else {
			            html += '<li id="' + prefix + type + '_Tabs_' + index + '">';      
			        }
			        html += '\u6309' + pro + '</li>';
			        index++;
			    }
			    html += '</ul></div>';

			    /* Conts */
			    var index = 1;
			    for( var pro in msg ) {
			        html += '<div id="' + prefix + type + '_Cont_' + index + '" class="analysis-pie-area">';
			        html += ' <div class="analysis-pie-flash" id="' + prefix + type + '_Flash_Div_' + index + '"></div>';
			        html += '<div class="analysis-pie-flash-tip" id="' + prefix + type + '_Flash_Tip_' + index + '"></div>';
			        html += '</div>';
			        index++;
			    }
			    return html;
			},
			drawPie : function(msg, type) {
				var prefix = "JS_Analysis_";
				if ( !type || !msg || 
					(msg.constructor==Array && msg.length <= 0)
				) {
			        return false;
			    }
			    //鎵цfusioncharts write js code
			    var index = 1;
			    for(var pro in msg){
			        win[prefix + type + '_fc_'+index] = new FusionCharts("http://www.sinaimg.cn/dy/fusioncharts/v3/flash/Pie3D.swf?PBarLoadingText=Loading&XMLLoadingText=Loading&ParsingDataText=Loading",prefix + type + "_Flash_" + index, "620", "360", "0", "0");
			       
			        var xml = this.getXML( type, msg[pro], index);
			        win[prefix+type+'_fc_'+index].setTransparent(1);
			        win[prefix+type+'_fc_'+index].setDataXML(xml);
			        win[prefix+type+'_fc_'+index].render(prefix + type + "_Flash_Div_"+index);
			        //杩藉姞area-flash-tip, e.g :閫夋嫨琛屼笟鐨勭敤鎴峰崰40% 
			        /*document.getElementById(prefix+type+'_flash_div_'+index+'_tip').innerHTML = get_area_flash_tip(pro,msg[pro]);*/
			        $("#" + prefix + type + "_Flash_Tip_" + index).html(this.getTip(pro, msg[pro]));
			        index++;
			    }                   
			    
			    var index = 1;
			    win[prefix+type+'_SubShow'] = new SubShowClass("none",'onmousedown',0,'selected','');
			    for(var pro in msg) {
			        win[prefix+type+'_SubShow'].addLabel(prefix +type+'_Tabs_'+index, prefix +type+"_Cont_"+index);
			        index++;
			    }
			    return true;
			},
			getTip : function(item_name,item_data) {
			    if(item_name == '\u5730\u533A'){
			        return '';  
			    }
			    tip = "\u9009\u62E9"+item_name +"\u7684\u7528\u6237\u5360";
			    percent = '';
			    if(item_data && item_data['\u672A\u77E5'] && item_data['\u672A\u77E5']['percent']){
			        percent = parseFloat(item_data['\u672A\u77E5']['percent']);
			        percent = 100 - percent;
			        percent = percent.toFixed(1);
			        percent += '%';
			    }else{
			        percent = '100%';   
			    }   
			    return tip + percent;
			},
			getXML : function(type, msg, index) {
				var me = this;
				if(!type || !index || !msg || (msg.constructor==Array && msg.length <= 0)){
			        return '<chart></chart>';
			    }
			    xml = '';
			    
			    xml += "<chart baseFontSize='12' numberSuffix='%' showAboutMenuItem='0' decimals='1' chartTopMargin='0' chartBottomMargin='0' caption='' showValues='0' formatNumberScale='0' bgAlpha='0' logoURL='http://www.sinaimg.cn/dy/deco/2009/0903/survey/wmark_pie3.png' logoPosition='TR' startingAngle='60'>";
			    var subindex = 1;
			    for(var pro in msg){
			        var toolText = pro;
			        toolText = toolText.replace(/\'/g,'');
			        toolText = me.clipstring(toolText, 0, 30, '...');
			        toolText = me.addslashes(toolText);
			        toolText += ' (' + msg[pro].percent + '%)';
			    
			        if(subindex != 1){
			            xml +="<set label='"+toolText+"' value='"+msg[pro].amount+"' toolText='" + toolText + "' displayValue='" + toolText + "' />"; 
			        }else{
			            xml +="<set label='"+toolText+"' value='"+msg[pro].amount+"' toolText='" + toolText + "' displayValue='" + toolText + "' isSliced='1' />";
			        }
			        
			        subindex++;
			    }   
			    xml +="</chart>";
			    return xml;
			}
		};

		win.hideUAResult = function() {
			analysis_target.slideUp("fast", function() {
				analysis_trigger.removeClass(ACTIVED_CLASS);
			});		
		}

		win.showUAResult = function() {
			new analysisBuilder(analysis_target, null , function() {
				analysis_target.slideDown("fast", function() {
					analysis_trigger.addClass(ACTIVED_CLASS);
				});
			});
		}

		/*var subshow = new SubShowClass("none","onmousedown");
		subshow.addLabel("JS_Analysis_Tab01", "JS_Analysis_Cont01");
		subshow.addLabel("JS_Analysis_Tab02", "JS_Analysis_Cont02");*/
		
		$("body").delegate("[action-type='toggle-analysis']","click",function() {
			analysis_trigger.hasClass(ACTIVED_CLASS) 
			? win.hideUAResult() : win.showUAResult();
		});
		$("body").delegate("[action-type='hide-analysis']","click",function() {
			analysis_trigger.hasClass(ACTIVED_CLASS) 
			&& win.hideUAResult();
		});
		
	})(window, jQuery);

	// Tabs for chart & pie
	var subshow = new SubShowClass("none","onmousedown");
	subshow.addLabel("JS_Tab_01", "JS_Content_01","","animateBar();hideUAResult();");
	subshow.addLabel("JS_Tab_02", "JS_Content_02","","hideUAResult();");

	
});
