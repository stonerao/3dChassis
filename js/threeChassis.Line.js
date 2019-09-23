/**
 * [initLinePoint 转盘的连线 飞线 点]
 * @Author   RAOYN
 * @DateTime 2019-09-21
 * @param    {Object}   options.line [线的配置参数]
 * @param    {Object}   point        [点的配置参数]
 * @param    {[type]}   layout       [图层]
 */
var initLinePoint = function({
	line = {},
	point = {},
	layout = {}
}) {
	let thm = this;
	let group = new THREE.Group();
	layout.add(group);
	let _Config = {
		line,
		point
	};
	let pointMesh = null;
	let flyMesh = null;
	//创建线条的材质

	/**
	 * [thm.add 更新转盘的连线 飞线 点]
	 * @Author   RAOYN
	 * @DateTime 2019-09-21
	 * @param    {Array}    options.data [所有线段的数据]
	 * @param    {Object}   options.line [线的配置参数]
	 * @param    {Object}   point        [点的配置参数]
	 * @param    {Object}   fly          [飞线]
	 * @param    {[type]}   layout       [完成飞线的时间]
	 */
	thm.add = function({
		data = [],
		line = {},
		point = {},
		fly = {},
		time = 2000
	}) {
		let lineMesh = thm.createLine(line, data)
		group.add(lineMesh);
		//增加回调
		fly.callback = function(elem) {
			if (pointMesh) {
				pointMesh.addPoint(new THREE.Vector3(0, 0, 0))
			}
		}
		flyMesh = new thm.createFly(fly, data, layout)
		pointMesh = new thm.createPoint(point, layout);
		pointMesh.addPoint(new THREE.Vector3(0, 0, 0))

	}
	/**
	 * [thm.update 更新转盘的连线 飞线 点]
	 * @Author   RAOYN
	 * @DateTime 2019-09-21
	 * @param    {Array}    options.data [所有线段的数据]
	 * @param    {Object}   options.line [线的配置参数]
	 * @param    {Object}   point        [点的配置参数]
	 * @param    {Object}   fly          [飞线]
	 * @param    {[type]}   layout       [完成飞线的时间]
	 */
	thm.update = function({
		data = [],
		line = {},
		point = {},
		fly = {},
		time = 2000
	}) {

	}
	var pointShader = {
		vertexshader: `
            uniform float time; 
            uniform float size;   
            uniform float height;   
            varying float cy;
            varying float u_size;
            void main(){ 
                cy = position.y ; 
                if(height > position.y){
                    u_size = size + position.y;
                    vec4 mvPosition = modelViewMatrix * vec4( position.x,position.y,position.z, 1.0 );
                    gl_Position = projectionMatrix * mvPosition; 
                    gl_PointSize = u_size * 300.0/(-mvPosition.z ) ;
                } 
            }
        `,
		fragmentshader: `
            uniform sampler2D texture; 
            uniform vec3 color;  
            uniform float time;
            uniform float height;   
            varying float cy;
            void main(){  
                float alphas = 1.0 - cy/height -0.1 ;
                vec4 vcolor = vec4(color,alphas);
                gl_FragColor = vcolor * texture2D( texture,vec2(gl_PointCoord.x,1.0-gl_PointCoord.y) );
            }
        `
	}
	thm.createPoint = function({
		color = "#fff",
		texture = {},
		size = 25,
		speed = 1,
		height = 500,
		number = 20
	}, layout) {
		let vecs = [];
		let position = [0,0,0];
		let colorArr = _Utils.getColorArr(color); 
		let material = new THREE.ShaderMaterial({
			uniforms: {
				color: {
					value: colorArr[0],
					type: "v3"
				},
				 
				time: {
					value: 0.0,
					type: "f"
				},
				size: {
					value: size,
					type: "f"
				},
				texture: {
					value: texture,
					type: "t2"
				},
				height: {
					value: height,
					type: "f"
				}
			},
			transparent: true,
			depthTest: false,
			// blending: THREE.AdditiveBlending,
			vertexShader: pointShader.vertexshader,
			fragmentShader: pointShader.fragmentshader
		});
		console.log(material)
		let geometry = new THREE.BufferGeometry();
		geometry.addAttribute("position", new THREE.Float32BufferAttribute(position, 3))
		point = new THREE.Points(geometry, material);
		layout.add(point);
		/**
		 * [addPoint 添加粒子]
		 * @Author   RAOYN
		 * @DateTime 2019-09-21
		 * @param    {[type]}   vec3 [起始点]
		 */
		this.addPoint = function(vec3) {
			vecs.push(vec3);
		}
		this.animation = function(delta) {
			if (point) {
				point.material.uniforms.time.value += delta * 10;
				let position = [];
				if (vecs.length > number) {
					vecs.splice(0, 1);
				}
				vecs.forEach(elem => {
					elem.y += delta * speed * size;
					position.push(elem.x, elem.y, elem.z);
				}) 
				point.geometry.addAttribute("position", new THREE.Float32BufferAttribute(position, 3))
			}
		}
	}
	var flyShader = {
		vertexshader: `
		uniform float time;
		uniform float size;
		uniform float u_len;
		attribute float uindex;
		varying float u_index;
		varying float u_time;
		void main() {
			u_index = uindex;
			u_time = time;
			vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
			gl_Position = projectionMatrix * mvPosition;
			gl_PointSize = size * 300.0 / (-mvPosition.z);
		}
		`,
		fragmentshader: `
			uniform sampler2D texture;
			uniform vec3 color;
			uniform float u_opacity;
			uniform float u_len;
			varying float u_index;
			varying float u_time;
			void main() {
				if (u_time > u_index && u_index > u_time - u_len) {
					float opacity = (1.0 - (u_time - u_index) / u_len) * u_opacity;
					vec4 vcolor = vec4(color, opacity);
					gl_FragColor = vcolor * texture2D(texture, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));
				}
			}`
	}
	/**
	 * [createFly 添加飞线]
	 * @Author   RAOYN
	 * @DateTime 2019-09-21
	 * @param    {String}   options.color   [颜色]
	 * @param    {Object}   options.texture [贴图]
	 * @param    {Number}   size            [大小]
	 * @param    {Number}   lenth           [长度]
	 * @param    {Number}   dpi             [精确度]
	 * @param    {Function} callback        [完成的回调]
	 * @param    {[type]}   speed           [速度]
	 * @param    {[type]}   order           [顺序  true 内向外 false 外向内]
	 * @return   {[type]}                   [Mesh]
	 */

	thm.createFly = function({
		color = "#fff",
		texture = {},
		size = 5,
		lenth = 80,
		dpi = 5,
		speed = 1,
		callback,
		order = false
	}, data = [], layout) {
		let colorArr = _Utils.getColorArr(color);
		let group = new THREE.Group();
		layout.add(group);
		//根据数据添加飞线 
		data.forEach(function(elem) {
			let src = elem.src;
			let dst = elem.dst;
			//确认顺序
			let points = [];
			if (order) {
				points = _Utils.getPoints(src, dst, 1, lenth * dpi);
			} else {
				points = _Utils.getPoints(dst, src, 1, lenth * dpi);
			}
			let len = points.length;
			//获取顶点 索引
			let position = [];
			let u_index = [];
			points.forEach((elem, index) => {
				position.push(elem.x, elem.y, elem.z);
				u_index.push(index)
			})
			//开始添加
			let geometry = new THREE.BufferGeometry();
			let material = new THREE.ShaderMaterial({
				uniforms: {
					color: {
						value: colorArr[0],
						type: "v3"
					},
					time: {
						value: 0.0,
						type: "f"
					},
					size: {
						value: size,
						type: "f"
					},
					texture: {
						value: texture,
						type: "t2"
					},
					u_len: {
						value: lenth,
						type: "f"
					},
					u_opacity: {
						value: colorArr[1],
						type: "f"
					}
				},
				transparent: true,
				depthTest: false,
				vertexShader: flyShader.vertexshader,
				fragmentShader: flyShader.fragmentshader
			});
			//往buffer添加position index
			geometry.addAttribute("position", new THREE.Float32BufferAttribute(position, 3))
			geometry.addAttribute("uindex", new THREE.Float32BufferAttribute(u_index, 1))
			let point = new THREE.Points(geometry, material);
			point.userData = {
				len: u_index.length
			}
			group.add(point);
		})
		this.animation = function(delta) {
			group.children.forEach(elem => {
				if (elem.material.uniforms.time.value - length > elem.userData.len) {
					elem.material.uniforms.time.value = 0;
					if (typeof callback === 'function') {
						callback(elem)
					}
				}
				elem.material.uniforms.time.value += delta * speed * lenth;
			})
		}

	}
	// 渐变连线的shader
	var LineShader = {
		vertexshader: ` 
            attribute float alphas;
            varying float Valphas;
            void main(){ 
                Valphas = alphas;
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                gl_Position = projectionMatrix * mvPosition;   
        	}`,
		fragmentshader: `
            uniform vec3 color; 
            uniform float u_opacity; 
            varying float Valphas;
            void main(){  
               gl_FragColor = vec4(color,Valphas); 
            }`
	}
	/**
	 * [createLine 创建连线]
	 * @Author   RAOYN
	 * @DateTime 2019-09-21
	 * @param    {String}   options.color    [颜色]
	 * @param    {Number}   options.gradient [是否需要渐变 1为不需要渐变  0 为到渐变透明度]
	 * @param    {String}   options.style    [solid 实线 dashed 虚线]
	 * @param    {Array}    data    		 [连线数据 src dst]
	 * @return   {[type]}                    [Line Mesh]
	 */
	thm.createLine = function({
		color = "#fff",
		gradient = 1,
		style = "solid",
	}, data = []) {
		let colorArr = _Utils.getColorArr(color);
		let geometry = new THREE.BufferGeometry();
		let material = new THREE.ShaderMaterial({
			uniforms: {
				color: {
					value: new THREE.Color("#ff0000"),
					type: "f"
				},
				u_opacity: {
					value: 1.2,
					type: "f"
				}
			},
			transparent: true,
			depthTest: false,
			side: THREE.DoubleSide,
			// blending: THREE.AdditiveBlending,
			vertexShader: LineShader.vertexshader,
			fragmentShader: LineShader.fragmentshader
		});
		let position = [];
		let alphas = [];
		//添加顶点 透明度
		data.forEach(function(elem) {
			let src = elem.src;
			let dst = elem.dst;
			let points = _Utils.getPoints(src, dst, 1, 90);
			let len = points.length;
			points.forEach(function(vec, index) {
				let ap = index / len * index / len + gradient;
				if (style === "dashed") {
					//选线
					if (index % 2 == 0) {
						position.push(vec.x, vec.y, vec.z);
						alphas.push(ap)
					}
				} else {
					//实线
					position.push(vec.x, vec.y, vec.z);
					alphas.push(ap)
				}
			})

		})
		geometry.addAttribute("position", new THREE.Float32BufferAttribute(position, 3))
		geometry.addAttribute("alphas", new THREE.Float32BufferAttribute(alphas, 1))
		let lineMesh = new THREE.LineSegments(geometry, material);
		lineMesh.computeLineDistances();
		return lineMesh
	}
	this.animation = function(delta) {
		if (flyMesh) {
			flyMesh.animation(delta)
		}
		if (pointMesh) {
			pointMesh.animation(delta)
		}
	}
}