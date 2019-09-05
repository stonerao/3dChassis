var _Utils = {
	/**
	 * [detector 检测是否支持webgl]
	 * @Author   RAOYAN
	 * @DateTime 2019-8-26 17:59:14
	 * @return   {[Boolean]}   [true-支持、false-不支持]
	 */
	detector: function() {
		try {
			return !!window.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl');
		} catch (e) {
			return false;
		}
	},
	creatError: function(conts, errorText) {
		var error = $('<div class="data-error"></div>'),
			error_text = errorText || '数据错误。。。';
		if (undefined != conts) {
			var ctxt = "color:#fff;position:absolute;top:49%;width:100%;text-align:center;";
			error.css("cssText", ctxt);
			conts.html(error.html(error_text));
		}
	},
	creatContainer: function(id) {
		var containers = $('<div></div>');
		containers.css("cssText", "height:100%;width:100%;overflow:hidden;position:relative;");
		containers.attr('id', id);
		return containers;
	},
	toFunction: function(callback) {
		return function() {}
	},
	cloneJSON(j) {
		try {
			return JSON.parse(JSON.stringify(j))
		} catch (err) {
			return {}
		}
	},
	color: function(c) {
		return new THREE.Color(c);
	},
	//- analysis color
	getColorArr: function(str) {
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
}