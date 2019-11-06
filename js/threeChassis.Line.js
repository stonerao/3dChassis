/**
 * [initLine 创建连线]
 * @Author   RAOYN
 * @DateTime 2019-10-17
 * @param    {[type]}   layers [图层]
 * @return   {[type]}          [description]
 */
function initLine(layers) {
	//geometry
	let geometry = new THREE.BufferGeometry();
	/**
	 * [createLine 初始线条]
	 * @Author   RAOYN
	 * @DateTime 2019-10-17
	 * @param    {Array}    position         [线段数以及坐标]
	 * @param    {String}   opt.type         [类型 solid dashed]
	 * @param    {String}   opt.curve        [线条弯曲段 0 - 100 越高越弯曲]
	 * @param    {Number}   opt.centerRadius [半径]
	 * @param    {String}   opt.color        [颜色]
	 * @return   {[type]}                    [description]
	 */
	this.init = function(position = [], {
		type = "solid",
		centerRadius = 0,
		color = "rgba(255,255,255,1)",
		curve = 0
	} = opt) {
		//材质
		let colorArr = _Utils.getColorArr(color);
		let material = null;
		let materialBasic = {
			color: colorArr[0],
			transparent: true,
			opacity: colorArr[1],
			depthTest: true,
			linewidth: 1,
		}

		switch (type) {
			case "solid":
				material = new THREE.LineBasicMaterial(materialBasic)
				break; 
			case "dashed":
				material = new THREE.LineDashedMaterial({
					...materialBasic,
					scale: 1,
					dashSize: 3,
					gapSize: 1,
				});
		break;
	}
	 
	let positions = []; //顶点
	position.forEach(function(elem, index) {
		//.pre [x,y] 坐标 rad 弧度  
		let vec3 = new THREE.Vector3(elem.pre[0], 0, elem.pre[1]);
		vec3 = vec3.setLength(centerRadius);
		//起始
		positions[index * 6] = vec3.x;
		positions[index * 6 + 1] = vec3.y;
		positions[index * 6 + 2] = vec3.z;
		//结束
		positions[index * 6 + 3] = elem.pre[0];
		positions[index * 6 + 4] = 0;
		positions[index * 6 + 5] = elem.pre[1];
	})
	geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	let line = new THREE.LineSegments(geometry, material);
	//绘制虚线
	if (line.computeLineDistances && type == "dashed") {
		line.computeLineDistances()
	}
	line.position.y = 0.5;
	layers.add(line);
}
}