var initCube = function(layou, _option) {
	//配置 Config   
	let df_Config = _Utils.cloneJSON(_Config.Chassis_Config.skinOne.rubik);
	df_Config = _Utils.setParms(df_Config, _option);


	const rubikOpt = {
		size: 65, //魔方size
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
				rotation: [Math.PI / 2, 1]
			}, {
				rotation: [-Math.PI / 2, 1.6]
			}],
			radius: 10,
		}, //圆参数
	}
	let group = new THREE.Group();
	/**
	 * [init 创建魔方]
	 * @Author   RAOYN
	 * @DateTime 2019-09-19
	 * @return   {Mesh}   [返回魔方Mesh]
	 */
	this.init = function() {

		let oplane = createOuterPlane({
			size: rubikOpt.size,
			border: df_Config.outerBorderWidth,
			borderColor: df_Config.outerBorderColor,
			color: df_Config.outerColor,
			g: group
		})
		group.add(oplane);
		group.position.y = 65;
		group.rotation.x = 0.78;
		group.rotation.y = 0.59;
		group.rotation.z = -1.3;

		let aitems = {
			rotation: [{
				rotation: [0.1, 0.5, 0]
			}, {
				rotation: [1.3, 0.2, 0]
			}],
			radius: 44,
		}
		//圆 
		let arueRadius = 60;
		let points = aitems.rotation.map(function(elem) {
			return addArue(arueRadius, group, elem);
		})


		return group
	}
	this.setArue = function(index, vec3) {
		for (let key in vec3) {
			thm.auras[index].rotation[key] = vec3[key]
		}
	}
	/**
	 * [addArue 创建圆]
	 * @Author   RAOYN
	 * @DateTime 2019-09-10
	 * @param    {[type]}   radius [半径]
	 */
	let thm = this;
	this.auras = [];
	this.animation = function() {
		//运动point
		thm.auras.forEach(elem => {
			elem.rotation.z += 0.01;
		})
	}

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
			// depthTest: false,
			transparent: true
		});

		// Create the final object to add to the scene
		var ellipse = new THREE.Line(geometry, material);

		ellipse.rotation.x = rotation[0];
		ellipse.rotation.y = rotation[1];
		ellipse.rotation.z = rotation[2];
		// ellipse.position.y = radius / 1.2;
		group.add(ellipse);
		thm.auras.push(ellipse)
		//添加光点
		let pointMap = new THREE.TextureLoader().load(_Assets.point);
		var geometry = new THREE.BufferGeometry();
		let pointMaterial = new THREE.PointsMaterial({
			size: 15,
			map: pointMap,
			blending: THREE.AdditiveBlending,
			// sizeAttenuation: false,
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
			map: pat,
			// blending: THREE.AdditiveBlending
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
	 * [createOuterPlane 创建魔方外圈平面]
	 * @Author   RAOYN
	 * @DateTime 2019-09-19
	 * @param    {Number}   options.size        [宽高]
	 * @param    {Number}   options.border      [背景颜色]
	 * @param    {String}   options.borderColor [边框颜色]
	 * @param    {String}   options.color       [粗细]
	 * @param    {String}   options.gap         [间隔]
	 * @return   {[type]}                       [Group]
	 */
	function createOuterPlane({
		size = 64,
		border = 2,
		borderColor = "#1850a6",
		color = "rgba(16,48,110,0.2)",
		gap = 4,
		g
	} = option = {}) {
		let texture = createPlaneMap(512, "rgba(85,136,170,0.2)", "rgba(85,136,170,1)");
		let _group = new THREE.Group();
		let _p = size / 2;
		const planeArr = [
			[_p, 0, 0],
			[-_p, 0, 0],
			[0, _p, 0],
			[0, -_p, 0],
			[0, 0, _p],
			[0, 0, -_p]
		]
		let colorArr = _Utils.getColorArr(color);
		//添加6边
		let material = new THREE.MeshBasicMaterial({
			side: THREE.BackSide,
			transparent: true,
			depthTest: false,
			color: colorArr[0],
			opacity: colorArr[1],
			map: texture,
		})
		let geometry = new THREE.PlaneGeometry(size, size, 2);
		planeArr.forEach(elem => {
			let mesh = new THREE.Mesh(geometry, material);
			let vec3 = new THREE.Vector3(elem[0], elem[1], elem[2]);
			let position = vec3.setLength(vec3.length() + gap);
			mesh.position.set(...Object.values(position));
			mesh.lookAt(new THREE.Vector3(0, 0, 0));
			_group.add(mesh);
			// mesh.material.alphaTest = 0.2
			//添加子的平面
			createInside({
				goup: mesh,
				z: 4
			});
		})

		return _group
	}
	/**
	 * [createInside 生成里面的格子]
	 * @Author   RAOYN
	 * @DateTime 2019-09-19
	 * @param    {Number}   options.row         [行数]
	 * @param    {Number}   options.col         [列数]
	 * @param    {String}   options.borderColor [表框颜色]
	 * @param    {String}   options.color       [背景色]
	 * @param    {Number}   options.size        [大小]
	 * @param    {Number}   options.gap         [间隔]
	 * @param    {Number}   options.z           [z坐标]
	 * @param    {Object}   options.goup        [goup]
	 */
	function createInside({
		row = 4,
		col = 4,
		borderColor = "rgba(255,255,255,0.5)",
		color = "rgba(155,200,244,1)",
		size = 14,
		gap = 1,
		z = 0,
		goup = {}
	} = option = {}) {
		let colorArr = _Utils.getColorArr(color);
		let geometry = new THREE.PlaneGeometry(size, size, 2);
		const colorArrs = [{
			color: "#0a3a7c",
			index: 1,
		}, {
			color: "#052c5e",
			index: 0.999,
		}, {
			color: "#1e6dc6",
			index: 0,
		}]
		const colorArrsHight = [{
			color: "#52bcfe",
			index: 1,
		}, {
			color: "#52bcfe",
			index: 0.999,
		}, {
			color: "#52bcfe",
			index: 0,
		}]
		let texture = createInsidePlane({
			size: 128,
			border: 2,
			borderColor: "#fff",
			color: "#fff",
			colorArrs: colorArrs,
			fontColor: "#4bc9ee"
		})
		let textureHight = createInsidePlane({
			size: 128,
			border: 2,
			borderColor: "#fff",
			color: "#fff",
			colorArrs: colorArrsHight,
			fontColor: "#fff"
		})
		let materialArr = [];
		let material = new THREE.MeshBasicMaterial({
			side: THREE.FrontSide,
			color: new THREE.Color("#ffffff"),
			opacity: 2,
			map: texture
		});
		let materialHight = new THREE.MeshBasicMaterial({
			side: THREE.FrontSide,
			color: new THREE.Color("#ffffff"),
			opacity: 2,
			map: textureHight
		});
		materialArr.push(material)
		materialArr.push(materialHight)
		const totalWidth = size * row + gap * (row - 1);
		for (let i = 0; i < row; i++) {
			for (let j = 0; j < col; j++) {
				let mesh = new THREE.Mesh(geometry, Math.random() < 0.8 ? material : materialHight);
				let x = i * size + i * gap - totalWidth / 2 + size / 2;
				let y = j * size + j * gap - totalWidth / 2 + size / 2;
				mesh.position.set(x, y, z);
				mesh.rotation.y = Math.PI
				goup.add(mesh)
				// mesh.material.alphaTest = 0.1

			}
		}
	}
	/**
	 * [createInsidePlane 创建内平面]
	 * @Author   RAOYN
	 * @DateTime 2019-09-19
	 * @param    {Number}   options.size        [description]
	 * @param    {Number}   options.border      [description]
	 * @param    {String}   options.borderColor [description]
	 * @param    {String}   options.color       [description]
	 * @return   {[type]}                       [description]
	 */
	function createInsidePlane({
		size = 54,
		border = 2,
		fontColor = "#fff",
		borderColor = "#fff",
		color = "#fff",
		colorArrs = []
	} = option = {}) {
		let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
		size = getPowNumber(size);
		canvas.width = size;
		canvas.height = size;
		let ctx = canvas.getContext("2d");
		ctx.beginPath();
		let radius = 10;
		let lw = 4;

		var grd = ctx.createRadialGradient(size / 2, size / 2, 18, size / 2, size / 2, size);
		for (let i = 0; i < colorArrs.length; i++) {
			grd.addColorStop(colorArrs[i].index, colorArrs[i].color);
		}
		ctx.fillStyle = "#02347a"
		ctx.fill();
		roundRect(ctx, {
			x: 0,
			y: 0,
			width: size,
			radius: radius,
			lineWidth: lw,
			color: grd,
			borderColor: borderColor,
			name: "单位12"
		})
		addText(ctx, "单位1", 24, fontColor, size)
		let _texture = new THREE.Texture(canvas);
		_texture.needsUpdate = true;
		return _texture
	}
	/**
	 * [createPlaneMap 创建平面贴图]
	 * @Author   RAOYN
	 * @DateTime 2019-09-19
	 * @param    {Number}   width       [宽度]
	 * @param    {String}   color       [颜色]
	 * @param    {String}   borderColor [边框色彩]
	 * @return   {[type]}               [贴图]
	 */
	function createPlaneMap(width, color, borderColor) {
		let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
		radnius = getPowNumber(width);
		canvas.width = width;
		canvas.height = width;
		let ctx = canvas.getContext("2d");
		ctx.beginPath();
		let radius = 24;
		let lw = 4;
		roundRect(ctx, {
			x: 0,
			y: 0,
			width: width - 4,
			radius: radius,
			lineWidth: lw,
			color: color,
			borderColor: borderColor
		})
		let _texture = new THREE.Texture(canvas);
		_texture.needsUpdate = true;
		return _texture
	}
	/**
	 * [addSpriteText 添加中文字体]
	 * @Author   RAOYN
	 * @DateTime 2019-09-16
	 * @param    {String}   ctx         [ctx]
	 * @param    {String}   text        [字]
	 * @param    {String}   fontSzie    [字体大小]
	 * @param    {String}   color       [颜色]
	 * @return   {Texture}              [Mesh]
	 */
	function addText(ctx, text, fontSzie = 24, color = "#ffffff", width) {
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.font = fontSzie + "px 微软雅黑";
		ctx.font = fontSzie + "px 微软雅黑";
		ctx.textAlign = 'center';
		ctx.textBaseline = 'center';
		ctx.fillText(text, width / 2, width / 2 + fontSzie / 2);

	}
	/**
	 * [roundRect 生成有边框的铁图]
	 * @Author   RAOYN
	 * @DateTime 2019-09-19
	 * @param    {[type]}   ctx               	[canvas ctx]
	 * @param    {Number}   options.x         	[x]
	 * @param    {Number}   options.y         	[y]
	 * @param    {Number}   options.width     	[width]
	 * @param    {Number}   options.radius    	[radius]
	 * @param    {Number}   options.lineWidth 	[边框宽度]
	 * @param    {Number}   options.color		[颜色]
	 * @param    {Number}   options.borderColor [边框颜色]
	 * @return   {[type]}                     	[]
	 */
	function roundRect(ctx, {
		x = 0,
		y = 0,
		width = 20,
		radius = 5,
		lineWidth = 2,
		color = "#fff",
		borderColor = "#fff",
	} = option = {}) {
		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.arcTo(x + width, y, x + width, y + width, radius);
		ctx.arcTo(x + width, y + width, x, y + width, radius);
		ctx.arcTo(x, y + width, x, y, radius);
		ctx.arcTo(x, y, x + width, y, radius);
		ctx.lineWidth = lineWidth;
		ctx.fillStyle = color;
		ctx.fill();
		ctx.strokeStyle = borderColor;
		ctx.stroke()
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


}