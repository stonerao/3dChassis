var _Utils = {
	/**
	 * [detector 检测是否支持webgl]
	 * @Author   RAOYAN
	 * @DateTime 2019-8-26 17:59:14
	 * @return   {[Boolean]}   [true-支持、false-不支持]
	 */
	detector: function () {
		try {
			return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
		} catch (e) {
			return false;
		}
	},
	creatError: function (conts, errorText) {
		var error = $('<div class="data-error"></div>'),
			error_text = errorText || '数据错误。。。';
		if (undefined != conts) {
			var ctxt = "color:#fff;position:absolute;top:49%;width:100%;text-align:center;";
			error.css("cssText", ctxt);
			conts.html(error.html(error_text));
		}
	},
	creatContainer: function (id) {
		var containers = $('<div></div>');
		containers.css("cssText", "height:100%;width:100%;overflow:hidden;position:relative;");
		containers.attr('id', id);
		return containers;
	},
	toFunction: function (callback) {
		return function () { }
	},
	cloneJSON(j) {
		try {
			return JSON.parse(JSON.stringify(j))
		} catch (err) {
			return {}
		}
	},
	color: function (c) {
		return new THREE.Color(c);
	},
	//- analysis color
	getColorArr: function (str) {
		if (Array.isArray(str)) return str; //error
		var _arr = [];
		str = str + '';
		str = str.toLowerCase().replace(/\s/g, "");
		if (/^((?:rgba)?)\(\s*([^\)]*)/.test(str)) {
			var arr = str.replace(/rgba\(|\)/gi, '').split(',');
			var hex = [
				pad2(Math.round(arr[0] * 1 || 0).toString(16)),
				pad2(Math.round(arr[1] * 1 || 0).toString(16)),
				pad2(Math.round(arr[2] * 1 || 0).toString(16))
			];
			_arr[0] = _Utils.color('#' + hex.join(""));
			_arr[1] = Math.max(0, Math.min(1, (arr[3] * 1 || 0)));
		} else if ('transparent' === str) {
			_arr[0] = _Utils.color();
			_arr[1] = 0;
		} else {
			_arr[0] = _Utils.color(str);
			_arr[1] = 1;
		}

		function pad2(c) {
			return c.length == 1 ? '0' + c : '' + c;
		}
		return _arr;
	},
	setParms(_df, _cur) {
		let obj = _df;
		for (let key in obj) {
			if (_cur.hasOwnProperty(key)) {
				obj[key] = _cur[key]
			}
		}
		return obj
	},
	/**
	 * [getPoints 根据两点距离生成线段 线段的长度为两点之间的距离 dpi为当前比例  约高线段越多 越低线段越少]
	 * @Author   RAOYN
	 * @DateTime 2019-09-21
	 * @param    {Object}   src [起点]
	 * @param    {Object}   dst [终点]
	 * @param    {Number}   dpi [分辨率]
	 * @param    {Number}   len [长度]
	 * @return   {[type]}       [所有线段]
	 */
	getPoints(src, dst, dpi = 1, len) {
		if (!len) {
			len = parseInt(src.distanceTo(dst));
		}

		len = len * dpi;
		let items = [];
		for (let i = 0; i < len; i++) {
			items.push(src.clone().lerp(dst, i / len))
		}
		items.push(dst)
		return items
	},
	/**
	 * [parseNumber 转换为数值  如果转换后为NaN  转换为0]
	 * @Author   RAOYN
	 * @DateTime 2019-09-23
	 * @param    {any}	   src  [值] 
	 * @return   {Number}       [数值]
	 */
	parseNumber(val) {
		const n = parseFloat(val);
		return isNaN(n) ? 0 : n;
	},
	/**
     * [drawCircle 绘制一个圆形 根据个数平均返回圆上的点 用于生成外圈的cube]
     * @Author   RAOYN
     * @DateTime 2019-09-06
     * @param    {Array}   dot    [坐标中心点]
     * @param    {Number}   r     [半径]
     * @param    {Number}   Ratio [比例 椭圆]
     * @param    {Number}   len   [生成个数]
     * @return   {Array}          [返回已生成好的数组个数]
     */
	drawCircle(dot, r, Ratio, len) {
        let pstart = [dot[0] + r, dot[1]]; //起点
        let pre = pstart;
        let total = 360
        let arr = [];
        for (let i = 0; i < 360; i += total / len) {
            let rad = i * Math.PI / 180 + Math.PI / 1.9;
            let cur = [r * Math.cos(rad) + dot[0], Ratio * r * Math.sin(rad) + dot[1]];
            pre = cur; //保存当前点的坐标 
            arr.push({
                pre,
                rad
            })
        }
        return arr
    },
    /**
     * [getCurveLine 绘制线条]
     * @Author   RAOYN
     * @DateTime 2019-10-17
     * @param    {[type]}   src   [起点]
     * @param    {[type]}   dst   [终点]
     * @param    {[type]}   curve [弯曲程度 0 - ]
     * @return   {[type]}         [顶点数组]
     */
    getCurveLine(src,dst,curve){

    }
}