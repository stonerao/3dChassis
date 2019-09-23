var initCube = function(layou) {
	let option = {
		width: 65, //魔方宽度
		outer: {
			gap: 6,
			cColor: "rgba(74,167,235,0.2)", //canvas 颜色
			cBorderColor: '#448ff4', //canvas 边框颜色
			cSize: 512, //生成图片大小 2的N次方
			color: "#ffffff", //平面几何
		}, //外平面属性
		inside: {
			gap: 6,
			cColor: [{
				color: "#70ceff",
				index: 1,
			}, {
				color: "#70ceff",
				index: 0.999,
			}, {
				color: "#02347a",
				index: 0,
			}],
			cBorderColor: "rgba(255,255,255,1)",
			cSize: 512,
		}, //内平面属性
		chassisColor: "rgba(30,83,148,1)",
		borderColor: "rgba(66,190,228,1)",
		arue: {
			rotation: [{
				rotation: [Math.PI / 2, 0.3]
			}, {
				rotation: [-Math.PI / 2, 0.3]
			}],
			radius: 65,
		}, //圆参数
	}
	let width = option.width || 50;
	let layoutGroup = new THREE.Group();
	let outerOption = option.outer || {};
	let insideOption = option.inside || {};
	let arueOption = option.arue || {};

	/**
	 * [init 开始创建]
	 * @Author   RAOYN
	 * @DateTime 2019-09-10 
	 */
	function init() {
		let planeGroup = new THREE.Group();
		layoutGroup.add(planeGroup);
		//平面
		addOuterPlane(width, planeGroup, outerOption, insideOption);
		//圆 
	/*	let arueRadius = arueOption.radius;
		let points = arueOption.rotation.map(function(elem) {
			return addArue(arueRadius, layoutGroup, elem);
		}) 
		*/
		planeGroup.rotation.x = 0.78;
		planeGroup.rotation.y = 0.59;
		planeGroup.rotation.z = -1.3;
		planeGroup.position.y = width;
		/* 	planeGroup.position.x = -5;
			planeGroup.position.z = 10; */
		return {
			layou: layoutGroup,
			// point: points
		}
	}
	/**
	 * [addArue 创建圆]
	 * @Author   RAOYN
	 * @DateTime 2019-09-10
	 * @param    {[type]}   radius [半径]
	 */
	function addArue(radius, group, option) {
		let rotation = option.rotation;
		/*let g = new THREE.Group();
		group.add(g);*/
		var curve = new THREE.EllipseCurve(
			0, 0, // ax, aY
			radius, radius, // xRadius, yRadius
			0, 2 * Math.PI, // aStartAngle, aEndAngle
			false, // aClockwise
			0 // aRotation
		);

		var points = curve.getPoints(400);
		var geometry = new THREE.BufferGeometry().setFromPoints(points);

		var material = new THREE.LineBasicMaterial({
			color: new THREE.Color("rgb(50,123,232)"),
			depthTest: false,
			transparent: true
		});

		// Create the final object to add to the scene
		var ellipse = new THREE.Line(geometry, material);

		ellipse.rotation.x = rotation[0];
		ellipse.rotation.y = rotation[1];
		ellipse.position.y = radius / 1.2;
		group.add(ellipse);


		//添加光点
		let pointMap = new THREE.TextureLoader().load(_Assets.point);
		var geometry = new THREE.BufferGeometry();
		let pointMaterial = new THREE.PointsMaterial({
			size: 15,
			map: pointMap,
			blending: THREE.AdditiveBlending,
			sizeAttenuation: false,
			depthTest: false,
			transparent: true,

		});
		/* let pointMaterial = new THREE.PointsMaterial({
			size: 15,
			map: pointMap,
			blending: THREE.AdditiveBlending,
			depthTest: true,
			transparent: true
		}); */
		let src = points[0];
		geometry.addAttribute('position', new THREE.Float32BufferAttribute([src.x, src.y, 0], 3));

		var particles = new THREE.Points(geometry, pointMaterial);
		particles.userData = {
			index: 0,
			point: points
		}
		ellipse.add(particles);


		let patW = radius * 2;
		let pat = addPlaneArue(points, patW * 2);
		var patmaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			side: THREE.DoubleSide,
			transparent: true,
			depthTest: false,
			opacity: 1,
			map: pat 
		});
		var pgeometry = new THREE.PlaneGeometry(patW, patW, 2);
		var pata = new THREE.Mesh(pgeometry, patmaterial);
		ellipse.add(pata)
		// pata.position.z = -50;
		return particles
	}

	//添加平面圆
	function addPlaneArue(points, radius) {
		let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
		radnius = getPowNumber(radius);
		canvas.width = radius * 2;
		canvas.height = radius * 2;
		let ctx = canvas.getContext("2d");
		ctx.beginPath();
		//圆角矩形
		let lw = 5;
		let width = radius;
		ctx.beginPath();

		//绘制扇形
		ctx.arc(width, width, width, 0, 2 * Math.PI);
		ctx.strokeStyle = "rgba(50,123,232,1)";
		ctx.lineWidth = 2;
		ctx.stroke();
		var grd = ctx.createRadialGradient(width, width, 2, width, width, width);
		grd.addColorStop(1, "rgba(12,59,147,0.5)");
		grd.addColorStop(0.99, "rgba(12,59,147,0.2)");
		grd.addColorStop(0, "rgba(12,59,147,0.1)");
		//填充扇形
		ctx.fillStyle = grd;
		ctx.fill();
		let _texture = new THREE.Texture(canvas);
		_texture.needsUpdate = true;
		return _texture
	}
	/**
	 * [addLattice 创建九宫格]
	 * @Author   RAOYN
	 * @DateTime 2019-09-10
	 * @param    {[type]}   width [总宽度]
	 * @return 	 {Group}		  [当前平面组]
	 */
	function addLattice(width, textur) {

		var material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			side: THREE.BackSide,
			transparent: true,
			depthTest: true,
			// depthWrite: false,
			opacity: 1,
			map: textur,
			// blending: THREE.AdditiveBlending
		});
		let row = 3;
		let col = 3;
		let gap = 2;
		let pWidth = (width - gap * (row - 1)) / 3;
		let group = new THREE.Group();
		var geometry = new THREE.PlaneGeometry(width, width, 2);
		/*for (let i = 0; i < row; i++) {
			for (j = 0; j < col; j++) {
				
				console.log(i * pWidth + i * group, j * pWidth + j * group, 0)
				plane.position.set(i * pWidth + i * gap - width / 2 + pWidth / 2, j * pWidth + j * gap - width / 2 + pWidth / 2, 5);
			
			}
		}*/
		var plane = new THREE.Mesh(geometry, material);
		plane.position.z = 4.5;
		group.add(plane);
		return group;
	}
	/**
	 * [addOuterPlane 创建最外圈平面]
	 * @Author   RAOYN
	 * @DateTime 2019-09-10
	 * @param    {[type]}   width 		  [平面宽度]
	 * @param    {[type]}   goup 		  [group图层]
	 * @param    {[type]}   outerOption   [外层参数]
	 * @param    {[type]}   insideOption  [内层参数]
	 */
	function addOuterPlane(width, goup, outerOption, insideOption) {
		let outer = outerOption;
		let inside = insideOption;
		let radius = width / 2;
		let radiusGl = width / 2 + outerOption.gap || 6;
		let planeArr = [
			[radiusGl, 0, 0],
			[-radiusGl, 0, 0],
			[0, radiusGl, 0],
			[0, -radiusGl, 0],
			[0, 0, radiusGl],
			[0, 0, -radiusGl]
		]

		let textur = createPlaneMap(outer.cSize, outer.cColor, outer.cBorderColor);
		let ChildTextur = createLatticeMap(512, inside.cColor, inside.cBorderColor);
		let colorArr = _Utils.getColorArr(outer.color);
		for (let i = 0; i < planeArr.length; i++) {
			var e = planeArr[i];
			var geometry = new THREE.PlaneGeometry(width, width, 2);
			var material = new THREE.MeshBasicMaterial({
				color: colorArr[0],
				side: THREE.BackSide,
				transparent: true,
				depthTest: false,
				depthWrite: false, 
				opacity: colorArr[1],
				map: textur,
				// blending:THREE.AdditiveBlending
			});
			var plane = new THREE.Mesh(geometry, material);
			plane.position.set(e[0], e[1], e[2]);
			goup.add(plane);
			plane.lookAt(new THREE.Vector3(0, 0, 0));
			//添加当前面的九宫格
			let LatticeGroup = addLattice(width, ChildTextur)
			plane.add(LatticeGroup);
		}


	}

	function addArueCanvas(width, PI) {
		let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
		radnius = getPowNumber(width);
		canvas.width = width;
		canvas.height = width;
		ctx.ellipse(400, 400, 300, 200, 0, 0, Math.PI * 2);
		ctx.fillStyle = "#058";
		ctx.strokeStyle = "#000";
		ctx.fill();
		ctx.stroke();
	}
	/**
	 * [createLatticeMap 九宫格面贴图]
	 * @Author   RAOYN
	 * @DateTime 2019-09-10
	 * @param    {[type]}   width       [长款]
	 * @param    {[type]}   color       [颜色]
	 * @param    {[type]}   borderColor [边框颜色]
	 * @return   {[type]}               [贴图Map]
	 */
	function createLatticeMap(width, color = [], borderColor) {
		let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
		radnius = getPowNumber(width);
		canvas.width = width;
		canvas.height = width;
		let ctx = canvas.getContext("2d");
		ctx.beginPath();
		let radius = 12;
		let lw = 5;
		let row = 4;
		let col = 4;
		let gap = 10;
		let pWidth = (width - gap * (row - 1)) / 3;
		for (let i = 0; i < row; i++) {
			for (let j = 0; j < col; j++) {
				let x = i * pWidth + i * gap;
				let y = j * pWidth + j * gap;
				//线条
				strokeRoundRect(ctx, x, y, pWidth, pWidth, radius, lw, borderColor);
				var grd = ctx.createRadialGradient(pWidth / 2, pWidth / 2, 18, pWidth / 2, pWidth / 2, pWidth);
				for (let i = 0; i < color.length; i++) {
					grd.addColorStop(color[i].index, color[i].color);
				}
				//填充中心
				fillRoundRect(ctx, x + lw / 2, y + lw / 2, pWidth - lw, pWidth - lw, radius, grd);
			}
		}
		let _texture = new THREE.Texture(canvas);
		_texture.needsUpdate = true;
		return _texture
	}

	function createPlaneMap(width, color, borderColor) {
		let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
		radnius = getPowNumber(width);
		canvas.width = width;
		canvas.height = width;
		let ctx = canvas.getContext("2d");
		ctx.beginPath();
		let radius = 24;
		let lw = 7;
		strokeRoundRect(ctx, 0, 0, width, width, radius, lw, borderColor);
		fillRoundRect(ctx, 0, 0, width, width, radius, color);

		/*strokeRoundRect(ctx, position, position, position, position, 10);
		//绘制并填充一个圆角矩形  
		fillRoundRect(ctx, position, position, position, position, 10, 'rgba(0,0,0,0.7)')*/
		let _texture = new THREE.Texture(canvas);
		_texture.needsUpdate = true;
		return _texture
	}


	function strokeRoundRect(ctx, x, y, width, height, radius, lineWidth, strokeColor) {
		//圆的直径必然要小于矩形的宽高     
		if (2 * radius > width || 2 * radius > height) {
			return false;
		}
		ctx.save();
		ctx.translate(x, y);
		//绘制圆角矩形的各个边  
		drawRoundRectPath(ctx, width, height, radius);
		ctx.lineWidth = lineWidth || 2; //若是给定了值就用给定的值否则给予默认值2  
		ctx.strokeStyle = strokeColor;
		ctx.stroke();
		ctx.restore();
	}

	function fillRoundRect(ctx, x, y, width, height, radius, /*optional*/ fillColor) {
		//圆的直径必然要小于矩形的宽高          
		if (2 * radius > width || 2 * radius > height) {
			return false;
		}

		ctx.save();
		ctx.translate(x, y);
		//绘制圆角矩形的各个边   
		drawRoundRectPath(ctx, width, height, radius);
		ctx.fillStyle = fillColor || "#fff"; //若是给定了值就用给定的值否则给予默认值  
		ctx.fillRect(0, 0, width, width);
		ctx.fill()
		ctx.restore();

		ctx.save();

	}

	function drawRoundRectPath(ctx, width, height, radius) {
		ctx.beginPath(0);
		//从右下角顺时针绘制，弧度从0到1/2PI  
		ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

		//矩形下边线  
		ctx.lineTo(radius, height);

		//左下角圆弧，弧度从1/2PI到PI  
		ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

		//矩形左边线  
		ctx.lineTo(0, radius);

		//左上角圆弧，弧度从PI到3/2PI  
		ctx.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

		//上边线  
		ctx.lineTo(width - radius, 0);

		//右上角圆弧  
		ctx.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

		//右边线  
		ctx.lineTo(width, height - radius);
		ctx.closePath();
	}
	/**
	 * [getPowNumber 将数值处理成2的n次方]
	 * @Author   RAOYN
	 * @DateTime 2019-09-04
	 * @param    {Number}   h [数值]
	 * @return   {[number]}     [改变后成为2的n次方的数值]
	 */
	function getPowNumber(h = 2) {
		while (!((h & h - 1) == 0)) {
			h++
		}
		return h
	}

	return init()
}