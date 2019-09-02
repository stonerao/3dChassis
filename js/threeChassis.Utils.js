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
	}
}