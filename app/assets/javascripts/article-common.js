/*!
sina.com.cn/license
20131119133036
*/

// [${p_id},${t_id},${d_id}] published at ${publishdate} ${publishtime}
/**
 * SAB_BASE.js
 */

/*window.onerror = (function() {
	var killerror = function(){
		return true;
	}
	if(location.href.indexOf('showerror')==-1){
		return killerror;
	}else{
		return null;
	}
})();*/
var $globalInfo = $globalInfo||{};
if(typeof $globalInfo.SABLoaded == 'undefined'){
	$globalInfo.SABLoaded = false;
	var SAB = (function(){
		var it = {};
		//getElementById
		it.E = function(id){
			if (typeof id === "string") {
				return document.getElementById(id);
			}
			return id;
		};
		//createElement
		it.C = function(tag){
			tag = tag.toUpperCase();
			if (tag == 'TEXT') {
				return document.createTextNode('');
			}
			if (tag == 'BUFFER') {
				return document.createDocumentFragment();
			}
			return document.createElement(tag);
		};
		//register
		it.register = function(namespace, method) {
	        var i   = 0,
				un  = it,
				ns  = namespace.split('.'),
				len = ns.length,
				upp = len - 1,
				key;
			while(i<len){
				key = ns[i];
				if(i==upp){
					if(un[key] !== undefined){
						throw ns + ':: has registered';
					}
					un[key] = method(it);
				}
				if(un[key]===undefined){
					un[key] = {}
				}
				un = un[key];
				i++
			}
	    };
		//register short
		it.regShort = function(key, method){
			if (it[key] !== undefined) {
				throw key + ':: has registered';
			}
	        it[key] = method;
		};
		var Detect = function(){
	        var ua = navigator.userAgent.toLowerCase();
	        this.isIE = /msie/.test(ua);
	        this.isOPERA = /opera/.test(ua);
	        this.isMOZ = /gecko/.test(ua);
	        this.isIE5 = /msie 5 /.test(ua);
	        this.isIE55 = /msie 5.5/.test(ua);
	        this.isIE6 = /msie 6/.test(ua);
	        this.isIE7 = /msie 7/.test(ua);
	        this.isSAFARI = /safari/.test(ua);
	        this.iswinXP = /windows nt 5.1/.test(ua);
	        this.iswinVista = /windows nt 6.0/.test(ua);
	        this.isFF = /firefox/.test(ua);
	        this.isIOS = /\((iPhone|iPad|iPod)/i.test(ua);
	    };
	    $globalInfo.ua = new Detect();
		return it;
	})();
}else{
	SAB._register = SAB.register;
	SAB.register = function(m,n){}
}


SAB.register('dom.ready', function(){
	var  fns     = []
		,isReady = 0
		,inited  = 0
		,isReady = 0;

	var checkReady = function(){
		if(document.readyState === 'complete'){
			return 1;
		}
		return isReady;
	};

	var onReady = function(type){
		if(isReady){return}
		isReady = 1;

		if(fns){
			while (fns.length) {
				fns.shift()()
			}
		}
		fns = null
	};

	var bindReady = function(){
		if(inited){return}
		inited = 1;

		//开始初始化domReady函数，判定页面的加载情况
		if (document.readyState === "complete") {
			onReady();
		} else if (document.addEventListener) {
			document.addEventListener("DOMContentLoaded", function() {
				document.removeEventListener("DOMContentLoaded", arguments.callee, false);
				onReady();
			}, false);
			//不加这个有时chrome firefox不起作用
			window.addEventListener( "load", function(){
				window.removeEventListener("load", arguments.callee, false);
				onReady();
			}, false );
		} else {
			document.attachEvent("onreadystatechange", function() {
				if (document.readyState == "complete") {
					document.detachEvent("onreadystatechange", arguments.callee);
					onReady();
				}
			});
			(function() {
				if (isReady) {
					return;
				}
				var node = new Image
				try {
					node.doScroll();
					node = null //防止IE内存泄漏
				} catch (e) {
					setTimeout(arguments.callee, 64);
					return;
				}
				onReady();
			})();
		}
	};

	return function(fn){
		bindReady();
		if(!checkReady()){
			fns.push(fn);
			return;
		}
		//onReady();
		fn.call();
	}
});
SAB.register('dom.hasClass', function($){
	return function(ele,cls){
	    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
	}
});
SAB.register('dom.addClass', function($){
	return function(ele, cls){
	    if (!$.dom.hasClass(ele, cls)) {
	    		ele.className += " " + cls;
	    	}
	}
});
SAB.register('dom.removeClass', function($){
	return function(ele, cls){
	    if ($.dom.hasClass(ele, cls)) {
			var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
			ele.className = ele.className.replace(reg, '');
		}
	}
});
SAB.register('dom.getScrollPos', function($){
	return function(doc){
	    doc = doc || document;
	    var dd = doc.documentElement;
	    var db = doc.body;
	    return [
	    		Math.max(dd.scrollTop, db.scrollTop),
	    		Math.max(dd.scrollLeft, db.scrollLeft),
	    		Math.max(dd.scrollWidth, db.scrollWidth),
	    		Math.max(dd.scrollHeight, db.scrollHeight)
	    		];
	}
});
SAB.register('dom.getStyle', function($){
	    var getStyle = function (el, property) {
	    	switch (property) {
	    		// 透明度
	    		case "opacity":
	    			var val = 100;
	    			try {
	    					val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;
	    			}
	    			catch(e) {
	    				try {
	    					val = el.filters('alpha').opacity;
	    				}catch(e){}
	    			}
	    			return val/100;
	    		 // 浮动
	    		 case "float":
	    			 property = "styleFloat";
	    		 default:
	    			 var value = el.currentStyle ? el.currentStyle[property] : null;
	    			 return ( el.style[property] || value );
	    	}
	    };
	    if(!$globalInfo.ua.isIE) {
			getStyle = function (el, property) {
				// 浮动
				if(property == "float") {
					property = "cssFloat";
				}
				// 获取集合
				try{
					var computed = document.defaultView.getComputedStyle(el, "");
				}
				catch(e) {
					traceError(e);
				}
				return el.style[property] || computed ? computed[property] : null;
			};
		}
	return getStyle;
});
SAB.register('dom.getXY', function($){
	var getStyle = $.dom.getStyle;
	var getScrollPos = $.dom.getScrollPos;
	var getXY = function (el) {
		if ((el.parentNode == null || el.offsetParent == null || getStyle(el, "display") == "none") && el != document.body) {
			return false;
		}
		var parentNode = null;
		var pos = [];
		var box;
		var doc = el.ownerDocument;
		// IE
		box = el.getBoundingClientRect();
		var scrollPos = getScrollPos(el.ownerDocument);
		return [box.left + scrollPos[1], box.top + scrollPos[0]];
		// IE end
		parentNode = el.parentNode;
		while (parentNode.tagName && !/^body|html$/i.test(parentNode.tagName)) {
			if (getStyle(parentNode, "display").search(/^inline|table-row.*$/i)) {
				pos[0] -= parentNode.scrollLeft;
				pos[1] -= parentNode.scrollTop;
			}
			parentNode = parentNode.parentNode;
		}
		return pos;
	};
	if(!$globalInfo.ua.isIE) {
		getXY = function (el) {
			if ((el.parentNode == null || el.offsetParent == null || getStyle(el, "display") == "none") && el != document.body) {
				return false;
			}
			var parentNode = null;
			var pos = [];
			var box;
			var doc = el.ownerDocument;

			var isSAFARI = $globalInfo.ua.isSAFARI;

			// FF
			pos = [el.offsetLeft, el.offsetTop];
			parentNode = el.offsetParent;
			var hasAbs = getStyle(el, "position") == "absolute";

			if (parentNode != el) {
				while (parentNode) {
						pos[0] += parentNode.offsetLeft;
						pos[1] += parentNode.offsetTop;
						if (isSAFARI && !hasAbs && getStyle(parentNode,"position") == "absolute" ) {
								hasAbs = true;
						}
						parentNode = parentNode.offsetParent;
				}
			}

			if (isSAFARI && hasAbs) {
				pos[0] -= el.ownerDocument.body.offsetLeft;
				pos[1] -= el.ownerDocument.body.offsetTop;
			}
			parentNode = el.parentNode;
			// FF End
			while (parentNode.tagName && !/^body|html$/i.test(parentNode.tagName)) {
				if (getStyle(parentNode, "display").search(/^inline|table-row.*$/i)) {
					pos[0] -= parentNode.scrollLeft;
					pos[1] -= parentNode.scrollTop;
				}
				parentNode = parentNode.parentNode;
			}
			return pos;
		};
	}
	return getXY;
});
SAB.register('dom.isNode', function($){
	return function(oNode){
	    return !!((oNode != undefined) && oNode.nodeName && oNode.nodeType);
	}
});
SAB.register('str.trim', function($){
	return function(str){
		//return str.replace(/(^\s*)|(\s*$)/g, "");
		//包括全角空格
		return str.replace(/(^[\s\u3000]*)|([\s\u3000]*$)/g, "");
	};
});
SAB.register('str.encodeDoubleByte', function($){
	return function (str) {
		if(typeof str != "string") {
			return str;
		}
		return encodeURIComponent(str);
	};
});
SAB.register('str.encodeHTML', function($){
	return function(str){
		var s = '';
		var div = document.createElement("div");
		div.appendChild(document.createTextNode(str));
		//(div.textContent != null) ? (div.textContent = str) : (div.innerText = str);
		s = div.innerHTML;
		div = null;
		s = s.replace( /(&lt;br\/&gt;){1,}/ig, "<br/>" );
		s = s.replace(/\s/g, "&nbsp;")
		return s;
	};
});
SAB.register('str.byteLength', function($){
	return function(str){
		if(typeof str == "undefined"){
			return 0;
		}
		var aMatch = str.match(/[^\x00-\x80]/g);
		return (str.length + (!aMatch ? 0 : aMatch.length));
	};
});
SAB.register('arr.indexOf', function($){
	return function(oElement, aArray){
		if (aArray.indexOf) {
			return aArray.indexOf(oElement);
		}
		var i = 0, len = aArray.length;
		while(i<len){
			if (aArray[i] === oElement) {
				return i;
			}
			i++
		}
		return -1;
	};
});
SAB.register('arr.inArray', function($){
	return function(oElement, aSource){
		return $.arr.indexOf(oElement, aSource) > -1;
	};
});

SAB.register('arr.foreach', function($){
	return function(aArray, insp){
		if (!$.arr.isArray(aArray)) {
			throw 'the foreach function needs an array as first parameter';
		}
		var i = 0, len = aArray.length, ret = [];
		while(i<len){
			var snap = insp(aArray[i], i);
			if(snap === false){break}
			if(snap !== null) {ret[i] = snap}
			i++
		}
		return ret;
	};
});
SAB.register('arr.isArray', function($){
	return function(o){
	  return Object.prototype.toString.call(o) === '[object Array]';
	};
});
SAB.register('obj.isEmpty',function($){
	return function(o,isprototype){
		var ret = true;
		for(var k in o){
			if(isprototype){
				ret = false;
				break;
			}else{
				if(o.hasOwnProperty(k)){
					ret = false;
					break;
				}
			}
		}
		return ret;
	};
});
SAB.register('obj.extend',function($){
	return  function(target,source) {
		for (var property in source) {
			target[property] = source[property];
		}
		return target;
	}
});
SAB.register('json.jsonToQuery',function($){
	var _fdata   = function(data,isEncode){
		data = data == null? '': data;
		data = $.trim(data.toString());
		if(isEncode){
			return encodeURIComponent(data);
		}else{
			return data;
		}
	};
	return function(JSON,isEncode){
		var _Qstring = [];
		if(typeof JSON == "object"){
			for(var k in JSON){
				if(JSON[k] instanceof Array){
					for(var i = 0, len = JSON[k].length; i < len; i++){
						_Qstring.push(k + "=" + _fdata(JSON[k][i],isEncode));
					}
				}else{
					if(typeof JSON[k] != 'function'){
						_Qstring.push(k + "=" +_fdata(JSON[k],isEncode));
					}
				}
			}
		}
		if(_Qstring.length){
			return _Qstring.join("&");
		}else{
			return "";
		}
	};
});
SAB.register('json.queryToJson',function($){
	return function(QS, isDecode){
		var _Qlist = $.str.trim(QS).split("&");
		var _json  = {};
		var _fData = function(data){
			if(isDecode){
				return decodeURIComponent(data);
			}else{
				return data;
			}
		};
		for(var i = 0, len = _Qlist.length; i < len; i++){
			if(_Qlist[i]){
				_hsh = _Qlist[i].split("=");
				_key = _hsh[0];
				_value = _hsh[1];

				// 如果只有key没有value, 那么将全部丢入一个$nullName数组中
				if(_hsh.length < 2){
					_value = _key;
					_key = '$nullName';
				}
				// 如果缓存堆栈中没有这个数据
				if(!_json[_key]) {
					_json[_key] = _fData(_value);
				}
				// 如果堆栈中已经存在这个数据，则转换成数组存储
				else {
					if($.arr.isArray(_json[_key]) != true) {
						_json[_key] = [_json[_key]];
					}
					_json[_key].push(_fData(_value));
				}
			}
		}
		return _json;
	};
});
SAB.register('evt.addEvent',function($){
	return function(elm, evType,func, useCapture) {
		var _el = $.dom.byId(elm);
		if(_el == null){
			throw new Error("addEvent 找不到对象：" + elm);
			return;
		}
		if (typeof useCapture == 'undefined') {
			useCapture = false;
		}
		if (typeof evType == 'undefined') {
			evType = 'click';
		}
		if (_el.addEventListener) {
			_el.addEventListener(evType, func, useCapture);
			return true;
		}
		else if (_el.attachEvent) {
			var r = _el.attachEvent('on' + evType, func);
			return true;
		}
		else {
			_el['on' + evType] = func;
		}
	};
});
SAB.register('evt.removeEvent',function($){
	return function (oElement,sName, fHandler) {
		var _el = $.dom.byId(oElement);
		if(_el == null){
			throw ("removeEvent 找不到对象：" + oElement);
			return;
		}
		if (typeof fHandler != "function") {
			return;
		}
		if (typeof sName == 'undefined') {
			sName = 'click';
		}
		if (_el.addEventListener) {
			_el.removeEventListener(sName, fHandler, false);
		}
		else if (_el.attachEvent) {
			_el.detachEvent("on" + sName, fHandler);
		}
		fHandler[sName] = null;
	};
});
SAB.register('evt.fixEvent',function($){
	return fixEvent = function (e) {
		if(typeof e == 'undefined')e = window.event;
		if (!e.target) {
			e.target = e.srcElement;
			e.pageX = e.x;
			e.pageY = e.y;
		}
		if(typeof e.layerX == 'undefined')e.layerX = e.offsetX;
		if(typeof e.layerY == 'undefined')e.layerY = e.offsetY;
		return e;
	};
});
SAB.register('evt.preventDefault',function($){
	return function (e) {
		var e = e||window.event;
		if ($globalInfo.ua.isIE) {
		    e.returnValue = false;
		} else {
		    e.preventDefault();
		}
	};
});
//byid
SAB.register('dom.byId',function($){
	return function(id){
        if (typeof id === 'string') {
            return document.getElementById(id);
        }
        else {
            return id;
        }
    };
});
//byclass
SAB.register('dom.byClass',function($){
	return function(clz,el,tg){
		el = el || document;
		el = typeof el=='string'?$.dom.byId(el):el;
		tg = tg || '*';
		var rs = [];
		clz = " " + clz +" ";
		var cldr = el.getElementsByTagName(tg), len = cldr.length;
		for (var i = 0; i < len; ++ i){
			var o = cldr[i];
			if (o.nodeType == 1){
				var ecl = " " + o.className + " ";
				if (ecl.indexOf(clz) != -1){
					rs[rs.length] = o;
				}
			}
		}
		return rs;
	};
});
//byattr
SAB.register('dom.byAttr',function($){
	return function(node, attname, attvalue){
		var nodes = [];
		attvalue = attvalue||'';
		var getAttr = function(node){
				return node.getAttribute(attname);
			};
		for(var i = 0, l = node.childNodes.length; i < l; i ++){
			if(node.childNodes[i].nodeType == 1){
				var fit = false;
				if(attvalue){
					fit = (getAttr(node.childNodes[i]) == attvalue);
				}else{
					fit = (getAttr(node.childNodes[i]) !='')
				}
				if(fit){
					nodes.push(node.childNodes[i]);
				}
				if(node.childNodes[i].childNodes.length > 0){
					nodes = nodes.concat(arguments.callee.call(null, node.childNodes[i], attname, attvalue));
				}
			}
		}
		return nodes;
	};
});
SAB.register('dom.builder', function($) {
		var _byAttr = $.dom.byAttr;
		return function(wrap, type) {
			var list, nodes;
			nodes = _byAttr(wrap,type);
			list = {};
			for(var i = 0, len = nodes.length; i < len; i++) {
				var j = nodes[i].getAttribute(type);
				if(!j){
					continue;
				}
				list[j] || (list[j] = []);
				list[j].push(nodes[i])
			}
			return {
				box: wrap,
				list: list
			};
		}
	});

SAB.register('dom.contains', function($){
	return function(root, el) {
        if (root.compareDocumentPosition)
             return root === el || !!(root.compareDocumentPosition(el) & 16);
         if (root.contains && el.nodeType === 1){
             return root.contains(el) && root !== el;
         }
         while ((el = el.parentNode)){
             if (el === root){
             	return true;
             }
         }
         return false;
    };
});
// 自定义事件
SAB.register("evt.custEvent", function($) {

	var _custAttr = "__custEventKey__",
		_custKey = 1,
		_custCache = {},
		/**
		 * 从缓存中查找相关对象
		 * 当已经定义时
		 * 	有type时返回缓存中的列表 没有时返回缓存中的对象
		 * 没有定义时返回false
		 * @param {Object|number} obj 对象引用或获取的key
		 * @param {String} type 自定义事件名称
		 */
		_findObj = function(obj, type) {
			var _key = (typeof obj == "number") ? obj : obj[_custAttr];
			return (_key && _custCache[_key]) && {
				obj: (typeof type == "string" ? _custCache[_key][type] : _custCache[_key]),
				key: _key
			};
		};

	return {
		/**
		 * 对象自定义事件的定义 未定义的事件不得绑定
		 * @method define
		 * @static
		 * @param {Object|number} obj 对象引用或获取的下标(key); 必选
		 * @param {String|Array} type 自定义事件名称; 必选
		 * @return {number} key 下标
		 */
		define: function(obj, type) {
			if(obj && type) {
				var _key = (typeof obj == "number") ? obj : obj[_custAttr] || (obj[_custAttr] = _custKey++),
					_cache = _custCache[_key] || (_custCache[_key] = {});
				type = [].concat(type);
				for(var i = 0; i < type.length; i++) {
					_cache[type[i]] || (_cache[type[i]] = []);
				}
				return _key;
			}
		},

		/**
		 * 对象自定义事件的取消定义
		 * 当对象的所有事件定义都被取消时 删除对对象的引用
		 * @method define
		 * @static
		 * @param {Object|number} obj 对象引用或获取的(key); 必选
		 * @param {String} type 自定义事件名称; 可选 不填可取消所有事件的定义
		 */
		undefine: function(obj, type) {
			if (obj) {
				var _key = (typeof obj == "number") ? obj : obj[_custAttr];
				if (_key && _custCache[_key]) {
					if (typeof type == "string") {
						if (type in _custCache[_key]) delete _custCache[_key][type];
					} else {
						delete _custCache[_key];
					}
				}
			}
		},

		/**
		 * 事件添加或绑定
		 * @method add
		 * @static
		 * @param {Object|number} obj 对象引用或获取的(key); 必选
		 * @param {String} type 自定义事件名称; 必选
		 * @param {Function} fn 事件处理方法; 必选
		 * @param {Any} data 扩展数据任意类型; 可选
		 * @return {number} key 下标
		 */
		add: function(obj, type, fn, data) {
			if(obj && typeof type == "string" && fn) {
				var _cache = _findObj(obj, type);
				if(!_cache || !_cache.obj) {
					throw "custEvent (" + type + ") is undefined !";
				}
				_cache.obj.push({fn: fn, data: data});
				return _cache.key;
			}
		},

		/**
		 * 事件删除或解绑
		 * @method remove
		 * @static
		 * @param {Object|number} obj 对象引用或获取的(key); 必选
		 * @param {String} type 自定义事件名称; 可选; 为空时删除对象下的所有事件绑定
		 * @param {Function} fn 事件处理方法; 可选; 为空且type不为空时 删除对象下type事件相关的所有处理方法
		 * @return {number} key 下标
		 */
		remove: function(obj, type, fn) {
			if (obj) {
				var _cache = _findObj(obj, type), _obj;
				if (_cache && (_obj = _cache.obj)) {
					if ($.arr.isArray(_obj)) {
						if (fn) {
							for (var i = 0; i < _obj.length && _obj[i].fn !== fn; i++);
							_obj.splice(i, 1);
						} else {
							_obj.splice(0);
						}
					} else {
						for (var i in _obj) {
							_obj[i] = [];
						}
					}
					return _cache.key;
				}
			}
		},

		/**
		 * 事件触发
		 * @method fire
		 * @static
		 * @param {Object|number} obj 对象引用或获取的(key); 必选
		 * @param {String} type 自定义事件名称; 必选
		 * @param {Any|Array} args 参数数组或单个的其他数据; 可选
		 * @return {number} key 下标
		 */
		fire: function(obj, type, args) {
			if(obj && typeof type == "string") {
				var _cache = _findObj(obj, type), _obj;
				if (_cache && (_obj = _cache.obj)) {
					if(!$.arr.isArray(args)) {
						args = args != undefined ? [args] : [];
					}
					for(var i = 0; i < _obj.length; i++) {
						var fn = _obj[i].fn;
						if(fn && fn.apply) {
							fn.apply($, [{type: type, data: _obj[i].data}].concat(args));
						}
					}
					return _cache.key;
				}
			}
		},
		/**
		 * 销毁
		 * @method destroy
		 * @static
		 */
		destroy: function() {
			_custCache = {};
			_custKey = 1;
		}
	};
});
// 事件委派
SAB.register('evt.delegatedEvent',function($){

	var checkContains = function(list,el){
		for(var i = 0, len = list.length; i < len; i += 1){
			if($.dom.contains(list[i],el)){
				return true;
			}
		}
		return false;
	};

	return function(actEl,expEls){
		if(!$.dom.isNode(actEl)){
			throw 'SAB.evt.delegatedEvent need an Element as first Parameter';
		}
		if(!expEls){
			expEls = [];
		}
		if($.arr.isArray(expEls)){
			expEls = [expEls];
		}
		var evtList = {};
		var bindEvent = function(e){
			var evt = $.evt.fixEvent(e);
			var el = evt.target;
			var type = e.type;
			if(checkContains(expEls,el)){
				return false;
			}else if(!$.dom.contains(actEl, el)){
				return false;
			}else{
				var actionType = null;
				var checkBuble = function(){
					if(evtList[type] && evtList[type][actionType]){
						return evtList[type][actionType]({
							'evt' : evt,
							'el' : el,
							'e' :e,
							'data' : $.json.queryToJson(el.getAttribute('action-data') || '')
						});
					}else{
						return true;
					}
				};
				while(el && el !== actEl){
					if(!el.getAttribute){
						break;
					}
					actionType = el.getAttribute('action-type');
					if(checkBuble() === false){
						break;
					}
					el = el.parentNode;
				}

			}
		};
		var that = {};
		/**
		 * 添加代理事件
		 * @method add
		 * @param {String} funcName
		 * @param {String} evtType
		 * @param {Function} process
		 * @return {void}
		 * @example
		 * 		document.body.innerHTML = '<div id="outer"><a href="###" action_type="alert" action_data="test=123">test</a><div id="inner"></div></div>'
		 * 		var a = STK.core.evt.delegatedEvent($.E('outer'),$.E('inner'));
		 * 		a.add('alert','click',function(spec){window.alert(spec.data.test)});
		 *
		 */
		that.add = function(funcName, evtType, process){
			if(!evtList[evtType]){
				evtList[evtType] = {};
				$.evt.addEvent(actEl,evtType, bindEvent );
			}
			var ns = evtList[evtType];
			ns[funcName] = process;
		};
		/**
		 * 移出代理事件
		 * @method remove
		 * @param {String} funcName
		 * @param {String} evtType
		 * @return {void}
		 * @example
		 * 		document.body.innerHTML = '<div id="outer"><a href="###" action_type="alert" action_data="test=123">test</a><div id="inner"></div></div>'
		 * 		var a = STK.core.evt.delegatedEvent($.E('outer'),$.E('inner'));
		 * 		a.add('alert','click',function(spec){window.alert(spec.data.test)});
		 * 		a.remove('alert','click');
		 */
		that.remove = function(funcName, evtType){
			if(evtList[evtType]){
				delete evtList[evtType][funcName];
				if($.obj.isEmpty(evtList[evtType])){
					delete evtList[evtType];
					$.evt.removeEvent(actEl, bindEvent, evtType);
				}
			}
		};

		that.pushExcept = function(el){
			expEls.push(el);
		};

		that.removeExcept = function(el){
			if(!el){
				expEls = [];
			}else{
				for(var i = 0, len = expEls.length; i < len; i += 1){
					if(expEls[i] === el){
						expEls.splice(i,1);
					}
				}
			}

		};

		that.clearExcept = function(el){
			expEls = [];
		};

		that.destroy = function(){
			for(k in evtList){
				for(l in evtList[k]){
					delete evtList[k][l];
				}
				delete evtList[k];
				$.evt.removeEvent(actEl, bindEvent, k);
			}
		};
		return that;
	};

});
//SAB.register('fun.bind2',function($){
SAB.register('fun.bind2',function($){
	/**
	 * 保留原型扩展
	 * stan | chaoliang@staff.sina.com.cn
	 * @param {Object} object
	 */
	Function.prototype.bind2 = function(object) {
		var __method = this;
		return function() {
		   return __method.apply(object, arguments);
		};
	};
	return function(fFunc, object) {
		var __method = fFunc;
		return function() {
			return __method.apply(object, arguments);
		};
	};

});
SAB.register('io.jsonp',function($){
	/**
	 * jsonp
	 * @param  {String}   url      url
	 * @param  {String}   params   params
	 * @param  {Function||String} callback 回调函数，当fix为true时，要求为函数名，即字符串
	 * @param  {Boolean}   fix      是否要回调固定函数，默认为为false，在dpc=1时为true
	 */
	return function(url, params, callback,fix) {
		var byId = $.dom.byId;
		var idStr = url+'&'+params;
		var fun = '';
		if (byId(url)) {
			document.body.removeChild(byId(url));
		}
		fix = fix||false;
		if(!fix){
			//添加时间戳
			url = url + ((url.indexOf('?') == -1) ? '?' : '&') + '_t=' + Math.random();
			//添加回调
			if (typeof callback == 'function') {
				fun = 'fun_' + new Date().getUTCMilliseconds() + ('' + Math.random()).substring(3);
				eval(fun + '=function(res){callback(res)}');
			}
		}else{
			if(typeof callback == 'string'){
				fun = callback;
			}
		}
		url = url + '&callback=' + fun;
		//添加参数,放在最后，dpc=1一般放在最后
		url = url+'&'+params;
		var head_dom = document.getElementsByTagName('head')[0];
		var old_script = byId(idStr);
		if(old_script){
			head_dom.removeChild(old_script);
		}
		var script_dom = $.C('script');
		script_dom.src  =   url;
		script_dom.id   =   idStr;
		script_dom.type =  'text/javascript';
		script_dom.language = 'javascript';
		head_dom.appendChild(script_dom);

	};
});
SAB.register('io.ajax',function($){
	//TODO
		/**
		 * 创建 XMLHttpRequest 对象
		 */
	return {
		createRequest:function() {
			var request = null;
			try {
				request = new XMLHttpRequest();
			} catch (trymicrosoft) {
				try {
					request = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (othermicrosoft) {
					try {
						request = ActiveXObject("Microsoft.XMLHTTP");
					} catch (failed) {}
				}
			}
			if(request == null){
				throw ("<b>create request failed</b>", {'html':true});
			}
			else {
				return request;
			}
		},
		/**
		 * 请求参数接收
		 *
		 * @param url 必选参数。请求数据的URL，是一个 URL 字符串，不支持数组
		 * @param option 可选参数 {
		 *  onComplete  : Function (Array responsedData),
		 *  onException : Function (),
		 *  returnType : "txt"/"xml"/"json", 返回数据类型
		 *  GET : {}, 通过 GET 提交的数据
		 *  POST : {} 通过 POST 提交的数据
		 * }
		 */
		request : function (url, option) {
			option = option || {};
			option.onComplete = option.onComplete || function () {};
			option.onException = option.onException || function () {};
			option.onTimeout = option.onTimeout || function () {};
			option.timeout = option.timeout? option.timeout: -1;
			option.returnType = option.returnType || "txt";
			option.method = option.method || "get";
			option.data = option.data || {};
			if(typeof option.GET != "undefined" && typeof option.GET.url_random != "undefined" && option.GET.url_random == 0){
				this.rand = false;
				option.GET.url_random = null;
			}
			this.loadData(url, option);
		},
		/**
		 * 载入指定数据
		 * @param {Object} url
		 * @param {Object} option
		 */
		loadData: function (url, option) {
			var request = this.createRequest(), tmpArr = [];
			var _url = new $.util.url(url);

			var timer;
			// 如果有需要 POST 的数据，加以整理
			if(option.POST){
				for (var postkey in option.POST) {
					var postvalue = option.POST[postkey];
					if(postvalue != null){
						tmpArr.push(postkey + '=' + $.str.encodeDoubleByte(postvalue));
					}
				}
			}
			var sParameter = tmpArr.join("&") || "";
			// GET 方式提交的数据都放入地址中
			if (option.GET) {
				for(var key in option.GET){
					if (key != "url_random") {
						_url.setParam(key, $.str.encodeDoubleByte(option.GET[key]));
					}
				}
			}
			if (this.rand != false) {
				// 接口增加随机数
				_url.setParam("rnd", Math.random());
			}

			if (option.timeout > -1) {
				timer = setTimeout(option.onTimeout, option.timeout);
			}

			// 处理回调
			request.onreadystatechange = function() {
				if(request.readyState == 4){
					var response, type = option.returnType;
					try{
						// 根据类型返回不同的响应
						switch (type){
							case "txt":
								response = request.responseText;
								break;
							case "xml":
								if (Core.Base.detect.$IE) {
									response = request.responseXML;
								}
								else {
									var Dparser = new DOMParser();
									response = Dparser.parseFromString(request.responseText, "text/xml");
								}
								break;
							case "json":
									response = eval("(" + request.responseText + ")");
								break;
						}
						option.onComplete(response);
						clearTimeout(timer);
					}
					catch(e){
						option.onException(e.message, _url);
						return false;
					}
				}
			};
			try{
				// 发送请求
				if(option.POST){
					request.open("POST", _url, true);
					request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
					request.send(sParameter);
				}
				else {
					request.open("GET", _url, true);
					request.send(null);
				}
			}
			catch(e){
				option.onException(e.message, _url);
				return false;
			}
		}
	};

});
SAB.register('io.ijax',function($){
	return {
			/**
			 * 保存缓冲的任务列表
			 */
			arrTaskLists : [],
			/**
			 * 创建 iframe 节点用于载入数据，因为支持双线程，同时建立两个，减少 DOM 操作次数
			 */
			createLoadingIframe: function () {
				if(this.loadFrames != null){
					return false;
				}
				/**
				 * 生成随机 ID 来保证提交到当前页面的数据交互 iframe
				 * L.Ming | liming1@staff.sina.com.cn 2009-01-11
				 */
				var rndId1 = "loadingIframe_thread" + Math.ceil(Math.random() * 10000);
				var rndId2 = "loadingIframe_thread" + Math.ceil((Math.random() + 1) * 10000);
				this.loadFrames = [rndId1, rndId2];

				var iframeSrc = '';
				if($globalInfo.ua.isIE6){
					// ie6 父页面或在iframe页面中设置document.domain后，无论是和当前域名相同还是根域名，一律视为跨域
					iframeSrc = "javascript:void((function(){document.open();document.domain='sina.com.cn';document.close()})())";
				}
			    var html = '<iframe id="' + rndId1 +'" name="' + rndId1 +'" class="invisible"\
			              scrolling="no" src=""\
			              allowTransparency="true" style="display:none;" frameborder="0"\
			              ><\/iframe>\
						  <iframe id="' + rndId2 +'" name="' + rndId2 +'" class="invisible"\
			              scrolling="no" src="'+iframeSrc+'"\
			              allowTransparency="true" style="display:none;" frameborder="0"\
			              ><\/iframe>';
			    //Sina.dom.addHTML(document.body, html); 临时替换
				var oIjaxIframeCnt = $.C("div");
				oIjaxIframeCnt.id = "ijax_iframes";

				oIjaxIframeCnt.innerHTML = html;
				//$Debug("创建 Ijax 需要的 iframe");
				document.body.appendChild(oIjaxIframeCnt);
				// 记录两个 iframe 加载器，默认是空闲状态

				var loadTimer = setInterval($.fun.bind2(function(){
					if($.E(this.loadFrames[0]) != null && $.E(this.loadFrames[1]) != null){
						clearInterval(loadTimer);
						loadTimer = null;
						this.loadingIframe = {
							"thread1" : {
								"container" : $.E(this.loadFrames[0]),
								"isBusy" : false
							},
							"thread2" : {
								"container" : $.E(this.loadFrames[1]),
								"isBusy" : false
							}
						};
						this.loadByList();
					}
				}, this), 10);
			},
			/**
			 * 判断是否可以开始加载数据，必须是两个 iframe 节点可用的情况下
			 */
			isIjaxReady: function () {
				if(typeof this.loadingIframe == "undefined"){
					return false;
				}
				for(var oLoadCnt in this.loadingIframe){
					if(this.loadingIframe[oLoadCnt].isBusy == false){
						this.loadingIframe[oLoadCnt].isBusy = true;
						return this.loadingIframe[oLoadCnt];
					}
				}
				return false;
			},
			/**
			 * 处理请求参数接收
			 *
			 * @param url 必选参数。请求数据的URL，是一个 URL 字符串，不支持数组
			 * @param option 可选参数 {
			 *  onComplete  : Function (Array responsedData),
			 *  onException : Function ();
			 *  GET : {}, 通过 GET 提交的数据
			 *  POST : {} 通过 POST 提交的数据
			 * }
			 */
			request: function (url, option) {
				var oTask = {};
				oTask.url = url;
				oTask.option = option || {};
				this.arrTaskLists.push(oTask);
				if(this.loadFrames == null){
					this.createLoadingIframe();
				}
				else{
					this.loadByList();
				}
			},
			/**
			 * 缓冲列表管理
			 */
			loadByList: function () {
				// 如果等待列表为空，则终止加载
				if (this.arrTaskLists.length == 0) {
					// 重新建立 iframe
					return false;
				}
				// 取得两个加载器的状态，看是否有空闲的
				var loadStatus = this.isIjaxReady();
				if(loadStatus == false){
					return false;
				}
				var newData = this.arrTaskLists[0];
				this.loadData(newData.url, newData.option, loadStatus);
				// 删除列表第一条
				this.arrTaskLists.shift();
			},
			/**
			 * 加载单条数据
			 */
			loadData: function (url, option, loader) {
				var _url = new $.util.url(url);
				if (option.GET) {
					for(var key in option.GET){
						_url.setParam(key, Core.String.encodeDoubleByte(option.GET[key]));
					}
				}
				// 接口设置 Domain
				//_url.setParam("domain", "1");
				// 接口增加随机数
				//modified by stan | chaoliang@staff.sina.com.cn
				//减少不必要的强制更新数据
				//_url.setParam("rnd", Math.random());
				_url = _url.toString();
				// 当前用于加载数据的 iframe 对象
				var ifm = loader.container;
				ifm.listener = $.fun.bind2(function () {
					if(option.onComplete||option.onException){
						try{
							var iframeObject = ifm.contentWindow.document, sResult;
							// 临时函数
							var tArea = iframeObject.getElementsByTagName( 'textarea')[0];
							if (typeof tArea != "undefined") {
								sResult = tArea.value;
							}
							else {
								sResult = iframeObject.body.innerHTML;
							}
							if(option.onComplete){
								option.onComplete(sResult);
							}
							else{
								option.onException();
							}
						}
						catch(e){
							if(option.onException){
								option.onException(e.message, _url.toString());
							}
						}
					}
					loader.isBusy = false;
					$.evt.removeEvent(ifm,"load",ifm.listener);
					this.loadByList();
				},this);

				$.evt.addEvent(ifm,"load", ifm.listener);

				// 如果需要 post 数据
				if(option.POST){
					var oIjaxForm = $.C("form");
					oIjaxForm.id = "IjaxForm";
					oIjaxForm.action = _url;
					oIjaxForm.method = "post";
					oIjaxForm.target = ifm.id;
					for(var oItem in option.POST) {
						var oInput = $.C("input");
						oInput.type = "hidden";
						oInput.name = oItem;
						//oInput.value = $.str.encodeDoubleByte(option.POST[oItem]);
						//encodeDoubleByte就是encodeURIComponent，会把gbk字符转成utf-8造成乱码
						oInput.value = option.POST[oItem];
						oIjaxForm.appendChild(oInput);
					};
					document.body.appendChild(oIjaxForm);
					try{
						oIjaxForm.submit();
					}catch(e){

					}
				}
				else{
					try{
						window.frames(ifm.id).location.href = _url;
					}catch(e){
						ifm.src = _url;
					};
				}
			}
	};
});
SAB.register('io.jsload',function($){
	JsLoad = {};
	(function () {
		function createScripts (oOpts, oCFG) {

			processUrl(oOpts, oCFG);

			var urls = oOpts.urls;
			var i, len = urls.length;
			for(i = 0; i < len; i ++ ) {
				var js = $.C("script");
				js.src = urls[i].url;
				//js.charset = urls[i].charset;
				/*js[$globalInfo.ua.isIE ? "onreadystatechange" : "onload"] = function(){
					if ($globalInfo.ua.isMOZ || this.readyState.toLowerCase() == 'complete' || this.readyState.toLowerCase() == 'loaded') {*/
				js[document.all ? "onreadystatechange" : "onload"] = function() {
					if (/gecko/.test(navigator.userAgent.toLowerCase()) || this.readyState.toLowerCase() == "complete" || this.readyState.toLowerCase() == "loaded") {
						oCFG.script_loaded_num ++;
					}
				};
				document.getElementsByTagName("head")[0].appendChild(js);
			}
		}

		function processUrl(oOpts, oCFG) {
			var urls = oOpts.urls;
			var get_hash = oOpts.GET;

			var i, len = urls.length;
			var key, url_cls, jsvar, rnd;
			for (i = 0; i < len; i++) {
				rnd =  parseInt(Math.random() * 100000000);
				url_cls = new $.util.url(urls[i].url);
				for(key in get_hash) {
					if(oOpts.noencode == true) {
						url_cls.setParam(key, get_hash[key]);
					}
					else {
						url_cls.setParam(key, $.str.encodeDoubleByte(get_hash[key]));
					}
				}

				jsvar = url_cls.getParam("jsvar") || "requestId_" + rnd;

				if (oOpts.noreturn != true) {
					url_cls.setParam("jsvar", jsvar);
				}

				oCFG.script_var_arr.push(jsvar);
				urls[i].url = url_cls.toString();
				urls[i].charset = urls[i].charset || oOpts.charset;
			}
		}

		function ancestor (aUrls, oOpts) {

			var _opts = {
				urls: [],
				charset: "utf-8",
				noreturn: false,
				noencode: true,
				timeout: -1,
				POST: {},
				GET: {},
				onComplete: null,
				onException: null
			};

			var _cfg = {
				script_loaded_num: 0,
				is_timeout: false,
				is_loadcomplete: false,
				script_var_arr: []
			};

			_opts.urls = typeof aUrls == "string"? [{url: aUrls}]: aUrls;

			$.util.parseParam(_opts, oOpts);

			createScripts(_opts, _cfg);

			// 定时检查完成情况
			(function () {

				if(_opts.noreturn == true && _opts.onComplete == null)return;
				var i, data = [];
				// 全部完成
				if (_cfg.script_loaded_num == _opts.urls.length) {
					_cfg.is_loadcomplete = true;
					if (_opts.onComplete != null) {
						for(i = 0; i < _cfg.script_var_arr.length; i ++ ) {
							data.push(window[_cfg.script_var_arr[i]]);
						}
						if(_cfg.script_var_arr.length < 2) {
							_opts.onComplete(data[0]);
						}
						else {
							_opts.onComplete(data);
						}
					}
					return;
				}
				// 达到超时
				if(_cfg.is_timeout == true) {
					return;
				}
				setTimeout(arguments.callee, 50);
			})();

			// 超时处理
			if(_opts.timeout > 0) {
				setTimeout(function () {
					if (_cfg.is_loadcomplete != true) {
						if (_opts.onException != null) {
							_opts.onException();
						}
						_cfg.is_timeout = true;
					}
				}, _opts.timeout);
			}
		}

		JsLoad.request = function (aUrls, oOpts) {
			new ancestor(aUrls, oOpts);
		};

	})();
	return JsLoad;
});
/**
 * Cross-domain POST using window.postMessage()
 */
SAB.register("io.html5Ijax", function($) {
    var _add = $.evt.addEvent,
        _remove = $.evt.removeEvent,

        NOOP = function() {},
        RE_URL = /^http\s?\:\/\/[a-z\d\-\.]+/i,
        ID_PREFIX = 'ijax-html5-iframe-',

        /**
         * Message sender class
         */
        MsgSender = function(cfg) {
            cfg = cfg || {};
            this.init(cfg);
        };
        MsgSender.prototype = {
        	ready: false,

        	init: function(cfg) {
        	    if (this.ready) {
        	        return;
        	    }
        	    var self = this,
        	        iframeId, iframeHtml, iframe, loaded, receiver,
        	        proxyUrl = cfg.proxyUrl,
        	        datas = {};
        	    self.onsuccess = cfg.onsuccess || NOOP;
        	    self.onfailure = cfg.onfailure || NOOP;
        	    if (!proxyUrl) {
        	        return;
        	    }

        	    receiver = function(e) {
        	        if (!self.ready || e.origin !== self.target) {
        	        	self.destroy();
        	            return;
        	        }
        	        var ret = e.data;
        	        if (!ret || ret === 'failure') {
        	        	self.destroy();
        	            self.onfailure && self.onfailure();
        	        } else {
        	            self.onsuccess && self.onsuccess(e.data);
        	            self.destroy()
        	        }
        	    };
        	    _add(window, 'message', receiver);

        	    // insert an iframe
        	    iframeId = ID_PREFIX+Date.parse(new Date());
        	    iframeHtml = '<iframe id="' + iframeId + '" name="' + iframeId +
        	        '" src="' + proxyUrl + '" frameborder="0" ' +
        	        'style="width:0;height:0;display:none;"></iframe>';
        	    var oIjaxIframeCnt = $.C("div");
        	    oIjaxIframeCnt.id = ID_PREFIX+"iframes";
        	    oIjaxIframeCnt.innerHTML = iframeHtml;
        	    // document.body.appendChild(oIjaxIframeCnt);
        	    iframe = oIjaxIframeCnt.childNodes[0];
        	    loaded = function() {
        	        self.ready = true;
        	        var src = iframe.src,
        	            matched = src.match(RE_URL);
        	        self.target = (matched && matched[0]) || '*';
        	    };
        	    _add(iframe, 'load', loaded);
        	    document.body.insertBefore(iframe, document.body.firstChild);

        	    self._iframe = iframe;
        	    self._iframeLoaded = loaded;
        	    self._receiver = receiver;
        	},

        	send: function(cfg) {
        	    cfg = cfg || {};
        	    var self = this,
        	        url = cfg.url,
        	        data = cfg.data,
        	        onsuccess = cfg.onsuccess,
        	        onfailure = cfg.onfailure;

        	    if (!url || typeof url !== 'string') {
        	        return;
        	    }
        	    if (onsuccess) {
        	        self.onsuccess = onsuccess;
        	    }
        	    if (onfailure) {
        	        self.onfailure = onfailure;
        	    }

        	    if (!self.ready) {
        	        setTimeout(function() {
        	            self.send(cfg);
        	        }, 50);
        	        return;
        	    }

        	    if (data) {
        	        data += '&_url=' + window.encodeURIComponent(url);
        	    } else {
        	        data = '_url=' + window.encodeURIComponent(url);
        	    }
        	    self._iframe.contentWindow.postMessage(data, self.target);
        	},

        	destroy: function() {
        	    var iframe = this._iframe;
        	    _remove(iframe, 'load', this._iframeLoaded);
        	    iframe.parentNode.removeChild(iframe);
        	    _remove(window, 'message', this._receiver);
        	    this._iframe = null;
        	    this._iframeLoaded = null;
        	    this._receiver = null;
        	}
        };

    return MsgSender;
});
SAB.register('clz.extend',function($){
	return  function(target,source,deep) {
		for (var property in source) {
			target[property] = source[property];
		}
		return target;
	// 	target = target || {};
	// 	var sType = typeof source, i = 1, options;
	// 	if(sType === 'undefined' || sType === 'boolean') {
	// 		deep = sType === 'boolean' ? source : false;
	// 		source = target;
	// 		target = this;
	// 	}
	// 	if( typeof source !== 'object' && Object.prototype.toString.call(source) !== '[object Function]') {
	// 		source = {};
	// 	}
	// 	while(i <= 2) {
	// 		options = i === 1 ? target : source;
	// 		if(options !== null) {
	// 			for(var name in options ) {
	// 				var src = target[name], copy = options[name];
	// 				if(target === copy){
	// 					continue;
	// 				}
	// 				if(deep && copy && typeof copy === 'object' && !copy.nodeType){
	// 					target[name] = this.extend(src || (copy.length !== null ? [] : {}), copy, deep);
	// 				}else if(copy !== undefined){
	// 					target[name] = copy;
	// 				}
	// 			}
	// 		}
	// 		i++;
	// 	}
	// 	return target;
	}
});
SAB.register('util.cookie',function($){
	/**
	 * 读取cookie,注意cookie名字中不得带奇怪的字符，在正则表达式的所有元字符中，目前 .[]$ 是安全的。
	 * @param {Object} cookie的名字
	 * @return {String} cookie的值
	 * @example
	 * var value = co.getCookie(name);
	 */
	var co={};
	co.getCookie = function (name) {
		name = name.replace(/([\.\[\]\$])/g,'\\\$1');
		var rep = new RegExp(name + '=([^;]*)?;','i');
		var co = document.cookie + ';';
		var res = co.match(rep);
		if (res) {
			return res[1] || "";
		}
		else {
			return "";
		}
	};

	/**
	 * 设置cookie
	 * @param {String} name cookie名
	 * @param {String} value cookie值
	 * @param {Number} expire Cookie有效期，单位：小时
	 * @param {String} path 路径
	 * @param {String} domain 域
	 * @param {Boolean} secure 安全cookie
	 * @example
	 * co.setCookie('name','sina',null,"")
	 */
	co.setCookie = function (name, value, expire, path, domain, secure) {
			var cstr = [];
			cstr.push(name + '=' + escape(value));
			if(expire){
				var dd = new Date();
				var expires = dd.getTime() + expire * 3600000;
				dd.setTime(expires);
				cstr.push('expires=' + dd.toGMTString());
			}
			if (path) {
				cstr.push('path=' + path);
			}
			if (domain) {
				cstr.push('domain=' + domain);
			}
			if (secure) {
				cstr.push(secure);
			}
			document.cookie = cstr.join(';');
	};

	/**
	 * 删除cookie
	 * @param {String} name cookie名
	 */
	co.deleteCookie = function(name) {
			document.cookie = name + '=;' + 'expires=Fri, 31 Dec 1999 23:59:59 GMT;';
	};
	return co;
});
SAB.register('util.parseParam',function($){
	return function (oSource, oParams) {
		var key;
		try {
			if (typeof oParams != "undefined") {
				for (key in oSource) {
					if (oParams[key] != null) {
						oSource[key] = oParams[key];
					}
				}
			}
		}
		finally {
			key = null;
			return oSource;
		}
	};
});
SAB.register('util.byteLength',function($){
	 return function(str){
		if(typeof str == "undefined"){
			return 0;
		}
		var aMatch = str.match(/[^\x00-\x80]/g);
		return (str.length + (!aMatch ? 0 : aMatch.length));
	};
});
SAB.register('util.url',function($){
	Url = function (url){
	    url = url || "";
	    this.url = url;
		this.query = {};
		this.parse();
	};

	Url.prototype = {
		/**
		 * 解析URL，注意解析锚点必须在解析GET参数之前，以免锚点影响GET参数的解析
		 * @param{String} url? 如果传入参数，则将会覆盖初始化时的传入的url 串
		 */
		parse : function (url){
			if (url) {
				this.url = url;
			}
		    this.parseAnchor();
		    this.parseParam();
		},
		/**
		 * 解析锚点 #anchor
		 */
		parseAnchor : function (){
		    var anchor = this.url.match(/\#(.*)/);
		    anchor = anchor ? anchor[1] : null;
		    this._anchor = anchor;
		    if (anchor != null){
		      this.anchor = this.getNameValuePair(anchor);
		      this.url = this.url.replace(/\#.*/,"");
		    }
		},

		/**
		 * 解析GET参数 ?name=value;
		 */
		parseParam : function (){
		    var query = this.url.match(/\?([^\?]*)/);
		    query = query ? query[1] : null;
		    if (query != null){
		      this.url = this.url.replace(/\?([^\?]*)/,"");
		      this.query = this.getNameValuePair(query);
		    }
		 },
		/**
		 * 目前对json格式的value 不支持
		 * @param {String} str 为值对形式,其中value支持 '1,2,3'逗号分割
		 * @return 返回str的分析结果对象
		 */
		getNameValuePair : function (str){
		    var o = {};
		    str.replace(/([^&=]*)(?:\=([^&]*))?/gim, function (w, n, v) {
		     	if(n == ""){return;}
		      	//v = v || "";//alert(v)
		     	//o[n] = ((/[a-z\d]+(,[a-z\d]+)*/.test(v)) || (/^[\u00ff-\ufffe,]+$/.test(v)) || v=="") ? v : (v.j2o() ? v.j2o() : v);
		    	o[n] = v || "";
			});
		    return o;
		 },
		 /**
		  * 从 URL 中获取指定参数的值
		  * @param {Object} sPara
		  */
		 getParam : function (sPara) {
		 	return this.query[sPara] || "";
		 },
		/**
		 * 清除URL实例的GET请求参数
		 */
		clearParam : function (){
		    this.query = {};
		},

		/**
		 * 设置GET请求的参数，当个设置
		 * @param {String} name 参数名
		 * @param {String} value 参数值
		 */
		setParam : function (name, value) {
		    if (name == null || name == "" || typeof(name) != "string") {
				throw new Error("no param name set");
			}
		    this.query = this.query || {};
		    this.query[name]=value;
		},

		/**
		 * 设置多个参数，注意这个设置是覆盖式的，将清空设置之前的所有参数。设置之后，URL.query将指向o，而不是duplicate了o对象
		 * @param {Object} o 参数对象，其属性都将成为URL实例的GET参数
		 */
		setParams : function (o){
		    this.query = o;
		},

		/**
		 * 序列化一个对象为值对的形式
		 * @param {Object} o 待序列化的对象，注意，只支持一级深度，多维的对象请绕过，重新实现
		 * @return {String} 序列化之后的标准的值对形式的String
		 */
		serialize : function (o){
			var ar = [];
			for (var i in o){
			    if (o[i] == null || o[i] == "") {
					ar.push(i + "=");
				}else{
					ar.push(i + "=" + o[i]);
				}
			}
			return ar.join("&");
		},
		/**
		 * 将URL对象转化成为标准的URL地址
		 * @return {String} URL地址
		 */
		toString : function (){
		    var queryStr = this.serialize(this.query);
		    return this.url + (queryStr.length > 0 ? "?" + queryStr : "")
		                    + (this.anchor ? "#" + this.serialize(this.anchor) : "");
		},

		/**
		 * 得到anchor的串
		 * @param {Boolean} forceSharp 强制带#符号
		 * @return {String} 锚anchor的串
		 */
		getHashStr : function (forceSharp){
		    return this.anchor ? "#" + this.serialize(this.anchor) : (forceSharp ? "#" : "");
		}
	};
	return Url;
});
/**
 * 模板
 * @param  {Object} $ SAB
 */
SAB.register('util.template',function($){
	return function(template, data,isDecode){
	    return template.replace(/#\{(.+?)\}/ig, function(){
	        var key = arguments[1].replace(/\s/ig, '');
	        var ret = arguments[0];
	        var list = key.split('||');
	        for (var i = 0, len = list.length; i < len; i += 1) {
	            if (/^default:.*$/.test(list[i])) {
	                ret = isDecode?decodeURIComponent(list[i].replace(/^default:/, '')):list[i].replace(/^default:/, '');
	                break;
	            }
	            else
	                if (data[list[i]] !== undefined) {
	                    ret =isDecode?decodeURIComponent(data[list[i]]):data[list[i]];
	                    break;
	                }
	        }
	        return ret;
	    });
	};
});
/**
 *	log,控制台
 * @param  {Object} $ SAB
 */
SAB.register('app.log',function($){
	var trace = true;
	return function() {
		if (!trace) return;
		if (typeof console == 'undefined') return;
		var slice = Array.prototype.slice;
		var args = slice.call(arguments, 0);
		args.unshift("* SAB.app.log >>>>>>");
		try{
			console.log.apply(console, args);
		}catch(e){
			console.log(args);
		}

	};
});
/**
 * 截字，包括全角
 * @param  {Object} $ SAB
 */
SAB.register('app.strLeft',function($){
	return function (s, n) {
		var ELLIPSIS = '...';
		var s2 = s.slice(0, n),
			i = s2.replace(/[^\x00-\xff]/g, "**").length,
			j = s.length,
			k = s2.length;
		//if (i <= n) return s2;
		if(i<n){
			return s2;
		}else if(i==n){
			//原样返回
			if(n==j||k==j){
				return s2;
			}else{
				return s.slice(0,n-2)+ELLIPSIS;
			}
		}
		//汉字
		i -= s2.length;
		switch (i) {
			case 0: return s2;
			case n:
				var s4;
				if(n==j){
					s4 = s.slice(0, (n>>1)-1);
					return s4+ELLIPSIS;
				}else{
					s4 = s.slice(0, n>>1);
					return s4;
				}
			default:
				var k = n - i,
					s3 = s.slice(k, n),
					j = s3.replace(/[\x00-\xff]/g, "").length;
				return j ? s.slice(0, k) + arguments.callee(s3, j) : s.slice(0, k);
		}
	};

});
SAB.register('app.strLeft2',function($){
	var byteLen = $.util.byteLength
	return function(str,len){
		var s = str.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
		str = str.slice(0, s.slice(0, len).replace(/\*\*/g, " ").replace(/\*/g, "").length);
		if(byteLen(str) > len) str = str.slice(0,str.length -1);
		return str;
	};

});
SAB.register('app.splitNum',function($){
	//千分位
	return function(num) {
		num = num + "";
		var re = /(-?\d+)(\d{3})/
		while (re.test(num)) {
			num = num.replace(re, "$1,$2")
		}
		return num;
	}
});
/**
 * 输入框占位
 * @param  {Object} $ SAB
 */
SAB.register('app.placeholder',function($){
	$globalInfo.supportPlaceholder = 'placeholder' in document.createElement('input');
	return function(inputs){

			function p(input){
				//如果支持placeholder,返回
				if($globalInfo.supportPlaceholder){
			        return;
				}
				//已经初始化，hasPlaceholder为1
				var hasPlaceholder = input.getAttribute('hasPlaceholder')||0;
				if(hasPlaceholder=='1'){
					return;
				}
				var toggleTip = function(){
					defaultValue = input.defaultValue;
					if(input.value==''){
						$.dom.addClass(input,'gray');
						input.value = text;
					}
					input.onfocus = function(){

					    if(input.value === defaultValue || input.value === text){
					        this.value = '';
					        $.dom.removeClass(input,'gray');
					    }
					}
					input.onblur = function(){
					    if(input.value === ''){
					        this.value = text;
					        $.dom.addClass(input,'gray');
					    }
					}
				};
				var simulateTip = function(){
					var pwdPlaceholder = $.C('input');
					pwdPlaceholder.type='text';
					pwdPlaceholder.className = 'pwd_placeholder gray '+input.className;
					pwdPlaceholder.value=text;
					pwdPlaceholder.autocomplete = 'off';
					input.style.display='none';
		            input.parentNode.appendChild(pwdPlaceholder);
		            pwdPlaceholder.onfocus = function(){
		                pwdPlaceholder.style.display = 'none';
		                input.style.display = '';
		                input.focus();
		            }
		            input.onblur = function(){
		                if(input.value === ''){
		                    pwdPlaceholder.style.display='';
		                    input.style.display='none';
		                }
		            }
				}

				//如果没有placeholder或者没有placeholder值，返回
				var text = input.getAttribute('placeholder');
				if(!text){
					//ie10 下的ie7 无法用input.getAttribute('placeholder')取到placeholder值，奇怪！
					if(input.attributes&&input.attributes.placeholder){
						text=input.attributes.placeholder.value;
					}
				}
				var tagName = input.tagName;
				if(tagName=='INPUT'){
					var inputType = input.type;
					if(inputType == 'password'&&text){
						simulateTip();
					}else if(inputType=='text'&&text){
						toggleTip();
					}
				}else if(tagName=='TEXTAREA'){
					toggleTip();
				}
				input.setAttribute('hasPlaceholder','1');


			}
			for (var i = inputs.length - 1; i >= 0; i--) {
				var input = inputs[i]
				p(input);
			};

		};

});
/**
 * 锚点跳转
 * @param  {Object} $ SAB
 */
SAB.register('app.anchorGo',function($){
	/**
	 * @param  {HTML Element} trigger 带锚点的链接
	 * @param  {Number} time    动画时间
	 * @param  {Number} offset  偏移量
	 * @param  {Number} dir     方向，上下1，左右2
	 */
	return function(trigger,time,offset,dir,e){
		time = time||800;
		dir = dir||1;
		var destId = trigger.href.split('#')[1];
		dest = $.dom.byId(destId);
		offset = offset||0;
		switch(dir||1){
		    case 1:
		    	var gap = window.jQuery?
		    		(parseInt(dest?jQuery(dest).offset().top:0)+offset):
		    		(parseInt(dest?dest.offsetTop:0)+offset);
		    	if(!$globalInfo.ua.isIE6&&window.jQuery){
			        jQuery("body,html").animate({scrollTop:gap},time);
		    	}else{
		    		document.documentElement.scrollTop=gap;
					document.body.scrollTop=gap;
		    	}
		        break;
		    case 2:
		        var gap = window.jQuery?
		        	(parseInt(dest?jQuery(dest).offset().left:0)+offset):
		        	(parseInt(dest?dest.offsetLeft:0)+offset);
            	if(!$globalInfo.ua.isIE6&&window.jQuery){
        	        jQuery("body,html").animate({scrollLeft:gap},time);
            	}else{
            		document.documentElement.scrollLeft=gap;
        			document.body.scrollLeft=gap;
            	}
		        break;
		    default:
		    	return;
		}
		$.evt.preventDefault(e);
		return false;
	}
});
SAB.register('util.timer',function($){
	return new function(){
		this.list = {};
		this.refNum = 0;
		this.clock = null;
		this.allpause = false;
		this.delay = 25;

		this.add = function(fun){
			if(typeof fun != 'function'){
				throw('The timer needs add a function as a parameters');
			}
			var key = ''
				+ (new Date()).getTime()
				+ (Math.random())*Math.pow(10,17);

			this.list[key] = {'fun' : fun,'pause' : false};
			if(this.refNum <= 0){
				this.start();
			}
			this.refNum ++;
			return key;
		};

		this.remove = function(key){
			if(this.list[key]){
				delete this.list[key];
				this.refNum --;
			}
			if(this.refNum <= 0){
				this.stop();
			}
		};

		this.pause = function(key){
			if(this.list[key]){
				this.list[key]['pause'] = true;
			}
		};

		this.play = function(key){
			if(this.list[key]){
				this.list[key]['pause'] = false;
			}
		};

		this.stop = function(){
			clearInterval(this.clock);
			this.clock = null;
		};

		this.start = function(){
			var _this = this;
			this.clock = setInterval(
				function(){
					_this.loop.apply(_this)
				},
				this.delay
			);
		};

		this.loop = function(){
			for(var k in this.list){
				if(!this.list[k]['pause']){
					this.list[k]['fun']();
				}
			}
		};
	};
});
SAB.register('util.throttle',function($){
	return function(method, context) {
		clearTimeout(method.__tId__);
		method.__tId__ = setTimeout(function() {
			method.call(context);
		}, 100);
	}

});
SAB.register('util.reachBottom',function($){
	var docEle = document.documentElement;
	var docBody = document.body;
	var _min = Math.min;
	var _max = Math.max;
	var reachBottom = function() {
		var scrollTop = 0;
		var clientHeight = 0;
		var scrollHeight = 0;
		try{
			// bshare浮层会导致这段代码出错
			if(docEle && docEle.scrollTop) {
				scrollTop = docEle.scrollTop;
			} else if(docBody) {
				scrollTop = docBody.scrollTop;
			}
			if(docBody.clientHeight && docEle.clientHeight) {
				clientHeight = _min(docBody.clientHeight, docEle.clientHeight)
				// clientHeight = (docBody.clientHeight < docEle.clientHeight) ? docBody.clientHeight : docEle.clientHeight;
			} else {
				clientHeight = _max(docBody.clientHeight, docEle.clientHeight);
				// clientHeight = (docBody.clientHeight > docEle.clientHeight) ? docBody.clientHeight : docEle.clientHeight;
			}
			scrollHeight = _max(docBody.scrollHeight, docEle.scrollHeight);
			return (scrollTop + clientHeight > scrollHeight - 150);
		}catch(e){
			return false;
		}
	};
	return reachBottom;

});
SAB.register("app.shine", function($) {
	var timer = $.util.timer;
	var b = function(a) {
			return a.slice(0, a.length - 1).concat(a.concat([]).reverse())
		};
	return function(c, d) {
		var e = $.util.parseParam({
			start: "#fff",
			color: "#fbb",
			times: 2,
			step: 5,
			length: 4
		}, d),
			f = e.start.split(""),
			g = e.color.split(""),
			h = [];
		for(var i = 0; i < e.step; i += 1) {
			var j = f[0];
			for(var k = 1; k < e.length; k += 1) {
				var l = parseInt(f[k], 16),
					m = parseInt(g[k], 16);
				j += Math.floor(parseInt(l + (m - l) * i / e.step, 10)).toString(16)
			}
			h.push(j)
		}
		for(var i = 0; i < e.times; i += 1) h = b(h);
		var n = !1,
			o = timer.add(function() {
				if(!h.length) timer.remove(o);
				else {
					if(n) {
						n = !1;
						return
					}
					n = !0;
					c.style.backgroundColor = h.pop()
				}
			})
	}
});
/**
 * 评论设置 覆盖优先级 URL Query>页面ARTICLE设置>默认设置DEFAULTS
 */
SAB.register('job.cmntConfig',function($){
	var extend = $.clz.extend;
	//默认设置，页面设置，url设置
	var url = this.url = new $.util.url(location.href);
	var query = url.query||{};

	var commonFaces = {
			'哈哈':'haha',
			'偷笑':'tx',
			'泪':'lei',
			'嘻嘻':'xixi',
			'爱你':'aini',
			'挖鼻屎':'wbs',
			'心':'xin'
		};
	var allFaces = {'国旗': 'dc/flag_thumb', '走你': 'ed/zouni_thumb', '笑哈哈': '32/lxhwahaha_thumb', '江南style': '67/gangnamstyle_thumb', '吐血': '8c/lxhtuxue_thumb', '好激动': 'ae/lxhjidong_thumb', 'lt切克闹': '73/ltqiekenao_thumb', 'moc转发': 'cb/moczhuanfa_thumb', 'ala蹦': 'b7/alabeng_thumb', 'gst耐你': '1b/gstnaini_thumb', 'xb压力': 'e0/xbyali_thumb', 'din推撞': 'dd/dintuizhuang_thumb', '草泥马': '7a/shenshou_thumb', '神马': '60/horse2_thumb', '浮云': 'bc/fuyun_thumb', '给力': 'c9/geili_thumb', '围观': 'f2/wg_thumb', '威武': '70/vw_thumb', '熊猫': '6e/panda_thumb', '兔子': '81/rabbit_thumb', '奥特曼': 'bc/otm_thumb', '?': '15/j_thumb', '互粉': '89/hufen_thumb', '礼物': 'c4/liwu_thumb', '呵呵': 'ac/smilea_thumb', '嘻嘻': '0b/tootha_thumb', '哈哈': '6a/laugh', '可爱': '14/tza_thumb', '可怜': 'af/kl_thumb', '挖鼻屎': 'a0/kbsa_thumb', '吃惊': 'f4/cj_thumb', '害羞': '6e/shamea_thumb', '挤眼': 'c3/zy_thumb', '闭嘴': '29/bz_thumb', '鄙视': '71/bs2_thumb', '爱你': '6d/lovea_thumb', '泪': '9d/sada_thumb', '偷笑': '19/heia_thumb', '亲亲': '8f/qq_thumb', '生病': 'b6/sb_thumb', '太开心': '58/mb_thumb', '懒得理你': '17/ldln_thumb', '右哼哼': '98/yhh_thumb', '左哼哼': '6d/zhh_thumb', '嘘': 'a6/x_thumb', '衰': 'af/cry', '委屈': '73/wq_thumb', '吐': '9e/t_thumb', '打哈欠': 'f3/k_thumb', '抱抱': '27/bba_thumb', '怒': '7c/angrya_thumb', '疑问': '5c/yw_thumb', '馋嘴': 'a5/cza_thumb', '拜拜': '70/88_thumb', '思考': 'e9/sk_thumb', '汗': '24/sweata_thumb', '困': '7f/sleepya_thumb', '睡觉': '6b/sleepa_thumb', '钱': '90/money_thumb', '失望': '0c/sw_thumb', '酷': '40/cool_thumb', '花心': '8c/hsa_thumb', '哼': '49/hatea_thumb', '鼓掌': '36/gza_thumb', '晕': 'd9/dizzya_thumb', '悲伤': '1a/bs_thumb', '抓狂': '62/crazya_thumb', '黑线': '91/h_thumb', '阴险': '6d/yx_thumb', '怒骂': '89/nm_thumb', '心': '40/hearta_thumb', '伤心': 'ea/unheart', '猪头': '58/pig', 'ok': 'd6/ok_thumb', '耶': 'd9/ye_thumb', 'good': 'd8/good_thumb', '不要': 'c7/no_thumb', '赞': 'd0/z2_thumb', '来': '40/come_thumb', '弱': 'd8/sad_thumb', '蜡烛': '91/lazu_thumb', '蛋糕': '6a/cake', '钟': 'd3/clock_thumb', '话筒': '1b/m_thumb'};
	// 有些页面要判断页面类型，比如高清图
	var pageType = (function(){
		var re = /slide\..*?.sina.com.cn/;
		return re.test(location.host)?'slide':'';
	})();
	var DEFAULTS = {
		//评论微博转发视频地址
	    video_url:'',
	    //评论微博转发图片地址，可置空会自动取图
	    pic_url:'',
	    //频道
	    channel:'ty',
	    //新闻id
	    newsid:'6-12-6341970',
	    //组，默认为0,为1是为专题
	    group:0,
	    //编码
	    encoding:'gbk',
	    //是否显示评论列表,为1隐藏，为0显示
	    hideCMNTList:0,
		//微博转发参数
	    source: '新浪娱乐',
	    sourceUrl: 'http://ent.sina.com.cn/',
	    uid: '1642591402',
	    //是否是专题评论，本来为皮肤，历史问题，适配到group 具体咨询王磊
	    style:0,
	    channelId: 28,
	    //是否论坛页
	    isBBS:0,
	    //页面类型
	   	pageType:pageType,
	    //分页评论数
	    pageNum:10,
	    //热帖第一页评论数
	    hotPageNum:5,
	    //常用表情
	    commonFaces:commonFaces,
	    commonFacesBase:'http://www.sinaimg.cn/dy/deco/2012/1217/face/',
	    //全部表情
	    allFaces:allFaces,
	    allFacesBase:'http://img.t.sinajs.cn/t35/style/images/common/face/ext/normal/',
	    postPlaceholder:'请输入评论内容',
	    postContent:'',
	    //隐藏表情,1为隐藏，0为显示，默认显示
	    hideFaces:0,
	    //隐藏评论数,1为隐藏，0为显示，默认显示
	    hideCount:0,
	    cmntFix:1,
	    //最大嵌套楼层
	    maxFloor:10,
	    //隐藏头像,默认为0显示
	    hideHead:0,
	    //自动登录
	    autoLogin:0,
	    //自动登录时间间隔,建议不要小于8秒
	    autoLoginInterval:8e3,
	    //0表示评论汇总接口,1表示发帖记录,2表示被回复记录 20130422 by wanglei
        info_type:0,
        // 1滚动到底部自动加载，0点击更多加载,默认为0
        scrollLoad:0,
        // 是否在评论登录模块中同步浮层登录(SINA_OUTLOGIN_LAYER)状态，默认不同步
        synLayerLoginStatus:0
	    //为专题系统评论设置的css参数,不设置默认值，用户不设置时，使用css样式
	    //评论宽度
	    // width:640,
	    //回复框百分比，必须是百分比，非百分比失效
	    // replyTextAreaWidth:97%,
	    // 浮动评论框水平偏移
	    // cmntFixOffsetX:-200
	    // 用户名和密码输入框宽度
	    // inputWidth:70
	    //分享按钮弹出方向，right,top,默认为right
	    // sharePopDirection:'top'

	  };
	ARTICLE_DATA = typeof ARTICLE_DATA !='undefined'?ARTICLE_DATA:{};
 	ARTICLE_DATA = extend(DEFAULTS, ARTICLE_DATA, true);
 	ARTICLE_DATA = extend(ARTICLE_DATA, query, true);
});
/**
 * 设置微博用户信息
 */

SAB.register('app.setWeiboUserInfo',function($){
	//全局的变量 $globalInfo
	return function(d){
			var data = d.result.data;
		    if(data){
		    	$globalInfo.isWeiboLogin  = true;
		    	$globalInfo.weiboData = data;
		    	$globalInfo.weiboName = data.name;
		    	$globalInfo.weiboNick = data.screen_name;
		    	$globalInfo.weiboUser = data;
		    	$globalInfo.profile_image_url = data.profile_image_url;
		    	//触发微博登录事件
		    	var cusEvt = $.evt.custEvent;
		    	cusEvt.fire($, 'ce_weiboLogin');
		    }else{
		    	$globalInfo.isWeiboLogin  = false;

		    }
		};

});






/**
 * 设置新浪用户信息
 */
SAB.register('app.setSinaUserInfo',function($){
	//全局的变量 $globalInfo
	return function(){
		    var cookie = sinaSSOController.get51UCCookie();
		    if(cookie){
				$globalInfo.isLogin  = true;
				$globalInfo.uid      = cookie.uid;
				$globalInfo.name     = cookie.name;
				$globalInfo.sinaNick = cookie.nick;
				$globalInfo.sinaUser = cookie;

				var cusEvt = $.evt.custEvent;
				var appLogin = $.app.login;

		    }else{
				$globalInfo.isLogin  = false;
				$globalInfo.isWeiboLogin = false;
		    }
			window.$globalInfo = $globalInfo;
		};

});
/**
 * 退出
 */
SAB.register('app.logout',function($){
	return function(){
	    sinaSSOController.logout();
	};
});
/**
 * 登录
 */
SAB.register('app.login',function($){
	//savestate 下次自动登录
	return function(user,psd,savestate){
	    sinaSSOController.login(user,psd,savestate);
	};
});
/**
 * 自动登录，循环调用
 * @param  {Object} $ SAB
 */
SAB.register('app.autoLogin',function($){
	return function(){
		var cusEvt = $.evt.custEvent;
	    var cookie = sinaSSOController.get51UCCookie();
	    //如果已经登录，不做处理，返回
	    if(cookie&&$globalInfo.isLogin){
	    	return;
	    }
	    //如果没登录，尝试自动登录
    	var cusEvt = $.evt.custEvent;
    	//触发退出事件，防止在其它页面退出，本页还是登录状态
    	cusEvt.fire($, 'ce_logout');
	    
	    $.app.setSinaUserInfo();
		sinaSSOController.autoLogin(function(cookie){
			if(!cookie) return;
			$.app.setSinaUserInfo();
			$.app.isWeibo();
		});
	};
});
/**
 * 通过接口判断登录后的用户是否微博用户
 */
SAB.register('app.isWeibo',function($){
		return function(){
			var cusEvt = $.evt.custEvent;
			//ce_前缀为自定义事件
			var userUrl,userData,onUserSuccess;
			userUrl = 'http://api.sina.com.cn/weibo/2/users/show.json';
			userData = 'uid=' + $globalInfo.uid + '&source=2835469272';
			onUserSuccess = function(data){
				$.app.setWeiboUserInfo(data);
				//触发自定义事件ce_login
				cusEvt.fire($, 'ce_login');
			}
			$.io.jsonp(userUrl, userData, onUserSuccess);
		};
});
/**
 * 登录模块，初始化各种登录自定义事件
 */
SAB.register('module.login',function($){
	var cusEvt = $.evt.custEvent;
	var byClass = $.dom.byClass;
	var addClass = $.dom.addClass;
	//ce_前缀为自定义事件
	//登录新浪事件
	cusEvt.define($,'ce_login');
	//登录微博事件
	cusEvt.define($,'ce_weiboLogin');
	//登录出错事件
	cusEvt.define($,'ce_loginError');
	//退出事件
	cusEvt.define($,'ce_logout');

	var SINA_USER_LINK = 'http://login.sina.com.cn/member/my.php';
	var WEIBO_USER_LINK = 'http://weibo.com';
	var ICOHREF = ['http://login.sina.com.cn/member/my.php','http://weibo.com'];
	var ICOHTML = ['<img src="http://img.t.sinajs.cn/t4/style/images/common/transparent.gif" title="新浪 " alt="sina" class="username_icon"></a>','<img src="http://img.t.sinajs.cn/t4/style/images/common/transparent.gif" title="微博" alt="weibo" class="weibo_icon"></a>'];

	var login = function () {
		this.init();
	};
	login.prototype = {
		init:function(){
			this.wrap = document.body;
			var cusEvt = $.evt.custEvent;
			this.bindEvent();
			if(typeof sinaSSOController =='undefined'){
				//throw "没载入sinaLogin.js";
				return;
			}
			//与顶部登录模块冲突
			var controller = sinaSSOController;
			controller.service = 'vblog';
			controller.pageCharset = 'GB2312';
			controller.setDomain = true;
			//之前是sinaSSOController.customLoginCallBack
			// controller.loginCallBack = function(loginStatus) {
			controller.customLoginCallBack = function(loginStatus) {
				//4049 验证码
				//if (loginStatus.retcode!=0) {
				if (!loginStatus.result) {
					cusEvt.fire($, 'ce_loginError');
					return false;
				}
				$.app.setSinaUserInfo();
				$.app.isWeibo();
				if(ARTICLE_DATA.synLayerLoginStatus){
					window.SINA_OUTLOGIN_LAYER&&SINA_OUTLOGIN_LAYER.listener.fire("login_success");
				}
			};
			controller.customLogoutCallBack = function(logoutStatus) {
				cusEvt.fire($, 'ce_logout');
				if(ARTICLE_DATA.synLayerLoginStatus){
					window.SINA_OUTLOGIN_LAYER&&SINA_OUTLOGIN_LAYER.listener.fire("logout_success");
				}
			};
		},
		bindEvent:function(){
			var self = this;

			//绑定退出触发事件
			cusEvt.add($,'ce_logout',function(e){
			  	self.showUnlogined();
			},{});
			//绑定登录触发事件
			cusEvt.add($,'ce_login',function(e){
			    self.showLogined();
			},{});
			//绑定微博登录触发事件
			cusEvt.add($,'ce_weiboLogin',function(e){
			    self.showWeiboLogined();
			},{});
		},
		showLogined:function(wrap){
			var name = $globalInfo.sinaNick || $globalInfo.name;
			//宽度只能支持8个汉字srtLeft(name,16)
			var shortName = name;

			var isWeibo = 0;
			if($globalInfo.isWeiboLogin){
				name = $globalInfo.weiboNick||$globalInfo.weiboName;
				shortName = $.app.strLeft(name,16);
				name = '<a href="'+WEIBO_USER_LINK+'" target="_blank">'+shortName+'</a>';
				isWeibo = 1;
			}else{
				shortName = $.app.strLeft(name,16);
				name = '<a href="'+SINA_USER_LINK+'" target="_blank">'+shortName+'</a>';
			}
			var wrap = wrap||this.wrap;
			var login_ico = byClass('J_Login_Ico',wrap);
			var unlogin_dom = byClass('J_Unlogin',wrap);
			var logined_dom = byClass('J_Logined',wrap);
			var name_dom = byClass('J_Name',wrap);
			for (var i=0,len=login_ico.length; i<len;i++) {
				var item = login_ico[i];
				item.href= ICOHREF[isWeibo];
				item.innerHTML = ICOHTML[isWeibo];
			};
			for (var i=0,len=unlogin_dom.length; i<len;i++) {
				unlogin_dom[i].style.display = 'none';
			};
			for (var i=0,len=logined_dom.length; i<len;i++) {
				logined_dom[i].style.display = '';
			};
			for (var i=0,len=name_dom.length; i<len;i++) {
				name_dom[i].innerHTML = name;
			};
			//登录成功后清空所有用户名和密码，并加上提示
			var user_dom = byClass('J_Login_User',wrap);
			var psw_dom = byClass('J_Login_Psw',wrap);

			for (var i=0, len=user_dom.length; i<len; i++) {
				var item = user_dom[i];
				if($globalInfo.supportPlaceholder){
					item.value = '';
				}else{
					item.value = item.getAttribute('placeholder');
					addClass(item,'gray');
				}

			};
			for (var i=0, len=psw_dom.length; i<len; i++) {
				// 有可能是模拟placeholder pwd_placeholder
				var item = psw_dom[i];
				if(item.className.indexOf('pwd_placeholder')==-1){
					item.value = '';
				}
			};
		},
		showUnlogined:function(wrap){
			var wrap = wrap||this.wrap;
			var unlogin_dom = byClass('J_Unlogin',wrap);
			var logined_dom = byClass('J_Logined',wrap);
			var weiboLogined_dom = byClass('J_WeiboLogined',wrap);
			for (var i=0, len=unlogin_dom.length; i<len; i++) {
				unlogin_dom[i].style.display = '';
			};
			for (var i=0, len=logined_dom.length; i<len; i++) {
				logined_dom[i].style.display = 'none';
			};
			for (var i=0, len=weiboLogined_dom.length; i<len; i++) {
				weiboLogined_dom[i].style.display = 'none';
			};
		},
		showWeiboUnLogined:function(wrap){
			var wrap = wrap||this.wrap;
			var weiboLogined_dom = byClass('J_WeiboLogined',wrap);
			for (var i=0,len=weiboLogined_dom.length;i<len;i++) {
				weiboLogined_dom[i].style.display = 'none';
			};
		},
		showWeiboLogined:function(wrap){
			var wrap = wrap||this.wrap;
			var weiboLogined_dom = byClass('J_WeiboLogined',wrap);
			for (var i=0,len=weiboLogined_dom.length;i<len;i++) {
				weiboLogined_dom[i].style.display = '';
			};
		}

	};
	var login1 = new login();
	return login1;
});
/**
 * 顶部导航更多
 */
SAB.register('job.topMore',function($){
	var dom = $.dom;
	var wrap = dom.byId('J_TopMore');
	if(!wrap){
		return;
	}
	var trigger = dom.byClass('J_Trigger',wrap,'a')[0];
	var list = dom.byClass('J_List',wrap,'div')[0];
	var addEvt = $.evt.addEvent;
	//下拉列表事件
	addEvt(wrap,'mouseover',function(){
		list.style.display = 'block';
	});
	addEvt(list,'mouseover',function(){
	    list.style.display = 'block';
	});
	addEvt(list,'mouseout',function(){
	  list.style.display = 'none';
	});
});

/**
 * 评论接口
 */
SAB.register('app.comment',function($){
	// 高清图在切换过程中，ARTICLE_DATA评论参数修改 customNewsId, customShareUrl, customImgUrl ，优先级最高一般不用设置
	var url = 'http://comment5.news.sina.com.cn/cmnt/submit';
	return function(con,mid,newsid,channel,toWeibo,videoUrl){
		var param = {
			channel:channel||$globalInfo.news.channel,
			newsid:ARTICLE_DATA.customNewsId || newsid||$globalInfo.news.newsid,
			parent:mid,
			content:con,
			format:'js',
			ie:ARTICLE_DATA.encoding,
			oe:ARTICLE_DATA.encoding,
			ispost:toWeibo,
			share_url:ARTICLE_DATA.customShareUrl || location.href.split('#')[0],
			video_url:ARTICLE_DATA.video_url||'',
			img_url:ARTICLE_DATA.customImgUrl||''
		};
		$.io.ijax.request(url,{
			//param:param,
			POST:param
		});
	}

});



/**
 * 评论相关自定义事件
 */
SAB.register('job.cmntCustEvent',function($){
	//自定义事件
	var cusEvt = $.evt.custEvent;
	//评论框和列表wrap结构渲染完成
	cusEvt.define($,'ce_cmntHtmlInit');
	//开始加载
	cusEvt.define($,'ce_cmntLoadStart');
	//加载完成
	cusEvt.define($,'ce_cmntLoadEnd');
	//渲染开始
	cusEvt.define($,'ce_cmntRenderStart');
	//渲染?束
	cusEvt.define($,'ce_cmntRenderEnd');
	//第一次渲染?束
	cusEvt.define($,'ce_cmntFirstRenderEnd');
	// 第一次渲染单条评论结束，委派事件的初始化可以绑定此事件
	cusEvt.define($,'ce_cmntItemFirstRenderEnd');

	//评论框恢复原位
	cusEvt.define($,'ce_cmntFormReset');
	//评论框固定
	cusEvt.define($,'ce_cmntFormFix');

	//评论?束
	cusEvt.define($,'ce_cmntSubmitEnd');

});
/**
 * 评论列表显示的关闭和打开，判断不同的状态
 */
SAB.register('job.cmntListToggle',function($){
	var toggle = function(){
			var Cmntlist = $.job.cmntList;
			var data = Cmntlist.data;
			var dom = Cmntlist.dom;
			//整个评论包括评论框
			var comment_wrap_dom = $.dom.byId('J_Comment_Wrap');
			//只是评论列表
			var list_wrap_dom = $.dom.byId('J_Comment_List_Wrap');

			//是否要关闭整个评论
			if(data.news&&data.news.status=='N_CLOSE'){
				return;
			}else{
				comment_wrap_dom.style.display='';
			}
			//如果评论数为0不显示
			if(!data.cmntlist||data.cmntlist.length==0){
				return;
			}
			//某些频道不显示评论列表，比如国内，ARTICLE_DATA.hideCMNTList，默认为0不显示，为1显示
			var hideList = ARTICLE_DATA.hideCMNTList&&ARTICLE_DATA.hideCMNTList==1;
			if(hideList){
				return;
			}else{
				list_wrap_dom.style.display = '';
			}

	};
	var cusEvt = $.evt.custEvent;
	cusEvt.add($, 'ce_cmntRenderStart', toggle);
});
/**
 * 时间格式化
 */

SAB.register("app.formatTime", function($) {
    var monthSrt = '月',
        dayStr = '日',
        todayStr = '今天',
        secondStr = '秒前',
        minStr = '分钟前';
    return function(nDate, oDate) {
        var nYear = nDate.getFullYear(),
            oYear = oDate.getFullYear(),
            nMonth = nDate.getMonth() + 1,
            oMonth = oDate.getMonth() + 1,
            nDay = nDate.getDate(),
            oDay = oDate.getDate(),
            nHour = nDate.getHours(),
            oHour = oDate.getHours();
        oHour < 10 && (oHour = "0" + oHour);
        var oMin = oDate.getMinutes();
        oMin < 10 && (oMin = "0" + oMin);
        var dDate = nDate - oDate;
        dDate = dDate > 0 ? dDate : 0;
        dDate = dDate / 1e3;
        if(nYear != oYear) return oYear + "-" + oMonth + "-" + oDay + " " + oHour + ":" + oMin;
        if(nMonth != oMonth || nDay != oDay) return oMonth + monthSrt + oDay + dayStr + oHour + ":" + oMin;
        if(nHour != oHour && dDate > 3600) return todayStr + oHour + ":" + oMin;
        if(dDate < 51) {
            dDate = dDate < 1 ? 1 : dDate;
            return Math.floor((dDate - 1) / 10) + 1 + "0" + secondStr
        }
        return Math.floor(dDate / 60 + 1) + minStr
    }
});

/**
 * 获取格式化后的时间HTML标签
 */

SAB.register("app.getTimeStr", function($) {
    var formatTime =$.app.formatTime;
    return function(time,clz){
        clz = clz||'';
        if(time){
            //发布时间 tDate1,如果time为空
            var tDate1 = new Date;
            time = time.replace(/-/g,'/');
            var timeStr = Date.parse(time);
            tDate1.setTime(parseInt(timeStr, 10));
            //此时时间 tDate
            var tDate = new Date;
            tDate.setTime(tDate.getTime());

            var formatStr = formatTime(tDate,tDate1);
        }else{
            timeStr = Date.parse(new Date);
            var formatStr='1秒前'
        }

        return '<span class="'+clz+' J_Comment_Time" date="'+timeStr+'">'+ formatStr+'</span>';
    };

});
/**
 * 定时更新评论时间
 */

SAB.register("app.updateTime", function($) {
    var formatFeedTime = $.app.formatTime,
        cusEvt = $.evt.custEvent;
        cDate =0,
        d = function(wrap) {
            var dateDom = $.dom.byClass('J_Comment_Time', wrap),
                tDate = new Date;
            tDate.setTime(tDate.getTime() - cDate);
            var g;
            for(var h = 0; h < dateDom.length; h++) {
                var item = dateDom[h],
                    dateStr = item.getAttribute("date");
                if(!/^\s*\d+\s*$/.test(dateStr)) continue;
                var tDate1 = new Date;
                tDate1.setTime(parseInt(dateStr, 10));
                item.innerHTML = formatFeedTime(tDate, tDate1);
                g == undefined && (g = tDate.getTime() - tDate1.getTime() < 6e4)
            }
            return g
        };
    return function(wrap) {
            // var TIME = 1e4;
            var TIME = 1e3;
            var upDateTimer, setUpDateTimer = function(t) {
                    clearTimeout(upDateTimer);
                    upDateTimer = setTimeout(function() {
                        d(wrap) ? setUpDateTimer(TIME) : setUpDateTimer(6e4)
                    }, t)
                },
                g = function() {
                    setUpDateTimer(TIME);
                };
            setUpDateTimer(TIME);
            cusEvt.add($, 'ce_cmntItemFirstRenderEnd', g);
            var UT = {
                destroy: function() {
                    clearTimeout(upDateTimer);
                    cusEvt.remove($, 'ce_cmntItemFirstRenderEnd', g);
                    UT = wrap = upDateTimer = setUpDateTimer = g = null
                }
            };
            return UT
    }
});
SAB.register('cmnt.data',function($){
	var all = {
		'cmntlist':{},
		'replydict':{},
		'newsdict':{}
	};
	var _isArray = $.arr.isArray;
	var _extend = $.obj.extend;
	var Control = {
		set:function(type,data){
			// 评论列表是数组的话，得先按mid转换成对象合并，有部分评论是没有新闻标题(newstitle)的;有部分新闻也是数组
			var allType = all[type];
			var item,id;
			if(_isArray(data)){
				for (var i = 0, len = data.length; i < len; i++) {
					item = data[i];
					// 注意评论列表里面的item也有newsid
					if(item.mid){
						id = item.mid;
					}else if(item.newsid){
						id = item.newsid;
					}
					allType[id] = item;
				}
			}else{
				allType = _extend(allType,data);
			}
			all[type] = allType;
		},
		get:function(type,id){
			// 返回全部数据
			if(!type){
				return all;
			}
			// 只返回某一类型数据
			if(!id){
				return all[type]||all;
			}
			// 按id返回某一类型的一组数据
			return all[type][id];
		}
	};
	return Control;

});
SAB.register('cmnt.util.filterEmotionIco', function($) {
	var baseUrl = ARTICLE_DATA.allFacesBase;
	var emoticons = ARTICLE_DATA.allFaces;
	var regExp = /\[(.*?)\]/g;
	return function(text) {
		text = text || "";
		text = text.replace(regExp, function($0, $1) {
			var imgUrl = emoticons[$1];
			if (imgUrl) {
				imgUrl = baseUrl + imgUrl + '.gif';
			}
			return !imgUrl ? $1 : '<img class="comment_content_emotion" title="' + $1 + '" alt="' + $1 + '" src="' + imgUrl + '" />';
		});
		return text;
	};
});
SAB.register('cmnt.util.getWBName', function($) {
	return function(d) {
		if (typeof d.config == 'undefined') {
			return '';
		}
		var temp = d.config.match(/wb_screen_name=([^&]*)/i);
		return temp ? temp[1] : '';
	};
});
SAB.register('cmnt.util.getWBV', function($) {
	var _queryToJson = $.json.queryToJson;
	return function(d) {
		if (typeof d.config == 'undefined') {
			return '';
		}
		var v = '';
		var config = _queryToJson(d.config);
		var verified = config.wb_verified;
		var type = config.wb_verified_type;

		if (typeof verified != 'undefined' && verified == '1') {
			if (type == '0') {
				//黄
				v = 'y';
			} else {
				//蓝
				v = 'b';
			}
		}
		return v;
	};
});
SAB.register('cmnt.util.get_user_lnk', function($) {
	var _getWBV = $.cmnt.util.getWBV;
	return function(d) {
		var self = this;
		// http://www.sinaimg.cn/dy/deco/2013/0608/vy.png
		// 蓝vb.png黄vy.png灰vg.png
		var vImg = '';
		var vType = _getWBV(d);
		var vTit = '新浪个人认证';
		if (vType) {
			if (vType == 'b') {
				vTit = '新浪机构认证';
			}
			vImg = '<img src="http://www.sinaimg.cn/dy/deco/2013/0608/v' + vType + '.png" title="' + vTit + '" style="vertical-align: middle;" />';
		}
		var wb_name = self.getWBName(d);
		//如果wb_screen_name为空的话，说明不是用微博名来评论的
		var user_url = "http://comment5.news.sina.com.cn/comment/skin/default.html?info_type=1&style=1&user_uid="
		if (wb_name == '') {
			if (d.uid && d.uid != "0") {
				return '<a href="' + user_url + d.uid + '" target="_self">' + d.nick + '</a>';
			} else {
				return d.nick;
			}
		} else {
			return '<a href="' + user_url + d.uid + '" target="_self">' + wb_name + vImg + '</a>';
		}
	}
});
SAB.register('cmnt.util.get_user_face', function($) {
	//微博用户uid链接
	var WBUURL = 'http://weibo.com/u/';
	var _getWBName = $.cmnt.util.getWBName;
	var _queryToJson = $.json.queryToJson;
	return function(d) {
		if (ARTICLE_DATA.hideHead) {
			return '';
		}
		var self = this;
		config = d.config || '';
		var face = _queryToJson(config, true).wb_profile_img || 'http://www.sinaimg.cn/dy/deco/2012/1018/sina_comment_defaultface.png';
		var wb_name = _getWBName(d);
		//如果wb_screen_name为空的话，说明不是用微博名来评论的
		if (wb_name == '') {
			return '<img src="' + face + '"/>';
		} else {
			return '<a href="' + WBUURL + d.uid + '" title="' + wb_name + '" target="_blank"><img src="' + face + '"/></a>';
		}
	}

});
SAB.register('cmnt.util.get_user_ico', function($) {
	//用户类型css类
	var typeClzObj = {
		'wap': 't_mobile',
		'wb': 't_weibo'
	};
	var _getWBName = $.cmnt.util.getWBName;
	return function(d) {
		var typeClz = typeClzObj[d.usertype];
		typeClz = typeClz || '';
		if (typeClz == '') {
			//如果有微博链接就是微博用户
			var wb_name = _getWBName(d);
			//如果wb_screen_name为空的话，说明不是用微博名来评论的
			if (wb_name == '') {
				typeClz = '';
			} else {
				typeClz = typeClzObj.wb;
			}
		}
		return typeClz
	};
});
SAB.register('cmnt.util.replyListRender', function($) {
	var WBUURL = 'http://weibo.com/u/';
	var MAX_FLOOR = ARTICLE_DATA.maxFloor;
	var _encodeHTML = $.str.encodeHTML;
	var _getTimeStr = $.app.getTimeStr;
	var _cmntUtil = $.cmnt.util;
	var _cmntData = $.cmnt.data;
	return function(d, replydict) {

		var mid = d.mid;
		//该条评论的回复列表
		var tReplyList = [];
		if (replydict) {
			tReplyList = replydict[mid];
		}
		// 回复列表里的评论也需要加入到评论数据里
		_cmntData.set('cmntlist',tReplyList);
		var tReplyHtml = '';
		if (tReplyList&&tReplyList.length > 0) {
			for (var i = 0, len = tReplyList.length; i < len; i++) {
				var item = tReplyList[i];

				var wb_name = _cmntUtil.getWBName(item);
				var ch_newsid_mid = 'channel=' + item.channel + '&newsid=' + item.newsid + '&mid=' + item.mid;
				var tUserLnk = wb_name == '' ?
					'<a href="' + WBUURL + item.uid + '" target="_blank">' + _cmntUtil.getWBName(item) + '</a>' :
					d.nick;
				// var area = (item.usertype == 'wb'||item.area=='')?'&nbsp;':'['+item.area+']';
				var area = (item.area == '' ? '&nbsp;' : '[' + item.area + ']');
				//是否有回复
				var hasReply = '';
				if (i !== 0) {
					hasReply = 1;
				}
				var share_action_data = ' href="javascript:;" action-type="share" action-data="' + ch_newsid_mid + '&usertype=' + item.usertype + '&wb_screen_name=' + wb_name + '&area=' + item.area + '&nick=' + item.nick + '&con=' + item.content + '&type=reply&hasReply=' + hasReply + '&site=';
				var tempHtml = '<span class="orig_index">' + (i + 1) + '</span>' + '<div class="orig_user">' + _cmntUtil.get_user_lnk(item) + '<span class="orig_area">' + area + '</span></div>' + '<div class="orig_content">' + _cmntUtil.filterEmotionIco(_encodeHTML(item.content)) + '</div>' + '<div class="orig_reply" style="visibility: ;"><div class="reply">' + _getTimeStr(item.time, 'orig_time') + '<span class="reply-right"><a action-type="vote" action-data="' + ch_newsid_mid + '" href="javascript:;" voted="false" class="comment_ding_link" title="支持"><span>支持<em>(' + item.agree + ')</em></span></a> <a action-type="reply" action-data="' + ch_newsid_mid + '&parMid=' + mid + '&type=innerReply" href="javascript:;" poped="false" class="comment_reply_link" title="回复">回复</a> ' + '<a href="javascript:;" action-type="shareHover" class="cmnt-share-tirgger" title="分享"><em>分享</em></a></span>' + '<span class="cmnt-share-btns J_Comment_Share_Btns"><a title="分享到新浪微博" class="cmnt-share-btn-sina" ' + share_action_data + 'sina">新浪</a><a title="分享到腾讯微博" class="cmnt-share-btn-qq" ' + share_action_data + 'tencent">腾讯</a></span>' + '</div></div>';
				if (i < MAX_FLOOR) {
					tReplyHtml = '<div class="orig_cont clearfix">' + tReplyHtml + tempHtml + '</div>';
				} else {
					tReplyHtml = tReplyHtml + '<div class="orig_cont clearfix">' + tempHtml + '</div>';
				}

			};
		}
		if (tReplyHtml !== '') {
			tReplyHtml = '<div class="comment_orig_content">' + tReplyHtml + '</div>'
		}
		return tReplyHtml;
	};
});

/**
 * 获取评论右上方的新闻链接，如果不是专题评论，刚该新闻链接是一样的，置为空
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
SAB.register('cmnt.util.getNewsLink', function($) {
	return function(id,data) {
		var item = '';
		var html = '';
		var isSummary = (ARTICLE_DATA.isBBS && ARTICLE_DATA.style);
		var newsdict = data.newsdict;
		if (isSummary) {
			item = newsdict[id];
			if (item) {
				html = '<span class="t_newslink"><a target="_blank" href="' + item.url + '" title="' + item.title + '">' + item.title + '</a></span>';
			}
		}
		return html;
	};
});
/**
 * 单条评论渲染
 * @param  {[type]} $ [description]
 * @return {[type]}   [description]
 */
SAB.register('cmnt.util.cmntItemRender', function($) {
	var _encodeHTML = $.str.encodeHTML;
	var _getTimeStr = $.app.getTimeStr;
	var _cmntUtil = $.cmnt.util;
	var _cusEvtFire = $.evt.custEvent.fire;
	var _splitNum = $.app.splitNum;
	var isFirstRender = true;
	return function(d,data) {
		if (typeof d.mid == 'undefined') {
			return '';
		}
		var html = '';
		var mid = d.mid;
		// var area = (d.usertype == 'wb'||d.area=='')?'&nbsp;':'['+d.area+']';
		var area = (d.area == '' ? '&nbsp;' : '[' + d.area + ']');
		var ch_newsid_mid = 'channel=' + d.channel + '&newsid=' + d.newsid + '&mid=' + mid;
		var tReplyHtml = _cmntUtil.replyListRender(d,data.replydict);

		//是否有回复
		var hasReply = '';
		if (tReplyHtml) {
			hasReply = 1;
		}
		var wb_name = _cmntUtil.getWBName(d);
		var share_action_data = 'href="javascript:;" action-type="share" action-data="' + ch_newsid_mid + '&wb_screen_name=' + wb_name + '&hasReply=' + hasReply + '&site=';

		tReplyHtml = '<div class="J_Comment_Reply">' + tReplyHtml + '</div>';
		html = '<div class="comment_item" id="J_Comment_Item-' + mid + '">' + '<div class="comment_item_cont clearfix">' + '<div class="J_Comment_Face t_face">' + _cmntUtil.get_user_face(d) + '</div>' + '<div class="t_content">' + '<div class="J_Comment_Info">' + '<div class="t_info"> ' + _cmntUtil.getNewsLink(d.newsid, data) + ' <span class="t_username ' + _cmntUtil.get_user_ico(d) + '">' + _cmntUtil.get_user_lnk(d) + '</span><span class="t_area">' + area + '</span></div>' + '</div>' + tReplyHtml + '<div class="comment_content J_Comment_Txt clearfix">' + '<div class="t_txt">' + _cmntUtil.filterEmotionIco(_encodeHTML(d.content)) + '</div>' + '<div class="reply" style="visibility: visible;">' + _getTimeStr(d.time, 'datetime') + '<div class="vote_tip">+1</div> <span class="reply-right"><a action-type="vote" action-data="' + ch_newsid_mid + '" href="javascript:;" voted="false" class="comment_ding_link" title="支持"><span>支持<em>(' + _splitNum(d.agree) + ')</em></span></a> <a action-type="reply" action-data="' + ch_newsid_mid + '&type=outerReply" href="javascript:;" poped="false" class="comment_reply_link" title="回复">回复</a> ' + '<a href="javascript:;" action-type="shareHover" class="cmnt-share-tirgger" title="分享"><em>分享</em></a></span>' + '<span class="cmnt-share-btns J_Comment_Share_Btns"><a title="分享到新浪微博" class="cmnt-share-btn-sina" ' + share_action_data + 'sina">新浪</a><a title="分享到腾讯微博" class="cmnt-share-btn-qq"  ' + share_action_data + 'tencent">腾讯</a></span>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>';
		// 触发初次渲染事件
		if(isFirstRender){
			_cusEvtFire($, 'ce_cmntItemFirstRenderEnd');
			isFirstRender = false;
		}
		return html;
	};
});
SAB.register('cmnt.util.cmntListRender', function($) {
	//默认显示页面数
	var PAGENUM = ARTICLE_DATA.pageNum;
	var HOTPAGNUM = ARTICLE_DATA.hotPageNum;
	var sudaHasMore = false;
	var _cmntUtil = $.cmnt.util;
	return function(cmntlist, config) {
		var html = [];
		if (typeof cmntlist !== "object") {
			return '';
		}
		var type = config.type;
		var data = config.data;
		var index = 0;
		var divNum = 0;
		var totalPages = 0;
		var postfix = '';
		//最新评论只显示第一页，其它通过更多来加载
		if (type == 'latest') {
			for (var i in cmntlist) {
				if ((index + 1) % PAGENUM == 1) {
					postfix = index == 0 ? '_first' : '';
					html.push('<div class="comment_item_page' + postfix + ' J_Comment_Page_Latest" style="display:none">');
					divNum++;
					totalPages++;
				}
				html.push(_cmntUtil.cmntItemRender(cmntlist[i], data));
				if ((index + 1) % PAGENUM == 0) {
					html.push('</div>');
					divNum++;
				}
				index++;
			}
			if (divNum % 2 != 0) {
				html.push('</div>');
			}
		} else if(type=='hot') {
			//最热评论全部显示
			for (var i in cmntlist) {
				if (index==0||index == HOTPAGNUM) {
					html.push('<div class="comment_item_page J_Comment_Page_Hot" style="display:none;">');
					divNum++;
					totalPages++;
				}
				html.push(_cmntUtil.cmntItemRender(cmntlist[i], data));
				if ((index + 1) / HOTPAGNUM == 1) {
					html.push('</div>');
					divNum++;
				}

				index++;
			}
			if (divNum % 2 != 0) {
				html.push('</div>');
			}
		}else{
			//单条评论渲染
			for (var i in cmntlist) {
				html.push(_cmntUtil.cmntItemRender(cmntlist[i], data));
				if ((index + 1) / HOTPAGNUM == 1) {
					html.push('</div>');
					divNum++;
				}
			}
		}
		if (!sudaHasMore && totalPages > 1) {
			//suda统计点击,显示第一个“更多评论”的次数，说白了就是每个正文加载时多于10条的次数
			try {
				_S_uaTrack("entcomment", "onemorepageview");
			} catch (e) {

			}
			sudaHasMore = true;
		}
		// for (var i = 0; i < html.length; i++) {
		// 	html[i]
		// };
		return html.join('');
	};
});

/**
 * 单条评论加载器
 * @param  {String} wrap 容器id
 * @return {object}  config 自定义参数
 */
SAB.register('cmnt.itemLoader',function($){
	var _cmntUtil = $.cmnt.util;
	var _cmntData = $.cmnt.data;

	function List(wrap,config){
		var self = this;
		if(typeof wrap =='string'){
			wrap = $.E(wrap);
		}
		if(!wrap){
			return;
		}
		self.wrap = wrap;
		self.config = config||{mids:''};
		self.getData();
	};
	List.prototype = {
		render:function(){
			var self = this;
			var data = self.loader.data;
			// 接口没有回复字典，没有新闻字典
			data.replydict = {};
			data.newsdict = {};
			self.setData(data);
			var cmntlist = data.cmntlist;
			var html = _cmntUtil.cmntListRender(cmntlist,{
				type:'',
				data:data
			});
			self.wrap.innerHTML = html;
		},
		getData:function(){
			var self = this;
			var url = 'http://comment5.news.sina.com.cn/cmnt/info';
			// var param = self.param;
			var param = {
				format: 'js',
				// channel: ARTICLE_DATA.channel,
				// newsid: ARTICLE_DATA.newsid,
				//style=1本来为皮肤，应该为group=1
				// group: ARTICLE_DATA.group || ARTICLE_DATA.style,
				compress: 1,
				ie: ARTICLE_DATA.encoding,
				oe: ARTICLE_DATA.encoding,
				mid:self.config.mids.join(',')
				// page: 1,
				// page_size: 100
			};
			// var param = '';
			self.loader = new $.app.dataLoader({
					url: url,
					param: param,
					beforeLoad: function() {
						// self.beforeLoad();
					},
					loaded: function() {
						self.render();
					}
				});
			self.loader.init();
		},
		setData:function(data){
			// 新闻列表
			_cmntData.set('newsdict',data.newsdict);
			// 评论列表
			_cmntData.set('cmntlist',data.cmntlist);
			// 回复列表
			_cmntData.set('replydict',data.replydict);
		}
	};

	return List;

});
/**
 * 列表评论加载器
 * @param  {String} wrap 容器id
 * @return {object}  config 自定义参数
 */
SAB.register('cmnt.listLoader',function($){
	var _cmntUtil = $.cmnt.util;
	var _cmntData = $.cmnt.data;

	function List(wrap,config){
		var self = this;
		if(typeof wrap =='string'){
			wrap = $.E(wrap);
		}
		if(!wrap){
			return;
		}
		self.wrap = wrap;
		self.config = config||{mids:''};
		self.getData();
	};
	List.prototype = {
		render:function(){
			var self = this;
			var data = self.loader.data;
			// 接口没有回复字典，没有新闻字典
			data.replydict = {};
			data.newsdict = {};
			self.setData(data);
			var cmntlist = data.cmntlist;
			var html = _cmntUtil.cmntListRender(cmntlist,{
				type:'',
				data:data
			});
			self.wrap.innerHTML = html;
		},
		getData:function(){
			var self = this;
			var url = 'http://comment5.news.sina.com.cn/cmnt/info';
			url = self.config.url||url;
			// var param = self.param;
			var param = {
				format: 'js',
				// channel: ARTICLE_DATA.channel,
				// newsid: ARTICLE_DATA.newsid,
				//style=1本来为皮肤，应该为group=1
				// group: ARTICLE_DATA.group || ARTICLE_DATA.style,
				compress: 1,
				ie: ARTICLE_DATA.encoding,
				oe: ARTICLE_DATA.encoding
				// mid:self.config.mids.join(',')
				// page: 1,
				// page_size: 100
			};
			// var param = '';
			self.loader = new $.app.dataLoader({
					url: url,
					param: param,
					beforeLoad: function() {
						// self.beforeLoad();
					},
					loaded: function() {
						self.render();
					}
				});
			self.loader.init();
		},
		setData:function(data){
			// 新闻列表
			_cmntData.set('newsdict',data.newsdict);
			// 评论列表
			_cmntData.set('cmntlist',data.cmntlist);
			// 回复列表
			_cmntData.set('replydict',data.replydict);
		}
	};
	return List;

});

// SAB.register('cmnt.util.',function($){

// });
/**
 * 评论列表右侧分享评论功能
 */
SAB.register("job.cmntShare", function($) {
        var _byteLength = $.str.byteLength;
        var _strLeft = $.app.strLeft;
        var _encode = encodeURIComponent;
        var _cmntData = $.cmnt.data;
        /**
         * 通过微博名和新浪昵称返回要分享的名字
         * @param  {String} name           微博名
         * @param  {String} nick           新闻昵称
         * @return {String}                名字
         */
        var getShareName = function(name,nick,usertype){
            var newName = '';
            if(name){
                newName = '@'+name;
            }else{
                if(usertype == "wap"){
                    newName="新浪手机用户";
                    if(nick!='手机用户'){
                         newName += nick;
                    }
                }else {
                    newName = "新浪网友";
                    if(nick){
                        newName += nick;
                    }
                }
            }
            return newName;
        };
        var getShareContent = function(title,shareName,cmnt){
            // 高清图加组图两字,如果title有‘组图：’就不需要加了 组图：
            var extra = (function(){
                if(ARTICLE_DATA.pageType=='slide'&&title.indexOf('组图：')==-1){
                    return '（组图）';
                }else{
                    return '';
                }

            })();
            title = title.replace(/<.*?>/ig, "");
            title = '#精彩评论#【'+title+'】'+extra+shareName+'：'+cmnt;
            return _encode(title);
        };

        //获取窗口地址
         var getUrlData = function(o,newWin){
            // 分享【新浪微博用户 @微博号】 对【标题】的#精彩新闻评论# 【评论地址】
            ///从评论列表中找出当前评论数据
            var s = screen;
            var d = document;

            // 该条评论的相关内容及对应新闻的内容都可以通过curCmntlist拿到
            var clickData = o.data;
            // 评论id
            var mid = clickData.mid;
            // 需要分享到的站点
            var site = clickData.site;
            // 当前评论
            var curCmntlist = _cmntData.get('cmntlist',mid);
            // 评论内容
            var cmnt = curCmntlist.content;
            // 新闻id
            var newsid = curCmntlist.newsid;

            // 新闻所属频道
            var channel = curCmntlist.channel;
            // 分享图片
            var img = ARTICLE_DATA.pic_url&&ARTICLE_DATA.pic_url.length>0?ARTICLE_DATA.pic_url[0]:'';
            var setWinUrl = function(){

                // var cmntUrl ='http://comment5.news.sina.com.cn/comment/skin/default.html?channel='+channel+'&newsid='+newsid;
                var link = location.href;
                var shareName = getShareName(clickData.wb_screen_name,curCmntlist.nick,curCmntlist.usertype);
                // 新闻标题
                var title = (function(){
                    // 新闻标题 注意单条评论接口并没有新闻信息，新闻信息都放在单条评论中
                    var newsData = _cmntData.get('newsdict',newsid);
                    if(typeof newsData=='undefined'&&curCmntlist.news_info){
                        return curCmntlist.news_info.title||'';
                    }else{
                        return newsData.title||'';
                    }
                })();
                var cont =  getShareContent(title,shareName,cmnt);

                var API = {
                    'sina':{
                        base:'http://v.t.sina.com.cn/share/share.php?',
                        param:['url=',_encode(link),'&title=',cont,'&source=',_encode('新浪新闻评论'),'&sourceUrl=',_encode('http://news.sina.com.cn/hotnews/'),'&content=','gb2312','&pic=',_encode(img),'&appkey=','445563689'].join('')
                    },
                    'tencent':{
                        base:'http://share.v.t.qq.com/index.php?',
                        param:['c=','share','&a=','index','&url=',_encode(link),'&title=',cont,'&content=','gb2312','&pic=',_encode(img),'&appkey=','dcba10cb2d574a48a16f24c9b6af610c','&assname=','${RALATEUID}'].join('')
                    }
                };

                if(newWin) {
                    newWin.location.href = [API[site].base,API[site].param].join('');
                }
            };
            //获取评论截图
            var getImgSrc = function(o){
                    var cbName = 'iJax'+Date.parse(new Date());
                    var url = 'http://comment5.news.sina.com.cn/image';
                    window[cbName]=function(m){
                        if(typeof m == 'string'){
                            m = eval('('+m+')');
                        }
                        var cmntImg = m.result.image||'';
                        //新闻图片+评论截图
                        img = img?img+'||'+cmntImg:cmntImg;
                        if(/Firefox/.test(navigator.userAgent)) {
                            setTimeout(function(){
                                setWinUrl();
                            }, 30);
                        } else {
                            setWinUrl();
                        }
                    };
                    if(!$globalInfo.ua.isFF){
                        var param = {
                            channel:channel,
                            newsid:newsid,
                            mid:mid,
                            format:'js',
                            callback:cbName
                        };
                        $.io.ijax.request(url,{
                            POST:param
                        });
                    }else{
                        var param = 'channel='+channel+'&newsid='+newsid+'&mid='+mid;
                        var Sender = new $.io.html5Ijax({
                                proxyUrl : 'http://comment5.news.sina.com.cn/comment/postmsg.html'
                            });
                        Sender.send({
                            url: url,
                            data: param,
                            onsuccess: window[cbName],
                            onfailure: function(){}
                        });
                    }
            };
            //如果不带回复评论或者评论不超过80字直接只带新闻配图，否则还带评论截图,楼里回复（clickData.type == 'reply'）
            var maxCmntLen = 80;
            if(clickData.hasReply||_byteLength(cmnt)>maxCmntLen*2){
                cmnt = _strLeft(cmnt,maxCmntLen*2);
                // 获取截图后，在回调里设置窗口地址
                getImgSrc();
            }else{
                //直接设置窗口地址
                setWinUrl();
            }

        };

    //绑定点击分享事件
    var bindShare = function(){
	    	var byId = $.dom.byId;
	    	var wrap = document.getElementsByTagName('body')[0];
    		if(!wrap){
    			return;
    		}
    		//事件委派
    		var dldEvt = $.evt.delegatedEvent;
    		var dldEvt_share= dldEvt(wrap);
    		//点击分享
    		dldEvt_share.add('share','click',function(o){
    			var ele = o.el;
                //点击时马上打开窗口，防止被拦截
                var newWin = window.open('','mb',['toolbar=0,status=0,resizable=1,width=440,height=430,left=',(screen.width-440)/2,',top=',(screen.height-430)/2].join(''));
                //获取url数据（用来填充窗口地址）
                getUrlData(o,newWin);
    		});
    	}
    //评论渲染完成后绑定事件
    var cusEvt = $.evt.custEvent;
    cusEvt.add($, 'ce_cmntItemFirstRenderEnd', bindShare);
});
SAB.register("job.cmntShareHover", function($) {
    var bindShareHover = function(){
        var byId = $.dom.byId;
        var byClass = $.dom.byClass;
        var addClass = $.dom.addClass;
        var removeClass = $.dom.removeClass;
        var wrap = document.getElementsByTagName('body')[0];
        if(!wrap){
            return;
        }
        //事件委派
        var dldEvt = $.evt.delegatedEvent;
        var dldEvt_hover= dldEvt(wrap);

        var activeBtn=null;
        var timer;
        var HIDETIME = 500;
        var ACTIVECLZ = 'cmnt-share-tirgger-active';
        //向右或向上弹出
        var showCSS,hideCSS;
        if(ARTICLE_DATA.sharePopDirection&&ARTICLE_DATA.sharePopDirection=='top'){
            showCSS = {
                jq:{top: "-28px"},
                o:';right:-14px;top:-28px;display:block;'
            };
            hideCSS = {
                jq:{opacity:'hide',top: "0"},
                o:';right:-14px;top:0,display:none;'
            };
        }else{
            showCSS = {
                jq:{right: "-68px"},
                o:';right:-68px;display:block;'
            };
            hideCSS = {
                jq:{opacity:'hide',top: "0"},
                o:';right:-14px;display:none;'
            };
        }
        //显示，设置当前激活按钮，设置样式
        var show = function(ele,btn){
            if(typeof jQuery != 'undefined'){
                jQuery(btn).show().animate(showCSS.jq, "fast");
            }else{
                btn.style.cssText = showCSS.o;
            }
            activeBtn = ele;
            addClass(ele,ACTIVECLZ);
        };
        //隐藏，设置当前激活按钮为null，设置样式
        var hide = function(ele,btn){
            if(typeof jQuery != 'undefined'){
                jQuery(btn).animate(hideCSS.jq, "fast");
            }else{
                btn.style.cssText = hideCSS.o;
            }
            if(ele){
                removeClass(ele,ACTIVECLZ);
                activeBtn = null;
            }
        };
        //获取“新浪，腾讯”按钮wrap
        var getBtn = function(o){
            return byClass('J_Comment_Share_Btns',o.parentNode.parentNode)[0]
        };

        //点击分享
        dldEvt_hover.add('shareHover','mouseover',function(o){
            clearTimeout(timer);
            var ele = o.el;
            var btn = getBtn(ele);
            //显示前，先隐藏之前打开的按钮
            if(activeBtn&&activeBtn!=ele){
                hide(activeBtn,getBtn(activeBtn));
            }
            show(ele,btn);

        });
        dldEvt_hover.add('shareHover','mouseout',function(o){
            var ele = o.el;
            var btn = getBtn(ele);
            var evt = o.evt;
            // if(btn==evt.toElement){
                btn.onmouseout=function(){
                    timer = setTimeout(function(){
                        hide(ele,btn);
                    },HIDETIME);
                };
                btn.onmouseover=function(){
                    clearTimeout(timer);
                };
                // return;
            // }
            //延时隐藏
            timer = setTimeout(function(){
                hide(ele,btn);
            },HIDETIME);
        });

    };

    var cusEvt = $.evt.custEvent;
    cusEvt.add($, 'ce_cmntItemFirstRenderEnd', bindShareHover);
});
/**
 * 评论数链接动画跳转，其中y为跳转y轴的偏移量
 */
SAB.register('job.cmntCountLink',function($){
	var byId = $.dom.byId;
	var dldEvt = $.evt.delegatedEvent;
	var anchorGo = $.app.anchorGo;
	$.dom.ready(function(){
		var dldEvt_body= dldEvt(document.getElementsByTagName('body')[0]);
		//点击支持
		dldEvt_body.add('anchorGo','click',function(o){
			var ele = o.el;
			var y = (o.data.y&&parseInt(o.data.y))||-15;
			anchorGo(ele,800,y,1,o.e);
			//如果是滚动到评论框，闪动提示
			if(ele.href.split('#')[1]=='J_Comment_Wrap'){
				var wrap = byId('J_Comment_Form_B');
				var textArea = wrap&&wrap.getElementsByTagName('textarea')[0];
				if(textArea){
					setTimeout(function(){
						$.app.shine(textArea);
					},800);
				}
			}
		});
	});
});

/**
 * 评论数链接更新（正文页）
 */
SAB.register('job.cmntCountUpdateNews',function($){
	var _splitNum = $.app.splitNum;
	var update = function(){
		if(!$globalInfo.news){
			return;
		}
		var CmntList = $.job.cmntList;
		//是否要关闭整个评论
		if(CmntList.data.news&&CmntList.data.news.status=='N_CLOSE'){
			return;
		}
		var counts_text_dom = $.dom.byClass('J_Comment_Count_Txt');
		var CMNTBASEURL = 'http://comment5.news.sina.com.cn/comment/skin/default.html';
		// 评论论坛
	    var moreCommentLink = CMNTBASEURL+'?channel='+$globalInfo.news.channel+'&newsid='+$globalInfo.news.newsid;
	    // 更新评论数及文案，当hideCMNTList为1时，标题底部，正文底部链接都改为论坛页地址
	    var changeLink = function(){};
	    if(ARTICLE_DATA.hideCMNTList){
	    	changeLink = function(n){
	    		n.setAttribute('action-type','');
	    		n.href = moreCommentLink;
	    	};
	    }
	    if(counts_text_dom&&counts_text_dom.length>0){
	    	var count_text = '已有<span class="f_red">'+ _splitNum(CmntList.totalNum) +'</span>条评论，共<span class="f_red">'+ _splitNum(CmntList.data.count.total) +'</span>人参与';
	    	//评论数不为0时，显示
	    	if(CmntList.totalNum==0){
	    		for (var i = counts_text_dom.length - 1; i >= 0; i--) {
	    			var txt_dom = counts_text_dom[i];
	    			txt_dom.style.display = '';
	    		};
	    		return;
	    	}
	    	//更新文案
	    	for (var i = counts_text_dom.length - 1; i >= 0; i--) {
	    		var txt_dom = counts_text_dom[i];
	    		changeLink(txt_dom);
	    		if(i!==0){
	    			txt_dom.innerHTML = count_text;
	    		}else{
	    			txt_dom.innerHTML = '我有话说(<span class="f_red">'+ _splitNum(CmntList.data.count.total) +'</span>人参与)';
	    		}
	    		if(i>1){
	    			txt_dom.href = moreCommentLink;
	    		}
	    		txt_dom.style.display = '';
	    	};
	    }
	};
	var cusEvt = $.evt.custEvent;
	cusEvt.add($, 'ce_cmntRenderStart', update);
});
/**
 * 是否显示列表标题,包括彩票提示
 */
SAB.register('job.cmntTitleToggle',function($){
	var toggle = function(){
		var byId = $.dom.byId;
		var data = $.job.cmntList.data;
		if(!data){
			return;
		}
		//显示彩票提示
		if(data.news&&data.news.column=='彩票'){
			byId('J_Comment_CP_Tip').style.display = 'block';
		}
		if(data.hot_list&&data.hot_list.length!=0){
			byId('J_Comment_Wrap_Hot').style.display = '';
		}
		if(data.cmntlist){
			byId('J_Comment_Wrap_Latest').style.display = '';
		}
	};
	var cusEvt = $.evt.custEvent;
	cusEvt.add($, 'ce_cmntFirstRenderEnd', toggle);
});
/**
 * 评论列表没有数据时提示信息
 * 20130626 改为默认滚动到底部时自动加载更多
 */
SAB.register('job.cmntEndTip', function($) {
	var tip = function() {
		var CMNTBASEURL = 'http://comment5.news.sina.com.cn/comment/skin/default.html';
		var moreCommentLink = CMNTBASEURL;
		var end = $.job.cmntList.dom.end;
		if (!end) {
			return;
		}
		if (ARTICLE_DATA.info_type == 1 || ARTICLE_DATA.info_type == 2) {
			end.innerHTML = '<a href="#J_Comment_Wrap">已到最后一页，点击返回顶部</a>';
		} else {
			// 评论论坛
			moreCommentLink = CMNTBASEURL + '?channel=' + $globalInfo.news.channel + '&newsid=' + $globalInfo.news.newsid;
			//如果是专题评论链接加style=1(其实是group=1,历史遗留问题，具体咨询王磊)
			if ((ARTICLE_DATA.group || ARTICLE_DATA.style) && (ARTICLE_DATA.group != '0' || ARTICLE_DATA.style != 0)) {
				moreCommentLink += '&style=1';
			}
			//查看更多评论链接,BBS不需要链接
			if (!ARTICLE_DATA.isBBS) {
				end.innerHTML = '<a href="' + moreCommentLink + '" target="_blank">已到最后一页，更多精彩评论&gt;&gt;</a>';
			} else {
				end.innerHTML = '<a href="#J_Comment_Wrap">已到最后一页，点击返回顶部</a>';
			}
		}
	};
	var cusEvt = $.evt.custEvent;
	cusEvt.add($, 'ce_cmntFirstRenderEnd', tip);
});
/**
 * 评论列表的重新加载，只有一个接口，加载全部，刷新局部
 */
SAB.register("job.cmntReload", function($) {
    var bindShareHover = function(){
        var CmntList = $.job.cmntList;
        var wrap = CmntList.dom.wrap;
        if(!wrap){
            return;
        }
        //事件委派
        var dldEvt = $.evt.delegatedEvent;
        var dldEvt_reload= dldEvt(wrap);

        dldEvt_reload.add('reload','click',function(o){
            if(CmntList.loading){
                return;
            }
            var type = o.data.type;

           if(type){
                var list = $.dom.byId('J_Comment_List_'+type);
                var listPar = list.parentNode;
                var temp = [];
                temp.push('<div class="comment_item comment_loading">');
                  temp.push('<span>');
                    temp.push('<img src="http://i3.sinaimg.cn/ent/deco/2012/0912/images/indicator_24.gif" height="24" width="24" alt="" style="vertical-align:middle;">评论加载中，请稍候...</span>');
                temp.push('</div>');
                var fragment = $.C('div');
                fragment.innerHTML = temp.join('');
                listPar.insertBefore(fragment,list);

                var removeLoding = function(){
                    listPar.removeChild(fragment);
                    cusEvt.remove($, 'ce_cmntRenderEnd', removeLoding);
                };
                cusEvt.add($, 'ce_cmntRenderEnd', removeLoding);
           }
           CmntList.setType(type.toLowerCase());
           CmntList.options.param.page = 1;
           CmntList.getData();
        });

    };
    var cusEvt = $.evt.custEvent;

    cusEvt.add($, 'ce_cmntFirstRenderEnd', bindShareHover);

});
/**
 * 评论框和回复框类，包括登录，发布等，每个发布或者回复框对应一个其实例
 */
SAB.register('job.cmntForm',function($){
	var byId     = $.dom.byId;
	var byClass  = $.dom.byClass;
	var addClass = $.dom.addClass;
	var removeClass =$.dom.removeClass;
	var addEvt   = $.evt.addEvent;
	var cusEvt   = $.evt.custEvent;
	var encodeHTML = $.str.encodeHTML;
	var trim = $.str.trim;

	var _cmntUtil = $.cmnt.util;

	//格式化时间
	var formatTime = $.app.formatTime;
	var updateTime = $.app.updateTime;
	var getTimeStr = $.app.getTimeStr;
	var getPlaceholer = function(input){
		var text = input.getAttribute('placeholder');
		if(!text){
			//ie10 下的ie7 无法用input.getAttribute('placeholder')取到placeholder值，奇怪！
			if(input.attributes&&input.attributes.placeholder){
				text=input.attributes.placeholder.value;
			}
		}
		return text||'';
	};

	// cusEvt.add($,'ce_cmntSubmitEnd');

	var cmntForm = function (id) {
		this.init(id);
	};
	cmntForm.prototype = {
		init:function(id){
			var self = this;
			self.commenting = false;
			self.getMid(id);
			self.getNewsid(id);
			self.getChannel(id);
			self.getDom(id);
		},
		getMid:function(id){
			var mid = id.replace('J_Comment_Form_','').split('_')[0];
			this.mid = mid;
		},
		getNewsid:function(id){
			var newsid = id.replace('J_Comment_Form_','').split('_')[2];
			this.newsid = newsid||'';
		},
		getChannel:function(id){
			var channel = id.replace('J_Comment_Form_','').split('_')[3];
			this.channel = channel||'';
		},
		getDom:function(id){
			var self = this;
			var dom =$.dom;
			var wrap = byId(id);
			if(!wrap){
				return;
			}
			/**
			 * 用到的相关dom节点
			 * wrap,大容器，包括评论区和用户信息区
			 * form,评论表单
			 * content,评论内容
			 * submit,评论提交按钮
			 * commentTip,评论提示
			 * user,用户输入框
			 * psw,密码输入框
			 * login,登录按钮
			 * logout,退出链接
			 * loginTip,登录提示
			 */
			this.dom = {
				wrap:wrap,
				form:byClass('J_Comment_Form',wrap)[0],
				content:byClass('J_Comment_Content',wrap)[0],
				submit:byClass('J_Comment_Submit',wrap)[0],
				commentTip:byClass('J_Comment_Tip',wrap)[0],
				user:byClass('J_Login_User',wrap)[0],
				psw:byClass('J_Login_Psw',wrap)[0],
				remeber:byClass('J_Login_Remeber',wrap)[0],
				login:byClass('J_Login_Submit',wrap)[0],
				logout:byClass('J_Login_Logout',wrap)[0],
				loginTip:byClass('J_Login_Tip',wrap)[0],
				toWeiboWrap:byClass('J_Comment_ToWeibo_Wrap',wrap)[0],
				toWeibo:byClass('J_Comment_ToWeibo',wrap)[0]
			};
			self.bindEvent();
		},
		bindEvent:function(){
			var self     = this;
			var dom      = self.dom;
			var submitComment = function(){
				self.commenting = true;
				/*产品不要登录按钮，评论前登录*/
				//未填写内容
				var content = trim(dom.content.value);
				var emptyTip = getPlaceholer(dom.content);
				if(content==''||content==emptyTip){
					self.commentTip('error',emptyTip);
					dom.content.focus();
					return;
				}
				//超过3000字不允许提交
				if($.util.byteLength(content)>6000){
					alert('您的评论字数超出了上限3000字,请修改后再提交！');
					dom.content.focus();
					return;
				}
				//$globalInfo.isLogin为通过自定义登录成功事件设置的，比较慢，有用户退出还可为true的情况
				//if(!$globalInfo.isLogin){
				if(!sinaSSOController.get51UCCookie()){
					//未登录,尝试登录，登录成功后评论
					var value_user = trim(dom.user.value);
					var value_psw = trim(dom.psw.value);
					//当用户名或密码为空时不尝试登录评论，返回
					if(value_user==''||value_psw==''){
						self.commentTip('error','请先登录再提交评论');
						dom.user.focus();
						return;
					}
					//绑定登录后评论
					self.loginWithComment = true;
					cusEvt.add($,'ce_login',function(e){
						if(e.data.action==='loginWithComment'&&self.loginWithComment){
					   	  	self.comment();
					   	  	self.commenting = false;
					   	  	self.loginWithComment = false;
						}
					},{action:'loginWithComment'});
					//登录
					//suda统计点击
					try{
						_S_uaTrack("entcomment", "login");
					}catch(e){

					}
					self.login();
				}else{
					//已经登录马上评论
					self.comment();
				}
				/*/产品不要登录按钮，评论前登录*/
			};
			var addPropertyChangeEvent = function (obj,fn) {
			  if(window.ActiveXObject){
			      obj.onpropertychange = fn;
			  }else{
			      obj.addEventListener("input",fn,false);
			  }
			}
			//点击退出
			addEvt(dom.logout,'click',function(o){
			    $.app.logout();
			    // dom.psw.value='';
			    // dom.user.value='';
			    //dom.user.focus();
			});
			//是否转发到微博
			addEvt(dom.toWeiboWrap,'click',function(o){
				// 点击事件已经统一到simcheck
				// var toWeibo = dom.toWeibo;
				// var toClz = 'to_mb_selected';
				// if($.dom.hasClass(dom.toWeibo,toClz)){
				// 	$.dom.removeClass(toWeibo,toClz);
				// 	toWeibo.setAttribute('toweibo',0);
				// }else{
				// 	$.dom.addClass(toWeibo,toClz);
				// 	toWeibo.setAttribute('toweibo',1);
				// }
				//suda统计点击
				try{
					_S_uaTrack("entcomment", "toweibo");
				}catch(e){

				}

			});
			//评论
			addEvt(dom.submit,'click',function(){
				submitComment();
			});
			//给用户名，密码，评论输入框，添加快捷键
			addEvt(dom.user,'keydown',function(e){
				e = e || window.event;
				if (e.keyCode == 13) {
					//suda统计点击
					try{
						_S_uaTrack("entcomment", "login");
					}catch(e){

					}
				    self.login();
				}
			});
			addEvt(dom.psw,'keydown',function(e){
				e = e || window.event;
				if (e.keyCode == 13) {
					//suda统计点击
					try{
						_S_uaTrack("entcomment", "login");
					}catch(e){

					}
				    self.login();
				}
			});
			addEvt(dom.content,'keydown',function(e){
				e = e || window.event;
				if (e.keyCode == 13 && e.ctrlKey) {
				    submitComment();
				}
			});
			addEvt(dom.content,'keyup',function(e){
				setTimeout(function(){
					self.toggleSubmitBtn();
				},200);
			});
			addEvt(dom.wrap,'click',function(e){
				setTimeout(function(){
					self.toggleSubmitBtn();
				},200);
			});
			addEvt(dom.content,'focus',function(e){
				setTimeout(function(){
					self.toggleSubmitBtn();
				},200);
			});
			addPropertyChangeEvent(dom.content,function(){
				self.toggleSubmitBtn();
			});
			//placeholder
			var placeholders = [dom.user,dom.psw,dom.content];
			$.app.placeholder(placeholders);

			return self;

		},
		toggleSubmitBtn:function(){
			var self = this;
			var dom = self.dom;
			var content = dom.content;
			var submit = dom.submit;
			var cont = trim(content.value);
			var emptyTip = getPlaceholer(content);
			var disableClz = 'post_inline_comment_disbled';
			if(cont==''||cont==emptyTip){
				addClass(submit,disableClz);
			}else{
				removeClass(submit,disableClz);
			}
		},
		login:function(){
			if($globalInfo.isLogin){return;}
			var self = this;
			var dom = self.dom;
			var value_user = trim(dom.user.value);
			var value_psw = trim(dom.psw.value);
			var value_remeber = parseInt(dom.remeber.getAttribute('remeberme'));
			if(value_user==''||value_psw==''){
				dom.loginTip.innerHTML = '<span class="notice">用户名/密码不能为空</span>';
				dom.loginTip.style.display = '';
				setTimeout(function(){
					if(window.jQuery){
						jQuery(dom.loginTip).fadeOut('slow');
					}else{
						dom.loginTip.style.display = 'none';
					}
				},3000);
			}else{
				//移除所以自定义登录出错事件，避免点击时，多个地方同时出现错误提示
				cusEvt.remove($,'ce_loginError');
				//只绑定正在点击的对象
				cusEvt.add($,'ce_loginError',function(e){
				    self.loginError(e);
				},dom);
			    $.app.login(value_user,value_psw,value_remeber);
			}
		},
		loginError:function(e){
			var dom = e.data;
			dom.loginTip.innerHTML = '<span class="notice">用户名/密码错误</span>';
			dom.loginTip.style.display = '';
			setTimeout(function(){
				if(window.jQuery){
					jQuery(dom.loginTip).fadeOut('slow');
				}else{
					dom.loginTip.style.display = 'none';
				}
			},3000);
		},
		comment:function(){
			var self = this;
			var dom = self.dom;
			//评论内容
			var content = trim(dom.content.value);
			content = content.replace(/\r\n/g,'<br/>');
			content = content.replace(/\n/g,'<br/>');
			content = content.replace(/\r/g,"<br />");
			content = content.replace(/\t/g,'!@');
			/*var regExp = new RegExp('','g');
			content = content.replace(regExp , '&nbsp');*/
			//是否转发到微博，转发到微博附加原文链接，如果有视频链接附加视频链接
			var toweibo = dom.toWeibo.getAttribute('toweibo');

			//评论接口
			$.app.comment(content,self.mid,self.newsid,self.channel,toweibo);
			//评论后动作，模拟已经评论，盖楼
			self.commented(content,toweibo);
			//suda统计点击
			try{
				_S_uaTrack("entcomment", "comment");
			}catch(e){

			}
		},
		commentTip:function(type,txt){
			//succ,eror,tip
			var tip = this.dom.commentTip;
			tip.innerHTML = '<p class="post_tip_'+type+'">'+txt+'</p>';
			tip.style.display = '';
			setTimeout(function(){
				if(window.jQuery){
					jQuery(tip).fadeOut('slow');
				}else{
					tip.style.display = 'none';
				}
			},1000);

		},
		commented:function(con,toweibo){
			var self = this;
			var mid = self.mid;
			var dom = self.dom;
			//清空评论框
			dom.content.value='';
			self.toggleSubmitBtn();
			var WBUURL = 'http://weibo.com/u/';
			//用户类型css类
			var typeClz = $globalInfo.isWeiboLogin? 't_weibo':'';
			//乔敏建议不要审核提示
			//var POSTING_TIP = '<p class="comment_posting">评论成功，审核中...</p><p>';
			var POSTING_TIP = '';
			//var POSTING_TIP = '';
			/**
			 * 获取微博用户的链接或者新浪用户昵称
			 * @return {[type]} [description]
			 */
			function get_user_lnk(){
				var userLnk = $globalInfo.isWeiboLogin?
					'<a href="'+WBUURL+$globalInfo.uid+'" target="_blank">'+$globalInfo.weiboName+'</a>':
					$globalInfo.sinaNick;
				return userLnk;
			}
			function get_user_face(){
				var face = 'http://www.sinaimg.cn/dy/deco/2012/1018/sina_comment_defaultface.png';
				var link = 'http://login.sina.com.cn/member/my.php';
				var name = $globalInfo.sinaNick;
				if($globalInfo.isWeiboLogin){
					face = $globalInfo.profile_image_url;
					link = 'http://weibo.com/';
					name = $globalInfo.weiboName;
				}
				return '<a href="'+link+'" title="'+name+'" target="_blank"><img src="'+face+'"/></a>';
			}
			function getCParent(ele,clz){
				var par = ele.parentNode;
				if($.dom.hasClass(par,clz)){
					return par;
				}else{
					return getCParent(par,clz);
				}
			}
			//type有三种，回复楼内，回复楼外，直接评论
			var type = self.dom.wrap.getAttribute('cmnt-type');
			if(type=='outerReply'){
				//整条评论容器

				var comment_item = byId('J_Comment_Item-'+self.mid);
				//当前评论信息容器
				var info_wrap = byClass('J_Comment_Info',comment_item)[0];
				//评论列表容器
				var replylist_wrap = byClass('J_Comment_Reply',comment_item)[0];
				//当前评论内容容器
				var content_wrap = byClass('J_Comment_Txt',comment_item)[0];
				//头像容器
				var face_wrap = byClass('J_Comment_Face',comment_item)[0];
				//原有被回复评论html
				var html = replylist_wrap.innerHTML;
				//从评论列表中找出当前评论数据
				// var cList= $.job.cmntList.cList;
				// var curCmntlist = {};
				// for (var i = cList.length - 1; i >= 0; i--) {
				// 	var item = cList[i];
				// 	if(typeof item!='undefined'){
				// 		if(item.mid==mid){
				// 			curCmntlist = item;
				// 		}
				// 	}
				// };
				var curCmntlist = $.cmnt.data.get('cmntlist',mid);
				//计算出新数层数（被回复数）
				var reply_length = byClass('orig_index',replylist_wrap).length+1;
				// var area = (curCmntlist.usertype == 'wb'||curCmntlist.area=='')?'&nbsp;':'['+curCmntlist.area+']';
				var area = (curCmntlist.area==''?'&nbsp;':'['+curCmntlist.area+']');
				var ch_newsid_mid = 'channel='+curCmntlist.channel+'&newsid='+curCmntlist.newsid+'&mid='+curCmntlist.mid;
				//当前评论转为被回复评论
				var tempHtml = '<span class="orig_index">'+reply_length+'</span>'
	             	   +'<div class="orig_user">'+_cmntUtil.get_user_lnk(curCmntlist)+'<span class="orig_area">'+area+'</span></div>'
					   +'<div class="orig_content">'+_cmntUtil.filterEmotionIco(encodeHTML(curCmntlist.content))+'</div>'
					   +'<div class="orig_reply"  style="visibility: ;"><div class="reply">'+getTimeStr(curCmntlist.time,'datetime')+'<span class="reply-right"><a action-type="vote" action-data="'+ch_newsid_mid+'" href="javascript:;" voted="false" class="comment_ding_link" title="支持"><span>支持<em>('+curCmntlist.agree+')</em></span></a> <a action-type="reply" action-data="'+ch_newsid_mid+'&type=innerReply" href="javascript:;" poped="false" class="comment_reply_link" title="回复">回复</a> '
					   +'<a href="javascript:;" action-type="shareHover" class="cmnt-share-tirgger" title="分享"><em>分享</em></a></span>'
		           +'<span class="cmnt-share-btns J_Comment_Share_Btns"><a class="cmnt-share-btn-sina" href="javascript:;" action-type="share" action-data="'+ch_newsid_mid+'&site=sina">新浪</a><a class="cmnt-share-btn-qq" href="javascript:;"  action-type="share" action-data="'+ch_newsid_mid+'&site=tencent">腾讯</a></span>'
					   +'</div></div>';
				html = '<div class="comment_orig_content"><div class="orig_cont clearfix">' +html+tempHtml +'</div></div>';

				replylist_wrap.innerHTML = html;
				//当前回复内容
				content_wrap.innerHTML = POSTING_TIP+_cmntUtil.filterEmotionIco(encodeHTML(con))+'</p><div class="reply">'+getTimeStr('','datetime')+'</div>';
				//当前回复的信息，用户名，用户类型，时间，地区没有
				info_wrap.innerHTML = '<div class="t_info"> <span class="t_username '+typeClz+'">'+get_user_lnk()+'</span><span class="t_area">&nbsp;</span></div>'
         	 +'';
         	 	face_wrap.innerHTML = get_user_face();
         	 	//回复完毕后，隐藏发布框
         	 	self.dom.wrap.style.display = 'none';

			}else if(type=='comment'){
				var weiboTip = toweibo==1?'并转发至微博':'';

				//新评论内容
				var tempHtml = '<div class="comment_item"><div class="comment_item_cont clearfix"><div class="J_Comment_Face t_face">'
	         	+get_user_face()+'</div><div class="t_content"><div class="J_Comment_Info"><div class="t_info"><span class="t_username '+typeClz+'">'+get_user_lnk()+'</span><span class="t_area">&nbsp;</span></div></div><div class="comment_content J_Comment_Txt clearfix"><div class="t_txt">'+POSTING_TIP+_cmntUtil.filterEmotionIco(encodeHTML(con))+'</p></div><div class="comment_orig_content J_Comment_Reply">'+getTimeStr('','datetime')+'</div></div></div></div></div>';
				//插到列表最前面
				var fragment = $.C('div');
				fragment.innerHTML = tempHtml;

				var cmntList_dom = byId('J_Comment_List_Latest');
				cmntList_dom.insertBefore(fragment,cmntList_dom.firstChild);
				//不隐藏评论框的评论，应该出现提示
				self.commentTip('succ','评论成功'+weiboTip);
				//评论框恢复默认样式并打开列表
				setTimeout(function(){
					if(self.dom.wrap.getAttribute('isFixed')=='1'){
						removeClass(self.dom.wrap,'post_box_showall');
					}
				},2500);
				//某些频道不显示评论列表,即使评论了也不显示，ARTICLE_DATA.hideCMNTList，默认为0不显示，为1显示
				if(!(ARTICLE_DATA.hideCMNTList&&ARTICLE_DATA.hideCMNTList==1)){
					byId('J_Comment_List_Wrap').style.display='';
					//评论后跳转到最新评论的顶端
					self.toLatestList();
				}

			}else{
				var tempHtml = '<div class="orig_user"><span class="t_username '+typeClz+'">'+get_user_lnk()+'</span><div class="orig_content">'+POSTING_TIP+_cmntUtil.filterEmotionIco(encodeHTML(con))+'</p><div class="reply">'+getTimeStr('','orig_time')+'</div></div>';
				var fragment = $.C('div');
				fragment.className = 'orig_reply_wrap';
				fragment.innerHTML = tempHtml;
				// TODO 插入dom
				var replay_wrap = getCParent(dom.submit,'orig_cont');
				replay_wrap.appendChild(fragment);
				//回复完毕后，隐藏发布框
				self.dom.wrap.style.display = 'none';

			}


		},
		toLatestList:function(){
			//等待提示消失后再跳转
			setTimeout(function(){
				var gap = parseInt(jQuery('#J_Comment_Wrap_Latest').offset().top)-300;
		        if(window.jQuery&&!$globalInfo.ua.isIE6){
			        jQuery("body,html").animate({scrollTop:gap},500);
				}else{
					document.documentElement.scrollTop=gap;
					document.body.scrollTop=gap;
				}
			},1500);

		}

	};
	return cmntForm;
});
/**
 * 实例化 浮动评论框，包括绑定浮动时展开收起事件
 */
SAB.register('job.cmntFormBottom',function($){
	var createForm = function(){
		var FormBottom = new $.job.cmntForm('J_Comment_Form_B');
		var body = document.getElementsByTagName('body')[0];
		var wrap = FormBottom.dom.wrap;
		var content = FormBottom.dom.content;
		$.evt.addEvent(wrap,'click',function(e){
			$.dom.addClass(wrap,'post_box_showall');
			// content.focus();
			// if (e && e.stopPropagation){
			// 　　e.stopPropagation();
			// }else{
			// 　　window.event.cancelBubble = true;
			// }
		});
		$.evt.addEvent(body,'click',function(e){
			if(wrap.getAttribute('isFixed')=='0'){
				return;
			}
			if(typeof e == 'undefined'){
				e = window.event;
			}
			var target = e.target||e.srcElement;
			if($.dom.contains(target,wrap)){
				$.dom.removeClass(wrap,'post_box_showall');
			}

		});
		return FormBottom;
	}

	var cusEvt = $.evt.custEvent;
	cusEvt.add($, 'ce_cmntFirstRenderEnd', createForm);
});
/**
 * 支持
 */
SAB.register('job.vote',function($){
	var _splitNum = $.app.splitNum;
	function bindVote(){
		var byId = $.dom.byId;
		var cmntlist = $.job.cmntList;
		var wrap = document.getElementsByTagName('body')[0];
		if(!wrap){
			return;
		}
		//事件委派
		var dldEvt = $.evt.delegatedEvent;
		var dldEvt_comment= dldEvt(wrap);

		//点击支持
		dldEvt_comment.add('vote','click',function(o){
			var ele = o.el;
			var hasVoted = ele.getAttribute('voted');
			if(hasVoted=='true'){return;}
			var url = 'http://comment5.news.sina.com.cn/cmnt/vote';
			var param = {
				channel:o.data.channel||$globalInfo.news.channel,
				newsid:o.data.newsid||$globalInfo.news.newsid,
				parent:o.data.mid,
				format:'js',
				vote:1,
				callback:function(d){},
				domain:'sina.com.cn'
			};
			$.io.ijax.request(url,{
				//param:param,
				POST:param,
				onComplete:function(msg){
					//TODO 回调不成功
				}
			});
			var vote_tip = $.C('div');
			vote_tip.className = 'vote_tip';
			ele.parentNode.appendChild(vote_tip);
			if(window.jQuery){
				jQuery(vote_tip).animate({opacity: "show", top: "-28"}, "fast");
			}else{
				vote_tip.style.cssText =' ;display:block;top:-28px;';
			}
			setTimeout(function(){
				if(window.jQuery){
					jQuery(vote_tip).animate({opacity: "hide", top: "0"}, "fast");
				}else{
					vote_tip.style.cssText ='';
				}
			},800);
			$.dom.addClass(ele,'comment_ding_link_active');

			var vote = ele.title;
			var voted = '已'+vote;
			var html = ele.innerHTML;
			var num = parseInt(html.replace(/[^\d]/g,''),10);
			var newnum = num+1;
			ele.innerHTML = html.replace(_splitNum(num),_splitNum(newnum)).replace(vote,voted);
			ele.title = voted;
			ele.setAttribute('voted','true');
		});
	}
	bindVote();
	var cusEvt = $.evt.custEvent;
	cusEvt.add($, 'ce_cmntItemFirstRenderEnd', bindVote);
});
/**
 * 评论列表划过效果
 */
SAB.register('job.cmntListHover',function($){
	var listHover = function(){
			if(!window.jQuery){
				return;
			}
			var jQ = jQuery;
			if(typeof jQ!= 'undefined'){
					var cmntlist = jQ('#J_Comment_Wrap');
					var cmntSelectedClz = 'comment_selected';
					//回复列表s楼里
					cmntlist.delegate("div.orig_cont", "mouseover",function(e) {
						var item = jQ(this);
						var commentItem = item.parents('div.comment_item');
						commentItem.addClass(cmntSelectedClz);
						var reply = item.find('.replay-right');
						if(reply.length>0){
							reply[0].style.visibility='visible';
						}
				        // e.stopPropagation();
				    });
				    cmntlist.delegate("div.orig_cont","mouseout",function(e) {
	    		        var reply = jQ(this).find('.replay-right');
	    		        if(reply.length>0){
	    			        // reply[0].style.visibility='hidden';
	    		        }
				        // e.stopPropagation();
				    });
				    // 楼外
			    	cmntlist.delegate("div.comment_item", "mouseover",function(e) {
			    		var $item = jQ(this);
			    		$item.addClass(cmntSelectedClz);
			    		// var reply = $item.find('div.J_Comment_Txt span.replay-right');
			    		// if(reply.length>0){
				    	// 	reply[0].style.visibility='visible';
			    		// }
			            // e.stopPropagation();
			        });
			        cmntlist.delegate("div.comment_item","mouseout",function(e) {
			        	var $item = jQ(this);
			    		$item.removeClass(cmntSelectedClz);
			    		// var reply = $item.find('div.J_Comment_Txt span.replay-right');
			    		// if(reply.length>0){
				     //        reply[0].style.visibility='hidden';
			    		// }
			            // e.stopPropagation();
			        });
			}
	};
	var cusEvt = $.evt.custEvent;
	cusEvt.add($, 'ce_cmntItemFirstRenderEnd', listHover);


});
/**
 * 列表下方加载更多
 */
SAB.register('job.getmore', function($) {
	var _byId = $.dom.byId;
	var _byClass = $.dom.byClass;
	var _removeClass = $.dom.removeClass;
	var _reachBottom = $.util.reachBottom;
	var _throttle = $.util.throttle;
	var _addEvent = $.evt.addEvent;
	var _cusEvt = $.evt.custEvent;
	//事件委派
	var _dldEvt = $.evt.delegatedEvent;
	var ifmPVStat = (function() {
		// pv统计
		var iFrameID = 'J_CMNTMORE_PV_IFRAME';
		var PVURL = 'http://comment5.news.sina.com.cn/comment/log.html';
		var bodyDom = document.getElementsByTagName('body')[0];
		return function() {
			//新建iframe统计流量
			var oldIframe = _byId(iFrameID);
			if (oldIframe) {
				bodyDom.removeChild(oldIframe);
			}
			var fragment = $.C('div');
			fragment.style.display = 'none';
			fragment.id = iFrameID;
			fragment.innerHTML = '<iframe class="invisible" scrolling="no" src="' + PVURL + '?_t=' + new Date().getUTCMilliseconds() + ('' + Math.random()).substring(3) + '" allowTransparency="true" style="display:none;" frameborder="0"></iframe>';
			bodyDom.appendChild(fragment);
		};
	})();
	// 列表类型
	var listTypes = ['Latest', 'Hot'];
	var getMoreObj = {};
	// 切换更多提示
	getMoreObj.moreToggle = (function(){
		var more = {
			'Hot':null,
			'Latest':null
		};
		return function(type,dis){
			if(!more[type]){
				more[type] = _byId('J_Comment_More_' + type);
			}
			more[type].style.display = dis;
		};
	})();
	getMoreObj.hasMore = function() {
		var wrap = _byId('J_Comment_Wrap');
		var Cmntlist = $.job.cmntList;
		var cmntListOpt = Cmntlist.options;
		var cmntListParam = cmntListOpt.param;
		var cmntListType = cmntListOpt.listType;

		//如果上次加载没加载完成，忽略此次请求
		if (!wrap || Cmntlist.loading) {
			return;
		}
		/**
		 *
		 * @param  {[type]} type [description]
		 * @return {[type]}      [description]
		 */
		var showMore = function(type) {
			//页面内还有隐藏的page时，直接显示，没有是则请求
			var pagesDom = _byClass('J_Comment_Page_' + type, wrap, 'div');
			var firstPageDom = pagesDom[0];
			if (pagesDom && pagesDom.length > 0) {
				if (window.jQuery) {
					jQuery(firstPageDom).fadeIn();
				} else {
					firstPageDom.style.display = '';
				}
				_removeClass(firstPageDom, 'J_Comment_Page_' + type);
				//显示更多供点击，如果这是热评最后一个就不要显示更多了，评论不会再getData请求数据，最新评论要通过getData请求数据，如果小于总评论数才隐藏

				if (pagesDom.length == 1 && type == 'Hot') {
					getMoreObj.moreToggle(type,'none');
				} else {
					getMoreObj.moreToggle(type,'');
				}

			} else {
				if (type != 'Hot') {
					//当还有数据时加载，否则显示end>没有评论了
					if (cmntListParam.page * cmntListParam.page_size < Cmntlist.totalNum) {
						//加载下一页，只更新latest数据（其实接口获取的数据还是全部，只是在渲染的时候不渲染热点评论列表，接口不支持分类获取 @王磊）
						cmntListParam.page++;
						Cmntlist.setType('latest');
						Cmntlist.getData();
						getMoreObj.moreToggle(type,'');
					} else {
						//隐藏更多
						getMoreObj.moreToggle(type,'none');
						Cmntlist.dom.end.style.display = '';
					}
				} else {
					// 热点评论只有两个分页,隐藏更多
					getMoreObj.moreToggle(type,'none');
				}

			}
			// 如果通过滚动来加载最新评论，显示更多也隐藏
			// if (ARTICLE_DATA.scrollLoad && type == 'Latest') {
			// 	getMoreObj.moreToggle(type,'none');
			// }
		};
		if (cmntListType != 'all') {
			// 只显示热门评论或者最新评论
			showMore(cmntListType == 'latest' ? listTypes[0] : listTypes[1]);
		} else {
			// 热门评论和最新评论都显示
			for (var i = listTypes.length - 1; i >= 0; i--) {
				showMore(listTypes[i]);
			};
		}

	};
	getMoreObj.getmore = function() {
		var wrap = _byId('J_Comment_Wrap');
		if (!wrap) {
			return;
		}
		var Cmntlist = $.job.cmntList;
		var dldEvt_comment = _dldEvt(wrap);
		//点击加载 包括type hot latest
		dldEvt_comment.add('getmore', 'click', function(o) {
			var type = o.data.type;
			Cmntlist.setType(type);
			getMoreObj.hasMore();
			// 流量统计
			ifmPVStat();
		});
	};
	// 滚动到底部自动加载 只包括 latest
	getMoreObj.scrollLoad = function() {
		var Cmntlist = $.job.cmntList;
		if (_reachBottom()) {
			Cmntlist.setType('latest');
			getMoreObj.hasMore();
			// 流量统计
			ifmPVStat();
		}
	};
	getMoreObj.scrollEvent = function() {
		_addEvent(window, 'scroll', function() {
			_throttle(getMoreObj.scrollLoad, getMoreObj);
		});
	};
	// 绑定自定义事件 ce_cmntRenderEnd在评论列表每次加载完时都会触发
	// ce_cmntFirstRenderEnd在评论列表第一次加载完时会触发
	_cusEvt.add($, 'ce_cmntRenderEnd', getMoreObj.hasMore);
	_cusEvt.add($, 'ce_cmntFirstRenderEnd', getMoreObj.getmore);
	if (ARTICLE_DATA.scrollLoad) {
		_cusEvt.add($, 'ce_cmntFirstRenderEnd', getMoreObj.scrollEvent);
	}
	return getMoreObj;

});
/**
 * TextArea 扩展操作工具
 */
SAB.register('app.textareaUtils', function($){
				var T = {}, ds=document.selection;
				/**
				 * 获取指定Textarea的光标位置
				 * @param {HTMLElement} oElement 必选参数，Textarea对像
				 */
				T.selectionStart = function( oElement ){
					if(!ds){return oElement.selectionStart}
					var er = ds.createRange(), value, len, s=0;
					var er1 = document.body.createTextRange();
						er1.moveToElementText(oElement);
						for(s; er1.compareEndPoints("StartToStart", er)<0; s++){
							er1.moveStart('character', 1);
						}
					return s
				}
				T.selectionBefore = function( oElement ){
					return oElement.value.slice(0,T.selectionStart(oElement))
				}
				/**
				 * 选择指定有开始和结束位置的文本
				 * @param {HTMLElement} oElement 必选参数，Textarea对像
				 * @param {Number}      iStart   必选参数, 起始位置
				 * @param {Number}      iEnd     必选参数，结束位置
				 */
				T.selectText = function( oElement, nStart, nEnd) {
					oElement.focus();
					if (!ds){oElement.setSelectionRange(nStart, nEnd);return}
					var c = oElement.createTextRange();
						c.collapse(1);
						c.moveStart("character", nStart);
						c.moveEnd("character", nEnd - nStart);
						c.select()
				}
				/**
				 * 在起始位置插入或替换文本
				 * @param {HTMLElement} oElement    必选参数，Textarea对像
				 * @param {String}      sInsertText 必选参数，插入的文本
				 * @param {Number}      iStart      必选参数，插入位置
				 * @param {Number}      iLength     非必选参数，替换长度
				 */
				T.insertText = function( oElement, sInsertText, nStart, nLen){
					oElement.focus();nLen = nLen||0;
					if(!ds){
						var text = oElement.value, start = nStart - nLen, end = start + sInsertText.length;
						oElement.value = text.slice(0,start) + sInsertText + text.slice(nStart, text.length);
						T.selectText(oElement, end, end);return
					}
					var c = ds.createRange();
						c.moveStart("character", -nLen);
						c.text = sInsertText
				}

				/**
				 * @param {object} 文本对象
				 */
				T.getCursorPos = function(obj){
					var CaretPos = 0;
				    if ($globalInfo.ua.isIE) {
				        obj.focus();
				        var range = null;
						range = ds.createRange();
						var stored_range = range.duplicate();
						stored_range.moveToElementText( obj );
						stored_range.setEndPoint('EndToEnd', range );
						obj.selectionStart = stored_range.text.length - range.text.length;
						obj.selectionEnd = obj.selectionStart + range.text.length;
						CaretPos = obj.selectionStart;
				    }else if (obj.selectionStart || obj.selectionStart =='0'){
						CaretPos = obj.selectionStart;
					}
				    return CaretPos;
				}
				/**
				 * @param {object} 文本对象
				 */
				T.getSelectedText = function(obj){
					var selectedText = '';
					var getSelection = function (e){
			            if (e.selectionStart != undefined && e.selectionEnd != undefined)
			                return e.value.substring(e.selectionStart, e.selectionEnd);
			            else
			                return '';
			        };
			        if (window.getSelection){
						selectedText = getSelection(obj);
					}else {
						selectedText = ds.createRange().text;
					}
					return selectedText;
				}
				/**
				 * @param {object} 文本对象
				 * @param {int} pars.rcs Range cur start
				 * @param {int} pars.rccl  Range cur cover length
				 * 用法
				 * setCursor(obj) cursor在文本最后
				 * setCursor(obj,5)第五个文字的后面
				 * setCursor(obj,5,2)选中第五个之后2个文本
				 */
				T.setCursor = function(obj,pos,coverlen){
					pos = pos == null ? obj.value.length : pos;
					coverlen = coverlen == null ? 0 : coverlen;
					obj.focus();
					if(obj.createTextRange) { //hack ie
				        var range = obj.createTextRange();
				        range.move('character', pos);
						range.moveEnd("character", coverlen);
				        range.select();
					} else {
				        obj.setSelectionRange(pos, pos+coverlen);
				    }
				}
				/**
				 * @param {object} 文本对象
				 * @param {Json} 插入文本
				 * @param {Json} pars 扩展json参数
				 * @param {int} pars.rcs Range cur start
				 * @param {int} pars.rccl  Range cur cover length
				 *
				 */
				T.unCoverInsertText = function(obj,str,pars){
					pars = (pars == null)? {} : pars ;
					pars.rcs = pars.rcs == null ? obj.value.length : pars.rcs*1;
					pars.rccl = pars.rccl == null ? 0 : pars.rccl*1;
					var text = obj.value,
						fstr = text.slice(0,pars.rcs),
						lstr = text.slice(pars.rcs + pars.rccl,text== ''?0:text.length);
					obj.value = fstr + str + lstr;
					this.setCursor(obj,pars.rcs+(str==null?0:str.length));
				}
				return T;
		});
/**
 * 表情
 */

SAB.register('app.face', function($){
			var F={iniTarget:null,srcInput:null,iconLayer:null,iconText:'',isShow:false,callback:function(){}};
			var faces = ARTICLE_DATA.allFaces;

			function hideFace(e){
				if(!F.isShow){
					return;
				}

				var t = e.target||e.srcElement;
				if(t != F.iniTarget && !$.dom.contains(F.iconLayer, t)){
					F.hide();
				}
			}
			function renderFace(wrap,layerWidth){
				layerWidth = layerWidth || "360px";
				faces = faces||{}, list=[];
				var imgURI = ARTICLE_DATA.allFacesBase;
				//IE使用逐个加载表情图片的办法，其它浏览器批量加载
				// if($globalInfo.ua.isIE){
				// 	setTimeout(function(){
				// 		var oContainer = $.dom.byId('J_Faces_Icos');
				// 		for(var i=0;i<len;i++){
				// 			(function(i){
				// 				var oImg = new Image();
				// 				oImg.onload = function(){
				// 					var oLi = $.C("LI");
				// 					oLi.innerHTML = '<a href="javascript:void(0)" action-type="face-insert" ' +
				// 						'action-data="text=' + faces[i].text + '" title="' + faces[i].ico + '">' +
				// 						'<img src="'+ imgURI + faces[i].src +'.gif" alt="'+ faces[i].ico +'" /></a>';
				// 					oContainer.appendChild(oLi);
				// 					oImg.onload = null;
				// 					oImg = null;
				// 				};
				// 				oImg.src = imgURI + faces[i].src+'.gif';

				// 			})(i);
				// 		}
				// 	},100);
				// }else{
					for(var i in faces){
						list.push('<li><a href="javascript:void(0)" action-type="face-insert"' +
						'action-data="text=[' + i + ']" title="' + i + '">' +
						'<img src="'+ imgURI + faces[i] +'.gif" alt="'+ i +'" /></a></li>');
					}
				var icons = '<table class="article-layer">'
							+'<tbody><tr> <td class="a-l-top-l"></td> <td class="a-l-top-c"></td> <td class="a-l-top-r"></td> </tr> <tr> <td class="a-l-m-l"></td> <td class="a-l-m-c"><div class="a-l-box">'
								+'<div class="a-l-box-con" style="'+layerWidth+'">'
									+'<div class="face-list clearfix">'
										+'<div class="a-l-arrow"></div>'
										+'<div class="a-l-close-wrap">'
											+'<a action-type="face-close" class="a-l-close" href="javascript:;" title="关闭"></a>'
										+'</div>'
										+'<div class="face-list-items">'
											+'<ul id="J_Faces_Icos">'
											+ list.join('')
											+'</ul>'
										+'</div>'
									+'</div>'
								+'</div>'
							+'</div></td><td class="a-l-m-r"></td></tr><tr><td class="a-l-btm-l"></td> <td class="a-l-btm-c"></td><td class="a-l-btm-r"></td></tr></tbody></table>';
				var box = $.C("div");
				box.innerHTML = icons;
				box.style.display = "none";//避免IE下表情图片定位错误
				(wrap||document.body).appendChild(box);
				return box;
			};
			/**
			 * 在光标位置插入文本
			 * @param{Object}oInput
			 * @param{String}text
			 * */
			function insertText(oInput,text){
				if($globalInfo.ua.isIE){
					var range = oInput.createTextRange();
					range.collapse(true);
					if(oInput.caretPos){
						var caretPos = oInput.caretPos;
						caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? text + ' ' : text;
						range.moveStart('character',oInput.value.indexOf(text)+1);
						range.moveEnd('character',text.length-2);
					}else{
						var sel = document.selection.createRange();
						document.selection.empty();
						sel.text = text;
					}
				}else if(oInput.setSelectionRange){
					var start = oInput.selectionStart;
					var end = oInput.selectionEnd;
					var str1 = oInput.value.substring(0, start);
					var str2 = oInput.value.substring(end);
					var v = str1 + text,len = v.length;
					oInput.value =  v + str2 ;
					oInput.setSelectionRange(len,len);
				}else{
					oInput.value += text;
				}
			}
			/**
			 * 显示表情层
			 * @param{HTML Element}target 定位相对元素（如某按钮）
			 * @param{HTML Element}input 输入目标(用于设置返回表情值)
			 * @param{HTML Element}wrap 表情层的父级，默认为body
			 *
			 * @param{Number}dX 可选参数 微调left值
			 * @param{Number}dY 可选参数 微调top值
			 * @param{String}layerWidth 可选参数 表情层宽度值（默认360px）
			 * @param{String}callback 可选参数 插入表情完毕后回调函数
			 * */
			F.show = function(target,input,wrap,dX,dY,layerWidth,cb){
				var iconLayer = F.iconLayer;
				var position;
				if(iconLayer){
					hideFace();
				}
				// 没有表情层或者父级不同时要渲染表情层
				F.wrap=F.wrap||null;
				if(!iconLayer||F.wrap!=wrap){
					iconLayer = renderFace(wrap,layerWidth);
					F.wrap=wrap;
				}
				if(cb){
					callback = cb;
				}
				if(wrap&&wrap!=document.body){
					position=[0,0];
				}else{
					position = $.dom.getXY(target);
					position[1] += target.offsetHeight ;
				}

				if($globalInfo.ua.isIE){
					position[0] += -10;
				}
				if(!isNaN(dX)){
					position[0] += dX;
				}
				if(!isNaN(dY)){
					position[1] += + dY;
				}
				//add "zoom:1" hack to enable IE haslayout,透明边框效果
				iconLayer.style.cssText = "left:" + position[0] + "px;top:" + position[1] + "px;" +
				"position:absolute;z-index:1700;display:'';zoom:1;";

				F.iconLayer = iconLayer;
				F.iniTarget = target;
				F.srcInput = input;
				F.iconText = null;
				F.isShow = true;
				$.dom.addClass(target,'cmnt-emotion-trigger-active');
				$.evt.addEvent(document.body,'click',hideFace,false);
				return F.iconLayer;
			};

			/**
			 * 隐藏表情
			 * */
			F.hide = function(){
				var iconLayer = F.iconLayer;
				iconLayer && (iconLayer.style.display = "none");
				if(F.iniTarget){
					$.dom.removeClass(F.iniTarget,'cmnt-emotion-trigger-active');
				}
				$.evt.removeEvent(document.body,'click',hideFace);
				F.isShow = false;
				return iconLayer;
			};

			/**
			 * 获得选中的表情符号(转译文字)
			 * */
			F.getFace = function(){
				return F.iconText;
			};

			F.insert = function(txt,cb){
				var srcInput=F.srcInput;
				if(txt){
					// if(F.iconLayer){
					// 	F.iconLayer.style.display = "none";
					// }
					F.hide();
					if(srcInput){
						//在光标位置插入表情文本
						srcInput.focus();
						setTimeout(
							function(){
								var range = srcInput.getAttribute('range');
								if (range == null) {//评论表情处理
									insertText(srcInput,txt);
								}
								else {//发布器表情处理
									var pos = range.split('&');
									$.app.textareaUtils.unCoverInsertText(srcInput,txt,{'rcs':pos[0],'rccl':pos[1]});
									//reset
									var newPos = $.app.textareaUtils.getCursorPos(srcInput,txt);

									srcInput.setAttribute('range',newPos+'&0');
								}
								if(cb){
									cb();
								}
							},10
						);
					}
				}
			};
			return F;


});


/**
 * 表情功能
 */
SAB.register('job.face', function($){
	if(ARTICLE_DATA.hideFaces){
		return;
	}
	var byId = $.dom.byId;
	var Face = $.app.face;
	var inited = false;
	var bindFace = function(){
		var wrap = document.getElementsByTagName('body')[0];
		if(!wrap||inited){
			return;
		}
		// Face.srcInput = document.by
		//事件委派
		var dldEvt = $.evt.delegatedEvent;
		var dldEvt_face= dldEvt(wrap);
		//显示隐藏表情
		dldEvt_face.add('face-toggle','click',function(o){
			var target = o.el;
			var input = byId(o.data.id).getElementsByTagName('textarea')[0];
			var faceWrap = '';
			var left = -25;
			var top = 5;
			if(o.data.wrap){
				faceWrap = byId(o.data.wrap);
				left = -2;
				top = 165;
			}
			var layerWidth = '360';
			var cb = null;
			Face.show(target,input,faceWrap,left,top,layerWidth,cb);
		});
		//插入表情
		dldEvt_face.add('face-insert','click',function(o){
			var txt = o.data.text;
			var id = o.data.input;
			if(id){
				Face.srcInput = byId(id).getElementsByTagName('textarea')[0];
			}
			Face.insert(txt);
		});
		//关闭表情
		dldEvt_face.add('face-close','click',function(o){
			var iconLayer = Face.iconLayer;
			// if(Face.isShow){
				Face.hide();
			// }
		});
		// 初始化完成
		inited = true;
	};
	var cusEvt = $.evt.custEvent;
	// 表情在顶部输入框也有，不能只在itemRender后初始化
	cusEvt.add($, 'ce_cmntItemFirstRenderEnd', bindFace);
	cusEvt.add($, 'ce_cmntFirstRenderEnd', bindFace);

	var faceWrap;
	var getFaceWrap = function(){
	    if(!faceWrap){
	        faceWrap = $.dom.byClass('cmnt-emotion-trigger','J_Comment_Form_B')[0];
	    }
	};
	var changeFaceWrap = function(type){
	    var data = 'id=J_Comment_Form_B';
	    getFaceWrap();
	    if(type=='fix'){
	        data+='&wrap=J_Comment_Form_B';
	    }
	    faceWrap.setAttribute('action-data',data);
	};

	//评论框恢复原位
	cusEvt.add($,'ce_cmntFormReset',function(){
		changeFaceWrap('reset');
	});
	//评论框固定
	cusEvt.add($,'ce_cmntFormFix',function(){
		changeFaceWrap('fix');
	});

});
SAB.register('job.editor', function($){
	var bindEditor = function(){
		var textareaUtils = $.app.textareaUtils;
		var wrap = $.dom.byId('J_Comment_Wrap');
		if(!wrap){
			return;
		}
		//事件委派
		var dldEvt = $.evt.delegatedEvent;
		var dldEvt_editor= dldEvt(wrap);
		var editorRange = function(editor){
			var selValue = textareaUtils.getSelectedText(editor);
			var slen = (selValue == '' || selValue == null) ? 0 : selValue.length;
			var start = textareaUtils.getCursorPos(editor);
			var curStr = start + '&' + slen;
			editor.setAttribute('range',curStr);
		};

		dldEvt_editor.add('editor-change','keyup',function(o){
			editorRange(o.el);
		});
		dldEvt_editor.add('editor-change','mouseup',function(o){
			editorRange(o.el);
		});
	};
	var cusEvt = $.evt.custEvent;
	cusEvt.add($, 'ce_cmntItemFirstRenderEnd', bindEditor);
});
/**
 * 浮动评论框
 */
SAB.register('job.cmntFix',function($){
	//iphone,ipod,ipad不需要
	if($globalInfo.ua.isIOS||!ARTICLE_DATA.cmntFix){
		return;
	}
	var cusEvt = $.evt.custEvent;
	var addEvt = $.evt.addEvent;
	var addClz = $.dom.addClass;
	var removeClz = $.dom.removeClass;
	var isIE = $globalInfo.ua.isIE;
	var divFilled = null;

	var scrollFix = function(){
		var self = $.dom.byId('J_Comment_Form_B');
		var list = $.dom.byId('J_Comment_List_Wrap');
		var pNode = self.parentNode;
		var oldHeight = false;

		var showAllClz = 'post_box_showall';
		var setStyle = function(ele,o){
			for(var i in o){
				ele.style[i] = o[i];
			}
			return ele;
		};
		var fill = function(b){
			var dis = 'none';
			if(!divFilled){
				divFilled = $.C('div');
				divFilled.style.height = self.offsetHeight+'px';
				pNode.insertBefore(divFilled,self);
				setStyle(divFilled,{display:dis});
			}
			if(b){
				dis = '';
			}
			setStyle(divFilled,{display:dis});
		};
		self.setAttribute('isFixed','0');
		pNode.style.position = 'relative';
		// window.XMLHttpRequest
		if (window.XMLHttpRequest) {
			var fix = function(){
				var pOffsetTop = pNode.offsetTop+self.offsetHeight;
				var bScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				var listHeight = list.offsetHeight;
				if ((bScrollTop>=pOffsetTop)&&(bScrollTop<pOffsetTop+listHeight)) {
					//ie渲染比较慢，渲染不正确
					if(self.getAttribute('isFixed')=='1'&&!isIE){
						return;
					}
				    setStyle(self,{
				      position: "fixed",
				      top: 0,
				      left:'50%',
				      marginLeft:'-475px'
				    });
				    fill(true);
				    removeClz(self,showAllClz);
				    self.setAttribute('isFixed','1');
				    addClz(pNode,'blkCommentBoxFix');
				    cusEvt.fire($,'ce_cmntFormFix');

				} else {
					if(self.getAttribute('isFixed')=='0'&&!isIE){
						return;
					}
				    setStyle(self,{
				      position: "static",
				      left:'0',
				      marginLeft:'0'
				    });
				    fill(false);
				    addClz(self,showAllClz);
				    self.setAttribute('isFixed','0');
				    removeClz(pNode,'blkCommentBoxFix');
				    cusEvt.fire($,'ce_cmntFormReset');
				}
			}

		} else { //for ie6
				//注意 IE6下不要添加blkCommentBoxFix这个类！！！
				var fix = function(){
					var selfHeight = self.offsetHeight;
					var pOffsetTop = pNode.offsetTop+selfHeight;
					var bScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
					var listHeight = list.offsetHeight;
					if ((bScrollTop>=pOffsetTop)&&(bScrollTop<pOffsetTop+listHeight)) {
						setStyle(self, {
							position: "absolute",
							top:bScrollTop-pOffsetTop+selfHeight+'px'
						});
						fill(true);
						// if(self.getAttribute('isFixed')=='1'){
						// 	return;
						// }
						self.setAttribute('isFixed','1');
						removeClz(self,showAllClz);
						addClz(pNode,'blkCommentBoxFix6');
						cusEvt.fire($,'ce_cmntFormFix');
					} else {
						// if(self.getAttribute('isFixed')=='0'){
						// 	return;
						// }
						setStyle(self, {
							position: "static",
							top: 0
						});
						fill(false);
						self.setAttribute('isFixed','0');
						addClz(self,showAllClz);
						removeClz(pNode,'blkCommentBoxFix6');
						cusEvt.fire($,'ce_cmntFormReset');
					}
				}
		}
		var timeout = false;
		addEvt(window,'scroll',function(){
			if(!timeout){
				fix();
				timeout = true;
			}else{
				clearTimeout(timeout);
				setTimeout(function() {
					fix();
				}, 50);
			}

		});

	}

	var cusEvt = $.evt.custEvent;
	cusEvt.add($, 'ce_cmntFirstRenderEnd', function(){
		  	setTimeout(function(){
			    scrollFix();
		  	},2*1000);
		  });
});
/**
 * 弹出快捷回复
 */
SAB.register('job.quickReply',function($){
	function bindReply(){
		var byId = $.dom.byId;
		var cmntlist = $.job.cmntList;
		var addEvt = $.evt.addEvent;

		var wrap = document.getElementsByTagName('body')[0];
		if(!wrap){
			return;
		}

		//事件委派
		var cusEvt = $.evt.custEvent;

		var dldEvt = $.evt.delegatedEvent;
		var dldEvt_comment= dldEvt(wrap);

		//登录模块
		var Login = $.module.login;

		//点击支持
		dldEvt_comment.add('reply','click',function(o){
			var ele = o.el;
			var mid = o.data.mid;
			var newsid = o.data.newsid;
			var channel = o.data.channel;
			var parMid = o.data.parMid||'comment';
			//用自身mid和被回复的mid组合，保证这个form是唯一的,20130424加newsid 20130502 channel
			var form_id = 'J_Comment_Form_'+mid+'_'+parMid+'_'+newsid+'_'+channel;
			var form = byId(form_id);
			var html='<div class="box_border_top_cont"><div class="box_border_top"> <em>◆</em>'
				    +'<span>◆</span>'
				  +'</div></div>'
				  +'<div class="post_box post_box_show">'
				    +'<form class="J_Comment_Form" name="post_form_inline">'
				      +'<div class="post_box_cont clearfix">'
				        +'<textarea  name="content" placeholder="请输入评论内容" class="J_Comment_Content"></textarea>'
				        +'<div class="J_Comment_Tip post_tip" style="display:none;"><p class="post_tip_error">请输入评论内容</p></div>'
				      +'</div>'
				    +'</form>'
				    +'<div class="cmnt_user_cont clearfix">'
				      +'<div class="cmnt-emotion-btns J_Logined"><a class="cmnt-emotion-trigger" href="javascript:;" action-type="face-toggle" action-data="id='+form_id+'"></a></div>'
				      +'<div class="cmnt_name J_Unlogin" style="display:none;">'
				        +'<input class="form_input_long J_Login_User" autocomplete="off" placeholder="微博账号/博客/邮箱" name="user"/></div>'
				      +'<div class="cmnt_password J_Unlogin" style="display:none;">'
				        +'<input type="password" class="form_input_long J_Login_Psw"  autocomplete="off" placeholder="请输入密码" name="pass"/></div>'
				      +'<div class="cmnt_user_link J_Unlogin" style="display:none;">'
				      	// +'<label class="cmnt_remeber" for=""> <input class="J_RemeberMe" type="checkbox" name="remeber" id="" />下次自动登录 </label>'
				      	+'<label class="cmnt_remeber share_wt" action-type="simcheck" action-data="type=remeberme">'
				      	  +'<span class="J_Login_Remeber to_mb to_mb_selected" remeberme="1"></span>'
				      	  +'下次自动登录'
				      	+'</label>'
				      	+'<a class="cmnt_user_login J_Login_Submit" href="javascript:;">登录</a>'
				        // +'<a href="https://login.sina.com.cn/signup/signup.php" suda-uatrack="key=entcomment&value=comment">注册</a>'
				        // +' | '
				        // +'<a href="https://login.sina.com.cn/getpass.html">忘记密码？</a>'
				      +'</div>'
				      +'<div class="cmnt_user_login_info J_Login_Tip" style="display:none">'
				        +'<span class="notice">用户名/密码错误</span>'
				      +'</div>'
				      +'<a class="J_Comment_Submit post_inline_comment post_inline_comment_disbled" href="javascript:;"></a>'
				      +'<div class="cmnt_user_other J_WeiboLogined" style="display:none;">'
				        +'<a class="ccto_link" href="#url">@TA</a>'
				        +'<label class="share_wt J_Comment_ToWeibo_Wrap" action-type="simcheck" action-data="type=toweibo">'
				          +'<span class="to_mb J_Comment_ToWeibo" toweibo="0"></span>'
				          +'分享到微博'
				        +'</label>'
				      +'</div>'
				      +'<div class="cmnt_user J_Logined" style="display:none;">'
				        +'<a target="_blank" href="#url" class="J_Login_Ico">'
				          +'<img src="http://img.t.sinajs.cn/t4/style/images/common/transparent.gif" title="微博" alt="weibo" class="username_icon"></a>'
				        +'<span class="J_Name">用户名</span>'
				        +'&nbsp;|&nbsp;'
				        +'<a class="J_Login_Logout" title="退出登录" onclick="return false;"  href="javascript:;">退出</a>'
				      +'</div>'
				    +'</div>'
				  +'</div>';
			//通过类找到最近的祖先元素
			function getCParent(ele,clz){
				var par = ele.parentNode;
				if($.dom.hasClass(par,clz)){
					return par;
				}else{
					return getCParent(par,clz);
				}
			}
			//楼里回复
			if(o.data.type=='innerReply'){
				var item_dom = getCParent(ele,'orig_cont');
			}
			//楼外回复
			else{
				var item_dom = byId('J_Comment_Item-'+mid);
			}
			//不管有没有form都要重建，因为楼外回复的按钮，被回复一次后，会变成楼里的回复按钮 cmnt-type改变
			if(1){
				var fragment = $.C('div');
				fragment.style.display = 'none';
				fragment.id = form_id;
				fragment.className = 'cmnt_inline_post_box';
				fragment.setAttribute('cmnt-type',o.data.type);
				//innerHTML进来的字符串不能带onclick="****",ie会报错
				fragment.innerHTML = html;
				item_dom.appendChild(fragment);
				if($globalInfo.isWeiboLogin){
					Login.showWeiboLogined(item_dom);
					// cusEvt.fire($, 'ce_weiboLogin');
				}
				if($globalInfo.isLogin){
					Login.showLogined(item_dom);
					// cusEvt.fire($, 'ce_login');
				}else{
					Login.showUnlogined(item_dom);
					// cusEvt.fire($, 'ce_logout');
				}
				form = byId(form_id);
				//新建一个form对象
				var cmntForm = new $.job.cmntForm(form_id);
			}
			//隐藏当前已打开的且不是现在要打开的回复form
			if($globalInfo.curReplyForm!=form_id){
				var curReplyForm = byId($globalInfo.curReplyForm);
				if(curReplyForm){
					curReplyForm.style.display = 'none';
				}
			}
			$globalInfo.curReplyForm = form_id;
			//弹出toggle
			var content = $.dom.byClass('J_Comment_Content',form)[0];
			if(form.style.display!=='none'){
				if(window.jQuery&&!$globalInfo.ua.isIE6){
					jQuery(form).slideUp('fast','linear',function(){
						form.setAttribute('poped','false');
					});
				}else{
					form.style.display = 'none';
					form.setAttribute('poped','false');
				}
			}else{
				if(window.jQuery&&!$globalInfo.ua.isIE6){
					jQuery(form).slideDown('fast','linear',function(){
						form.setAttribute('poped','true');
						content.focus();
					});
				}else{
					form.style.display = '';
					form.setAttribute('poped','true');
					content.focus();
				}


			}
		});
	}
	// bindReply();
	var cusEvt = $.evt.custEvent;
	cusEvt.add($, 'ce_cmntItemFirstRenderEnd', bindReply);
});
/**
 * 加载器，主要用于评论列表的加载
 */

SAB.register('app.dataLoader',function($){
	var DataLoader = function(options) {
		var self = this;
		self.inited = false;
		self.isReflash = true;
		self.options = self._setOptions(options);

	};
	DataLoader.prototype = {
		init : function() {
			this._init();
		},
		_init : function() {
			var self = this;
			/*是否刷新*/
			self.inited = true;
			/*是否正在加载中*/
			self.data = '';
			self.loading = false;
			self.getData();
		},
		/*设置默认设置*/
		_setOptions : function(options) {
			/*默认设置*/
			var defaults = this.defaults = {
				/*数据地址*/
				url : '',
				param : '',
				interval : 0,
				beforeLoad : function() {
				},
				loaded : function(data) {
				},
				error : function(error) {
				}
			};

			return $.clz.extend(defaults, options, true);

		},
		/*获取数据*/
		getData : function() {

			var self = this;
			var opt = self.options;
			var url = opt.url;
			var param = opt.param;
			function intetval(){
				if (opt.interval > 0) {
					self.setTimeout = null;
					self.setTimeout = setTimeout(function() {
								self.getData();
							}, opt.interval);
				}
			}
			function request(){
				$.io.jsload.request(url,{
					GET:param,
					onComplete:function(msg){
						if(typeof msg == 'undefined'){
							return;
						}
						if(msg.result.status.code==0){
							self.data = msg.result;
							opt.loaded(self);
							intetval();
						}else{
							var error = msg.result.status.msg;
							opt.error(error);
							intetval();
						}
						self.loading = false;
					}
				});

			}
			/*判断是否刷新*/
 			if(self.isReflash){
 				self.loading = true;
 				opt.beforeLoad(self);
				request();
 			}else{
 				intetval();
 			}

		},
        /*是否刷新*/
        reflash:function(b){
        	this.isReflash = b;
        }
	};
	return DataLoader;

});
/**
 * 评论列表，包括评论和加载和展示
 */
SAB.register('job.cmntList', function($) {
	//20130422 by wanglei
	var CMNTURL = 'http://comment5.news.sina.com.cn/page/info';

	var info_type = ARTICLE_DATA.info_type;
	var uid = ARTICLE_DATA.user_uid || '';
	var co = sinaSSOController.get51UCCookie();

	//不能查看他人回复记录（当没有登录或者登录后co.uid和ARTICLE_DATA.user_uid不一致时）
	if (info_type == 2) {
		//没有登录 或者 登录有user_uid且uid不一致
		if (!co || (co && uid && uid !== co.uid)) {
			location.href = location.href.replace('info_type=2', 'info_type=1');
		}
	}

	//当未登录info_type不为0且user_uid为空时，跳转到登录页面
	if (info_type != 0 && !co && !uid) {
		location.href = 'http://login.sina.com.cn/signup/signin.php?r=' + encodeURIComponent(location.href);
	}

	if (co) {
		uid = uid || co.uid;
	}
	//更改数据接口
	if (info_type == 1) {
		CMNTURL = 'http://comment5.news.sina.com.cn/user/cmnt?uid=' + uid;
	} else if (info_type == 2) {
		CMNTURL = 'http://comment5.news.sina.com.cn/user/reply?uid=' + uid;
	}
	// var CMNTURL = 'http://comment5.news.sina.com.cn/cmnt/stream';



	var _cmntUtil = $.cmnt.util;
	//格式化时间
	var updateTime = $.app.updateTime;

	var byId = $.dom.byId;

	//自定义事件
	var cusEvt = $.evt.custEvent;

	var TIMEOUT = 10 * 1000;
	var loadTimeout = function() {
		//10秒后还在加载中，或者没数据则为超时
		if ((list.loading || !list.data) && ARTICLE_DATA.newsid != '') {
			try {
				_S_uaTrack("page_comment", "timeout");
			} catch (e) {

			}
		}
	};

	//TODO param部分数据从url获取
	var param = {
		format: 'js',
		channel: ARTICLE_DATA.channel,
		newsid: ARTICLE_DATA.newsid,
		//style=1本来为皮肤，应该为group=1
		group: ARTICLE_DATA.group || ARTICLE_DATA.style,
		compress: 1,
		ie: ARTICLE_DATA.encoding,
		oe: ARTICLE_DATA.encoding,
		page: 1,
		page_size: 100
	};

	var list = new $.app.dataLoader({
		url: CMNTURL,
		param: param,
		listType: 'all',
		beforeLoad: function(self) {
			self.beforeLoad();
		},
		loaded: function(self) {
			list.render();
			list.loaded();
		}
	});
	list.firstRender = true;
	/**
	 * dom节点
	 */
	list.getDom = function() {
		var dom = {
			wrap: byId('J_Comment_List_Wrap'),
			latest: byId('J_Comment_List_Latest'),
			hot: byId('J_Comment_List_Hot'),
			loading: byId('J_Comment_Loading'),
			more_hot: byId('J_Comment_More_Hot'),
			more_latest: byId('J_Comment_More_Latest'),
			end: byId('J_Comment_End')
		};

		return dom;
	};


	/**
	 * 加载前
	 */
	list.beforeLoad = function() {
		var dom = this.dom = this.getDom();
		dom.loading.style.display = '';
		dom.end.style.display = 'none';
	};
	/**
	 * 加载后
	 */
	list.loaded = function() {
		var self = this;
		var dom = this.dom;
		//列表类型，全部？热门？
		var listType = this.options.listType;
		dom.loading.style.display = 'none';
		//渲染结束
		cusEvt.fire($, 'ce_cmntRenderEnd');

		//触发自定义事件
		if (self.firstRender) {
			//定时更新时间
			updateTime(self.dom.wrap);
			cusEvt.fire($, 'ce_cmntFirstRenderEnd');
			self.firstRender = false;
		}
	};
	/**
	 * 渲染评论列表
	 * @return {object} self
	 */
	list.render = function() {
		var self = this;
		var data = self.data;
		var dom = self.dom;
		var opt = self.options;
		var param = self.options.param;
		var listType = opt.listType;
		//本条新闻信息
		self.setNewsData(data);
		//数据总条数 20130422 by wanglei12
		if (typeof data.count == 'undefined') {
			self.totalNum = 0
		} else {
			self.totalNum = self.data.count.show;
		}
		//是否是汇总评论，有的评论是相关的新闻评论汇总一起的，在BBS里，每条评论旁要显示对应的新闻链接
		self.isSummary = (ARTICLE_DATA.isBBS && ARTICLE_DATA.style);
		var isSummary = self.isSummary;
		var newsdict = data.newsdict;
		//渲染开始,要用到data.news
		cusEvt.fire($, 'ce_cmntRenderStart');

		//评论列表
		var cmntlist = data.cmntlist;
		var hotlist = data.hot_list;
		if (cmntlist.length == 0) {
			return;
		}
		//把每次加载进来的评论列表合并起来
		if (self.cList) {
			self.cList = self.cList.concat(cmntlist);
		} else {
			self.cList = cmntlist;
		}
		self.cList = self.cList.concat(hotlist);

		//回复列表
		var replydict = data.replydict;


		//如果列表类型listType为hot只更新hot列表，latest类似，all时全部更新
		if (listType == 'all') {
			var hot_html = _cmntUtil.cmntListRender(hotlist, {
				type:'hot',
				data:data
			});
			var latest_html = _cmntUtil.cmntListRender(cmntlist,{
				type:'latest',
				data:data
			});
			dom.hot.innerHTML = hot_html;
			dom.latest.innerHTML = latest_html;
		} else if (listType == 'latest') {
			var latest_html = _cmntUtil.cmntListRender(cmntlist,{
				type:'latest',
				data:data
			});
			//第一次加载,也就是第一页时，再渲染热门评论和innerHTML时最新评论,否则appenchild加到结尾
			if (param.page == 1) {
				dom.latest.innerHTML = latest_html;
			} else {
				var fragment = $.C('div');
				fragment.innerHTML = latest_html;
				dom.latest.appendChild(fragment);
			}
		} else {
			var hot_html = _cmntUtil.cmntListRender(hotlist,{
				type:'hot',
				data:data
			});
			dom.hot.innerHTML = hot_html;
		}
		//加载完成
		self.loading = false;
		return self;
	};

	/**
	 * 清空列表，一般在更换评论type时，如加载热门评论“hot”前使用
	 * @return {[type]} [description]
	 */
	list.empty = function() {
		this.dom.wrap.innerHTML = '';
		return this;
	};
	list.setNewsData = function(d) {
		// 把数据统一收集在cmnt.data方便取用 20130710
		var _cmntData = $.cmnt.data;
		if(d){
			if (d.news) {
				_cmntData.set('newsdict',[d.news]);
			}
			if(!$.obj.isEmpty(d.newsdict)) {
				// 新闻列表
				_cmntData.set('newsdict',d.newsdict);
			}
			// 评论列表
			_cmntData.set('cmntlist',d.cmntlist);
			// 热门评论列表
			if(d.hot_list){
				_cmntData.set('cmntlist',d.hot_list);
			}
			// 回复列表
			_cmntData.set('replydict',d.replydict);
		}
		if (d) {
			if (d.news) {
				$globalInfo.news = d.news;
			}
			if (!$.obj.isEmpty(d.newsdict)) {
				$globalInfo.newsdict = d.newsdict;
			}
		}
		return this;
	};
	/**
	 * 设置页面，为下次加载数据做准备
	 * @param {Number} i 要设置的页数
	 */
	list.setPage = function(i) {
		if (i < 1) {
			return this;
		}
		this.options.param.page = i;
		return this;
	};
	/**
	 * 设置评论类型，为下次加载数据做准备,
	 * @param {String} t all||hot 全部评论或热门评论
	 */
	list.setType = function(t) {
		//all全部，hot最热
		if (t != 'all' && t != 'hot' && t != 'latest') {
			return;
		}
		this.options.listType = t;
		return this;
	};
	var cmntlistInit = function() {
		setTimeout(function() {
			loadTimeout();
		}, TIMEOUT);
		list.init();
		try {
			_S_uaTrack("entcomment", "pageview");
		} catch (e) {

		}
	};
	cusEvt.add($, 'ce_cmntHtmlInit', cmntlistInit);
	return list;
});
/**
 * 记住自动登录
 */
SAB.register('job.cmntSimChkbox',function($){
	var inited = false;
	function remeber(){
		if(inited){
			return;
		}
		var wrap = document.getElementsByTagName('body')[0];
		if(!wrap){
			return;
		}
		var addClass = $.dom.addClass;
		var removeClass = $.dom.removeClass;
		var selectClass = 'to_mb_selected';
		//事件委派
		var dldEvt = $.evt.delegatedEvent;
		var dldEvt_comment= dldEvt(wrap);

		//点击支持
		dldEvt_comment.add('simcheck','click',function(o){
			var ele = o.el;
			var type = o.data.type;
			var chkbox = ele.getElementsByTagName('span')[0];
			var checked = chkbox.getAttribute(type)=='0'?1:0;
			if(checked){
				addClass(chkbox,selectClass);
			}else{
				removeClass(chkbox,selectClass);
			}
			chkbox.setAttribute(type,checked);
		});
		inited = true;
	}
	var cusEvt = $.evt.custEvent;
	cusEvt.add($, 'ce_cmntHtmlInit', remeber);
	cusEvt.add($, 'ce_cmntItemFirstRenderEnd', remeber);
});
/**
 * 整个评论HTML的初始化
 */
SAB.register('job.cmntStructure',function($){
	var render  = function(){
		var temp = [];
		var iDiv = function(s){
			temp.push(s);
		};
		//根据设置添加css
    	var loadStyle = function(s,id) {
    		var doc = document;
			var sDom = doc.createElement("style");
			sDom.id = id;
			sDom.type = "text/css";
			sDom.styleSheet ? sDom.styleSheet.cssText = s : sDom.appendChild(doc.createTextNode(s));
			doc.getElementsByTagName("head")[0].appendChild(sDom);
			return sDom;
		};
		var newStyle = [];
		// 如果隐藏头像 内容宽度得修正
		var headWidth = 62;
		var fixWidth = 0;
		if(ARTICLE_DATA.hideHead){
			fixWidth += headWidth;
		}
		if(ARTICLE_DATA.width){
			var width = ARTICLE_DATA.width;
			newStyle.push('.blkContainerCommentblk,.Mblk_cmnt{width:'+width+'px}');
			newStyle.push('.Mblk_cmnt .comment_loading span,.Mblk_cmnt .comment_tip span{width:'+(width-40)+'px!important;}');
			newStyle.push('.Mblk_cmnt .t_txt{width:'+(width-113+fixWidth)+'px!important;}');
			newStyle.push('.Mblk_cmnt .comment_item_cont .t_content{width:'+(width-110+fixWidth)+'px!important;}');
			newStyle.push('.Mblk_cmnt .post_box textarea{width:'+(width-72)+'px!important;}');
			newStyle.push('.Mblk_cmnt .post_box_top{width:'+(width-30)+'px!important;}');
			newStyle.push('.Mblk_cmnt .post_box_showall textarea {width:'+(width-56)+'px!important;}');
			newStyle.push('.Mblk_cmnt .post_box_show textarea {width:'+(width-56)+'px!important;}');
		}
		if(ARTICLE_DATA.replyTextAreaWidth&&ARTICLE_DATA.replyTextAreaWidth.indexOf('%')!==-1){
			newStyle.push('.orig_cont .post_box_show textarea{ width:'+ARTICLE_DATA.replyTextAreaWidth+'!important;;}');
		}
		if(ARTICLE_DATA.cmntFixOffsetX){
			newStyle.push('div.blkCommentBoxFix .post_box_top{margin-left:'+ARTICLE_DATA.cmntFixOffsetX+'px !important;}');
		}
		if(ARTICLE_DATA.hideFaces){
			newStyle.push('.cmnt-emotion-btns{display:none !important;}');
		}
		if(ARTICLE_DATA.inputWidth){
			newStyle.push('.blkContainerCommentblk .form_input_long{width:'+ARTICLE_DATA.inputWidth+'px !important;}');
		}
		if(ARTICLE_DATA.hideCount){
			newStyle.push('.Mblk_cmnt .post_box_count{display:none !important;}');
		}

		loadStyle(newStyle.join(''),'J_Comment_CustomStyle');

		//论坛里的评论数不带链接
		var isBBS = ARTICLE_DATA.isBBS;
		var faces = ARTICLE_DATA.commonFaces;
		var facesHtml = [];
		for (var j in faces) {
			facesHtml.push('<a href="javascript:void(0)" action-type="face-insert" action-data="input=J_Comment_Form_B&text=['+j+']" title="'+j+'"><img src="'+ARTICLE_DATA.commonFacesBase+faces[j]+'.gif" alt="" /></a> ');
		};
		//体育彩票提示 start
		iDiv('<div id="J_Comment_CP_Tip" class="comment_tip_o" style="display:none;"> <p>新浪警示：任何收费预测彩票会员等广告皆为诈骗，请勿上当！<a href="http://sports.sina.com.cn/l/2012-07-31/11376158457.shtml" target="_blank">点击进入详情</a></p> </div>');
		//体育彩票提示 end
		iDiv('<div class="Mblk_cmnt blkCommentBox" style="position: relative; ">');
		  iDiv('<!-- 浮动评论框 -->');
		  //@王磊
		  var is_show_form = ""
	  		if(ARTICLE_DATA.info_type==1 || ARTICLE_DATA.info_type==2){
	  			is_show_form='style="display:none"'
	  		}
	  		  iDiv('<div class="post_box post_box_top post_box_showall" '+is_show_form+' id="J_Comment_Form_B" cmnt-type="comment" isfixed="0" style="position: static; left: 0px; margin-left: 0px; top: 0px; ">');
	  		  	//评论数1，只保留评论框上一个评论数
		  	iDiv('<p id="J_Post_Box_Count" class="post_box_count">'+(isBBS?'<span rel="欢迎发表评论" class="more J_Comment_Count_Txt" style="display:none;">欢迎发表评论</span>':'<a href="#J_Comment_Wrap" rel="欢迎发表评论" class="more J_Comment_Count_Txt" style="display:none;">欢迎发表评论</a>')+'</p>');

		    // iDiv('<form id="post_form_inline" name="post_form_inline">');
		      iDiv('<div class="post_box_cont clearfix">');
		        iDiv('<textarea class="J_Comment_Content" placeholder="'+ARTICLE_DATA.postPlaceholder+'" name="content">'+ARTICLE_DATA.postContent+'</textarea>');
		        iDiv('<div class="J_Comment_Tip post_tip" style="display:none;">');
		          iDiv('<p class="post_tip_error">请输入评论内容</p>');
		        iDiv('</div>');
		      iDiv('</div>');
		    // iDiv('</form>');
		    iDiv('<div class="cmnt_user_cont clearfix">');
		      iDiv('<div class="cmnt-emotion-btns J_Logined" style="display:none;">');
		        iDiv('<a class="cmnt-emotion-trigger" href="javascript:;" action-type="face-toggle" action-data="id=J_Comment_Form_B"></a>');
		        iDiv('<span>');
		          iDiv(facesHtml.join(''));
		        iDiv('</span></div>');
		        iDiv('<div class="cmnt_name J_Unlogin" style="display: none; ">');
		          iDiv('<input name="user" autocomplete="off" placeholder="微博账号/博客/邮箱" class="form_input_long  J_Login_User"></div>');
		        iDiv('<div class="cmnt_password J_Unlogin" style="display: none; ">');
		          iDiv('<input type="password" name="psw" class="form_input_long J_Login_Psw" placeholder="请输入密码"></div>');
		        iDiv('<div class="cmnt_user_link J_Unlogin" style="display: none; ">');
		        // iDiv('<label class="cmnt_remeber" for="" action-type="remeberme"><input class="J_RemeberMe" type="checkbox" name="remeber" id="" />下次自动登录</label>');
		        iDiv('<label class="cmnt_remeber share_wt" action-type="simcheck" action-data="type=remeberme">');
		          iDiv('<span class="J_Login_Remeber to_mb to_mb_selected" remeberme="1"></span>');
		          iDiv('下次自动登录');
		        iDiv('</label>');
		        iDiv('<a class="cmnt_user_login J_Login_Submit" href="javascript:;">登录</a>');
		        iDiv('<a href="https://login.sina.com.cn/signup/signup.php" onclick="try{if(window._S_uaTrack){_S_uaTrack(\'entcomment\', \'logon\');}}catch(e){}">注册</a>');
		        iDiv(' | ');
		        iDiv('<a href="https://login.sina.com.cn/getpass.html">忘记密码？</a>');
		      iDiv('</div>');
		      iDiv('<div class="cmnt_user_login_info J_Login_Tip" style="display:none;">');
		        iDiv('<span class="notice">用户名/密码错误</span>');
		      iDiv('</div>');
		      iDiv('<a href="javascript:;" onclick="return false;" class="J_Comment_Submit post_inline_comment post_inline_comment_disbled">发布</a>');
		      iDiv('<div class="cmnt_user_other J_WeiboLogined" style="display:none;">');
		        iDiv('<a href="#url" class="ccto_link">@TA</a>');
		        iDiv('<label class="share_wt J_Comment_ToWeibo_Wrap" action-type="simcheck" action-data="type=toweibo">');
		          iDiv('<span class="to_mb J_Comment_ToWeibo" toweibo="0"></span>');
		          iDiv('分享到微博');
		        iDiv('</label>');
		      iDiv('</div>');
		      iDiv('<div class="cmnt_user J_Logined" style="display:none;">');
		        iDiv('<a class="J_Login_Ico" href="http://weibo.com" target="_blank">');
		          iDiv('<img src="http://img.t.sinajs.cn/t4/style/images/common/transparent.gif" title="微博" alt="weibo" class="weibo_icon">');
		        iDiv('</a>');
		          iDiv('<span class="J_Name">');
		            iDiv('<a href="http://weibo.com" target="_blank">用户名</a>');
		          iDiv('</span>');
		          iDiv(' | ');
		          iDiv('<a class="J_Login_Logout" href="javascript:;" onclick="return false;" title="退出登录">退出</a>');
		        iDiv('</div>');
		    iDiv('</div>');
		  iDiv('</div>');
		  iDiv('<!-- /浮动评论框 -->');
		  iDiv('<div class="b_cont2" id="J_Comment_List_Wrap" style="display:none;">');
		    iDiv('<div id="J_Comment_Tip" class="comment_item comment_tip" style="display:none;">');
		      iDiv('<span>还没有评论</span>');
		    iDiv('</div>');
		    iDiv('<div id="J_Comment_Wrap_Hot" style="display:none;">');
			    iDiv('<div class="c_title">');
			      //评论数2
			      // iDiv(isBBS?'<span rel="欢迎发表评论" class="more J_Comment_Count_Txt" style=""></span>':'<a href="" rel="欢迎发表评论" class="more J_Comment_Count_Txt" style="" suda-uatrack="key=entcomment&value=total"></a>');

			      iDiv('<span class="cmenu">最热评论</span>');
			      iDiv('<a href="javascript:;" onclick="return false;" class="cmnt-reflash-btn" action-type="reload" action-data="type=Hot">刷新</a>');
			    iDiv('</div>');

			    iDiv('<div class="b_txt" id="J_Comment_List_Hot">');
			    iDiv('</div>');
			    iDiv('<div id="J_Comment_More_Hot" class="comment_item comment_more" action-type="getmore" action-data="type=hot" style="display:none; ">');
			      iDiv('<a href="javascript:;" onclick="return false;">显示更多热评</a>');
			    iDiv('</div>');
			iDiv('</div>');
			iDiv('<div id="J_Comment_Wrap_Latest" style="display:none;">');
			if(!(ARTICLE_DATA.info_type==1 || ARTICLE_DATA.info_type==2)){
				iDiv('<div class="c_title">');
				  //评论数3
				  // iDiv(isBBS?'<span rel="欢迎发表评论" class="more J_Comment_Count_Txt" style=""></span>':'<a href="" rel="欢迎发表评论" class="more J_Comment_Count_Txt" style="" suda-uatrack="key=entcomment&value=total"></a>');

				  iDiv('<span class="cmenu">最新评论</span>');
				  iDiv('<a href="javascript:;" onclick="return false;" class="cmnt-reflash-btn" action-type="reload" action-data="type=Latest">刷新</a>');
				iDiv('</div>');
			}
			    iDiv('<div class="b_txt" id="J_Comment_List_Latest">');
			    iDiv('</div>');
			    iDiv('<div id="J_Comment_More_Latest" class="comment_item comment_more" action-type="getmore" action-data="type=latest" style="display:none; ">');
			    var latestTip = '点击加载更多评论';
			    if(ARTICLE_DATA.scrollLoad){
			    	latestTip = '滚动加载更多评论';
			    }
			      iDiv('<a href="javascript:;" onclick="return false;">'+latestTip+'</a>');
			    iDiv('</div>');
			iDiv('</div>');
		    iDiv('<div id="J_Comment_Loading" class="comment_item comment_loading" style="display:none; ">');
		      iDiv('<span>');
		        iDiv('<img src="http://i3.sinaimg.cn/ent/deco/2012/0912/images/indicator_24.gif" height="24" width="24" alt="" style="vertical-align:middle;">评论加载中，请稍候...</span>');
		    iDiv('</div>');

		    iDiv('<div id="J_Comment_End" class="comment_item comment_more" style="display: none; ">');
		      //评论结束提示
		      iDiv(isBBS?'<span>已到最后一页</span>':'<a href="javascript:;" target="_blank">查看更多精彩评论&gt;&gt;</a>');

		    iDiv('</div>');

		  iDiv('</div>');
		  iDiv('<div class="Mblk_cmnt_bg"></div>');
		iDiv('</div>');
		var wrap = $.dom.byId('J_Comment_Wrap');
		if(wrap){
			wrap.innerHTML = temp.join('');
			return wrap;
		}else{
			return null;
		}
	};
	var cusEvt = $.evt.custEvent;
	//评论框和列表wrap结构渲染完成
	$.dom.ready(function(){
		if(render()){
			cusEvt.fire($,'ce_cmntHtmlInit');
			if($globalInfo.isWeiboLogin){
				cusEvt.fire($, 'ce_weiboLogin');
			}
			if($globalInfo.isLogin){
				cusEvt.fire($, 'ce_login');
			}else{
				cusEvt.fire($, 'ce_logout');
			}
		}
	});

});
/**
 * 是否自动登录 默认ARTICLE_DATA.autoLogin为false不自动登录，需要在页面调用SAB.app.autoLogin
 */
SAB.register('job.autoLogin',function($){
	if(!ARTICLE_DATA.autoLogin){
		return;
	}
	$.app.autoLogin();
	$.dom.ready(function(){
	  $.app.autoLogin();
	  var autologinTimeOut = setInterval(function(){
	    $.app.autoLogin();
	  },ARTICLE_DATA.autoLoginInterval);
	});
});

/**
 * 文件尾 标识此文件已经加载执行过
 */
if($globalInfo.SABLoaded){
	SAB.register = SAB._register;
}
$globalInfo.SABLoaded = true;

