/**
 * [initAmbient 外围的物体]
 * @Author   RAOYN
 * @DateTime 2019-10-16
 * @param    {[type]}   layers 	 [图层] 
 */

var initAmbient = function (layers) {
	let thm = this;
	let group = new THREE.Group();
	let objs = [];
	//config
	let _Config = {
		size: 20,
		look: 1,
		image: "",
		number: 20,
		color: "rgba(255,255,255,1)",
		data: [], //展示数据
		type: 1, //加载类型
		radius: 200
	}
	let cubes = [];
	/**
	 * [init 初始化]
	 * @Author   RAOYN
	 * @DateTime 2019-10-16
	 * @param    {[type]}   opt [参数配置]
	 * @return   {[type]}   	[description]
	 */
	this.init = function (opt) {
		console.log(opt)
		//根据不同类型生成不同的外部盒子
		switch (opt.type) {
			case 1:
				createBox(opt);
				break;
			case 2:
				break;
			case 2:
				break;
		}
		for (var i = 0; i < opt.position.length; i++) {
			// [i].pre 当前坐标 [i].rad 生成的角度
			let elem = opt.position[i];

		}
	}
	/**
	 * [createBox 创建盒子]
	 * @Author   RAOYN
	 * @DateTime 2019-10-24
	 * @param    {Array}    opt.position [坐标组]
	 * @param    {String}	opt.color 	 [颜色]
	 * @param    {String}	opt.image 	 [纹理]
	 * @param    {String}	opt.look 	 [朝向]
	 * @return   {[type]}            	 [description]
	 */
	/**
	 * [createBox 创建盒子]
	 * @Author   RAOYN
	 * @DateTime 2019-10-16 
	 * @param    {Array}    opt.position [坐标组]
	 * @param    {String}	opt.color 	 [颜色]
	 * @param    {String}	opt.image 	 [纹理]
	 * @param    {String}	opt.look 	 [朝向]
	 * @return   {[type]}            	 [description]
	 */
	function createBox(opt = {}) {
		console.log(opt)
		let BoxGroup = new THREE.Group();
		BoxGroup.name = "box";
		let position = opt.position || [];
		let textur = opt.image ? new THREE.TextureLoader().load(opt.image) : ''; //纹理
		let colorArr = _Utils.getColorArr(opt.color); //color array
		let geometry = new THREE.Geometry();
		let material = new THREE.MeshBasicMaterial({
			color: colorArr[0],
			opacity: colorArr[1],
			map: textur,
			transparent: true
		}); //材质 
		position.forEach(function (elem, index) {
			let mesh = new THREE.Mesh(boxGeometry(1), material);
			//大小
			let size = opt.size || 1;
			mesh.scale.set(size, size, size);
			let v = new THREE.Vector3(elem.pre[0], size / 2, elem.pre[1]);
			mesh.position.set(elem.pre[0], size / 2, elem.pre[1]);
			//矩阵
			if (opt.look == 1) {
				mesh.lookAt(new THREE.Vector3(0, size / 2, 0));
			}

			// mesh.scale 
			BoxGroup.add(mesh);
			cubes.push(mesh);
		})
		layers.add(BoxGroup);
	}
	/**
	 * [boxGeometry 添加立方体 并且设置UV位置]
	 * @Author   RAOYN
	 * @DateTime 2019-09-05
	 * @param    {Object}   _material [材质]
	 * @return   {Object}             [Geometry]
	 */
	function boxGeometry(size = 1) {
		let geometry = new THREE.BoxGeometry(size, size, size);
		let bricks = [new THREE.Vector2(0, .666), new THREE.Vector2(.5, .666), new THREE.Vector2(.5, 1), new THREE.Vector2(0, 1)];
		let clouds = [new THREE.Vector2(.5, .666), new THREE.Vector2(1, .666), new THREE.Vector2(1, 1), new THREE.Vector2(.5, 1)];
		let crate = [new THREE.Vector2(0, .333), new THREE.Vector2(.5, .333), new THREE.Vector2(.5, .666), new THREE.Vector2(0, .666)];
		let stone = [new THREE.Vector2(.5, .333), new THREE.Vector2(1, .333), new THREE.Vector2(1, .666), new THREE.Vector2(.5, .666)];
		let water = [new THREE.Vector2(0, 0), new THREE.Vector2(.5, 0), new THREE.Vector2(.5, .333), new THREE.Vector2(0, .333)];
		let wood = [new THREE.Vector2(.5, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, .333), new THREE.Vector2(.5, .333)];

		geometry.faceVertexUvs[0] = [];

		geometry.faceVertexUvs[0][0] = [bricks[0], bricks[1], bricks[3]];
		geometry.faceVertexUvs[0][1] = [bricks[1], bricks[2], bricks[3]];

		geometry.faceVertexUvs[0][2] = [clouds[0], clouds[1], clouds[3]];
		geometry.faceVertexUvs[0][3] = [clouds[1], clouds[2], clouds[3]];

		geometry.faceVertexUvs[0][4] = [crate[0], crate[1], crate[3]];
		geometry.faceVertexUvs[0][5] = [crate[1], crate[2], crate[3]];

		geometry.faceVertexUvs[0][6] = [stone[0], stone[1], stone[3]];
		geometry.faceVertexUvs[0][7] = [stone[1], stone[2], stone[3]];

		geometry.faceVertexUvs[0][8] = [water[0], water[1], water[3]];
		geometry.faceVertexUvs[0][9] = [water[1], water[2], water[3]];

		geometry.faceVertexUvs[0][10] = [wood[0], wood[1], wood[3]];
		geometry.faceVertexUvs[0][11] = [wood[1], wood[2], wood[3]];
		return geometry
	}

}