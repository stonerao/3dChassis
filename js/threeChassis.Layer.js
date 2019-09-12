/**
 * [Chassis_Layer 底部轮播组件]
 * @Author   RAOYN
 * @DateTime 2019-09-06
 * @param    {object}   layout [初始滑参数 父组件this]
 */
var Chassis_Layer = function (layout) {
    var thm = this;
    //组件所使用的的group组
    thm.layout = new THREE.Group();
    layout.layoutObject.add(thm.layout)
    thm.childCubeObject = new THREE.Group();
    thm.layout.add(thm.childCubeObject);
    //光波组
    thm.haloGroup = new THREE.Group();
    thm.layout.add(thm.haloGroup);
    //配置 Config  
    let df_Config = _Utils.cloneJSON(_Config.Chassis_Config.skinOne);
    //全局配置
    let center = new THREE.Vector3(0, 0, 0); //中心
    let chassisRadius = 200; //半径
    let df_Raycaster = new THREE.Raycaster();
    thm.lineArrPosition = []; // 
    //飞线
    let _MLine = _Collects.initMeshLine();
    let resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    //连线
    thm.lineMesh = null;
    thm.haloAuraMesh = null;
    //转盘旋转方向 1 正 2反 0 停
    thm.chassisRotate = 0;
    //旋转速度 每帧数
    thm.chassisRotateSpeed = 0.001;

    /**
     * [initChassis 创建轮盘组件]
     * @Author   RAOYN
     * @DateTime 2019-09-04 
     */
    function initChassis() {

    }
    /**
     * [init 调用方法，根据不同的参数生成不同的样式]
     * @Author   RAOYN
     * @DateTime 2019-09-04
     * @param    {Object}   _Config [调用组件所传递的参数，没传递的参数使用默认参数]
     */
    thm.Cube3D = null;
    thm.PointCube = null;
    thm.init = function (_Config = {}) {
        //需要抽
        //模仿

        //中间图 
        createInsideImg(_Config.insideImg, {
            x: _Config.insideX,
            y: _Config.insideY,
            z: _Config.insideZ
        });

        //圈 内/外 
        //外圈
        let ringOuter_Geo = new THREE.PlaneBufferGeometry(chassisRadius * 2 - 50, chassisRadius * 2 - 50, 2);
        let ringOuter_Textur = createOuterRing(chassisRadius * 3, 0.1);
        let ringOuter_Mat = new THREE.MeshBasicMaterial({
            color: 0x5588aa,
            side: THREE.DoubleSide,
            map: ringOuter_Textur,
            transparent: true,
            depthTest: false,
        });
        let ringOuterMesh = new THREE.Mesh(ringOuter_Geo, ringOuter_Mat);
        ringOuterMesh.rotation.x = -Math.PI / 2;
        ringOuterMesh.name = "outerRing";
        thm.layout.add(ringOuterMesh);

        //内圈 
        let ringInsider_Geo = new THREE.CircleBufferGeometry(50, 64);
        let ringInsider_Textur = createInsideRing(chassisRadius * 3);
        let ringInsider_Mat = new THREE.MeshBasicMaterial({
            color: 0x5588aa,
            map: ringInsider_Textur,
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
        });
        let ringInsiderMesh = new THREE.Mesh(ringInsider_Geo, ringInsider_Mat);
        ringInsiderMesh.rotation.x = -Math.PI / 2;
        ringInsiderMesh.name = "insiderRing";
        thm.layout.add(ringInsiderMesh);
        //立方体 
        const cubeNumber = df_Config.cubeNumber; //根数
        const cubeSize = df_Config.cubeSize; //大小
        const cubeStyle = df_Config.cubeStyle; //样式 quit
        const cubeStyleAssets = df_Config.cubeStyleAssets; //样式 quit
        const cube = df_Config.cube; //图 quit
        let circleArr = drawCircle([center.x, center.z], chassisRadius, 1, cubeNumber);
        //立方体贴图 
        //添加中心点到四周立方体的线段
        for (let i = 0; i < circleArr.length; i++) {
            let elem = circleArr[i];
            elem.name = "测试试试试";
            const vec3 = new THREE.Vector3(elem.pre[0], 0, elem.pre[1]);
            thm.lineArrPosition.push({
                src: center,
                dst: vec3,
            })
        } 
        //根据样式不同 创建不同的外圈模型
        thm.cubeMaterial;
        switch (cubeStyle) {
            //立方体
            case 1:
                createOuterCube(circleArr, cubeSize, cubeStyleAssets)
                break;
            case 2:
                createOuterCone(circleArr, cubeSize, cubeStyleAssets)
                break; 
        } 

        // 添加光环 
        let aura_Geo = new THREE.PlaneBufferGeometry(120, 120);
        let aura_Textur = createAura(150, 3);
        let aura_Mat = new THREE.MeshBasicMaterial({
            color: 0x5588aa,
            side: THREE.DoubleSide,
            map: aura_Textur,
            transparent: true,
            depthTest: false,
        });
        let auraMesh = new THREE.Mesh(aura_Geo, aura_Mat);
        auraMesh.rotation.x = -Math.PI / 2;
        auraMesh.name = "aura";
        thm.layout.add(auraMesh);
        //创建中间光效光环 
     createHalo()
        //添加连线 默认实线
        createLine(_Config.lineStyle, _Config.lineColor);
        //添加飞线
        addHaloLine(thm.lineArrPosition);

    }
    /**
     * [animation 刷新]
     * @Author   RAOYN
     * @DateTime 2019-09-04
     * @param    {Number}   delte [每次刷新的间隔时间]
     */
    let len = 0;
    thm.animation = function (delte) {
        //旋转
        switch (thm.chassisRotate) {
            case 0 || "0":
                break;
            case 1 || "1":
                //正
                thm.layout.rotation.y -= thm.chassisRotateSpeed;
                break;
            case 2 || "2":
                //反
                thm.layout.rotation.y += thm.chassisRotateSpeed;
                break;
        }
        /*  if( thm.Cube3D){
               thm.Cube3D.rotation.y +=0.01
          }*/
        // 飞线
        thm.haloGroup.children.forEach(function (mesh) {
            let user = mesh.userData;
            let src = user.src;
            let dst = user.dst;
            user.progress += delte / 5;
            let vec3 = src.clone().lerp(dst, user.progress);
            user.line.advance(new THREE.Vector3(vec3.x, vec3.y, vec3.z));
            if (user.progress >= 1) {
                var geometry = new THREE.Geometry();
                for (var i = 0; i < 30; i++) {
                    geometry.vertices.push(new THREE.Vector3(src.x, src.y, src.z))
                }
                user.line.setGeometry(geometry);
                user.progress = 0
            }
        })
    }
    /**
     * [thm.disposeValue 离开清除]
     * @Author   RAOYAN
     * @DateTime 2019-8-31 12:41:36
     */
    thm.disposeValue = function () {
        thm.layout = null;
        thm = null;
    }
    /**
     * [mouseUp 鼠标按下触发]
     * @Author   RAOYN
     * @DateTime 2019-09-04
     * @param    {Object}   evnet  [event事件信息]
     * @param    {Object}   _mouse [mouse参数]
     */
    thm.mouseUp = function (evnet = {}, _mouse = {}) {
        let mouse = new THREE.Vector2();
        mouse.x = _mouse.x;
        mouse.y = _mouse.y;
        df_Raycaster.setFromCamera(mouse, layout.camera);
        //点击cube
        thm.clickCube(df_Raycaster);
    }
    /**
     * [clickCube 点击四周立方体事件]
     * @Author   RAOYN
     * @DateTime 2019-09-04
     * @param    {Object}   df_Raycaster [射线拾取] 
     */
    thm.clickCube = function (df_Raycaster = {}) {
        console.log(layout.camera)
        /*var intersects = df_Raycaster.intersectObjects(thm.spotGroup.children, true);
        var intersection = (intersects.length) > 0 ? intersects[0] : {};*/
        /*if(intersection.length>0){

        }*/
    }
    /**
     * [setStyle 修改转盘中的样式]
     * @Author   RAOYN
     * @DateTime 2019-09-05
     * @param    {Object}   option [所需要修改的样式，根据样式修改对应的]
     */
    thm.setStyle = function (option) {
        ////////
        // 基础 //
        ////////
        //旋转方向
        if (option.hasOwnProperty("chassisRotate")) {
            thm.chassisRotate = option.chassisRotate;
        }
        if (option.hasOwnProperty("chassisRotateSpeed")) {
            thm.chassisRotateSpeed = option.chassisRotateSpeed * 0.001;
        }

        ///////
        //中心 //
        ///////
        //更换中间样式图片
        if (option.hasOwnProperty("insideImg")) {
            const w = 64;
            const h = 64;
            createTexture({
                width: w,
                height: h,
                img: option.insideImg
            }, function (texture) {
                // 创建完成 
                let m = thm.insidePoint.material;
                let spriteMaterial = new THREE.SpriteMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                    transparent: true,
                    depthTest: false,
                });
                thm.insidePoint.material = spriteMaterial;
                thm.insidePoint.scale.set(w, h, (w + h) / 2);
                m.dispose();
                m = null;
            });
        }
        //中线物体X的位置
        if (option.hasOwnProperty("insideX")) {
            thm.insidePoint.position.x = option.insideX;
        }
        //中线物体Y的位置
        if (option.hasOwnProperty("insideY")) {
            thm.insidePoint.position.y = option.insideY;
        }
        //中线物体Z的位置
        if (option.hasOwnProperty("insideZ")) {
            thm.insidePoint.position.z = option.insideZ;
        }
        //中线的颜色
        if (option.hasOwnProperty("lightColor")) {
            let color = _Utils.getColorArr(option.lightColor)
            thm.haloMesh.material.color = color[0];
            thm.haloMesh.material.opacity = color[1];
            thm.haloMesh.material.needsUpdate = true;
        }
        //光线中间颜色
        if (option.hasOwnProperty("lightDotColor")) {
            let color = _Utils.getColorArr(option.lightDotColor)
            thm.haloAuraMesh.material.color = color[0];
            thm.haloAuraMesh.material.opacity = color[1];
            thm.haloAuraMesh.material.needsUpdate = true;
        }

        ///////
        //线条 //
        ///////
        //修改线条样式
        if (option.hasOwnProperty("lineStyle")) {
            //材质
            let _m = thm.lineMesh.material;
            let _material = {
                color: _m.color,
                opacity: _m.opacity,
                linewidth: 1
            }
            switch (option.lineStyle) {
                //实线
                case "solid":
                    thm.lineMesh.material = new THREE.LineBasicMaterial({
                        ..._material
                    })
                    break;
                //虚线
                case "dashed":
                    thm.lineMesh.material = new THREE.LineDashedMaterial({
                        scale: 2,
                        dashSize: 4,
                        gapSize: 4,
                        ..._material
                    })
                    thm.lineMesh.computeLineDistances();
                    break;
            }
            _m.dispose();
            _m = null;
        }
        //修改线条颜色
        if (option.hasOwnProperty("lineColor")) {
            let colorArr = _Utils.getColorArr(option.lineColor);
            thm.lineMesh.material.opacity = colorArr[1];
            thm.lineMesh.material.color = colorArr[0];
            thm.lineMesh.material.needsUpdate = true;
        }

    }
    /**
     * [createOuterCone 添加锥子几何体]
     * @Author   RAOYN
     * @DateTime 2019-09-09
     * @param    {Array}    positions [信息{坐标 角度 name}]
     * @param    {Number}   cubeSize  [大小]
     * @param    {[type]}   map       [贴图]
     * @return   {[type]}             [description]
     */
    function createOuterCone(info = [], cubeSize, map, text) {

        let material = new THREE.MeshNormalMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 1,
            depthTests: true,
        });
        let pointMap = new THREE.TextureLoader().load(_Assets.point);
        //圆圈材质
        let arueMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            opacity: 0.2,
            transparent: true
        });
        let PointShader = {
            vertexshader: `
                uniform vec3 vPosition;
                void main(){ 
                    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                    gl_Position = projectionMatrix * mvPosition; 
                }
            `,
            fragmentshader: ` 
                void main(){

                }
            `
        }
        let pM = new THREE.PointsMaterial({
            size: 5,
            map: pointMap,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });
        let poins = [];
        let cone = [];
        for (let i = 0; i < info.length; i++) {
            //生成cube
            let g = new THREE.Group();
            thm.childCubeObject.add(g);
            let elem = info[i];
            let geometry = new THREE.ConeBufferGeometry(cubeSize / 1.7, cubeSize, 4);
            let cubeMesh = new THREE.Mesh(geometry, material);
            cubeMesh.name = "point";
            g.add(cubeMesh)
            cone.push(cubeMesh)
            const vec3 = new THREE.Vector3(elem.pre[0], 0, elem.pre[1]);
            g.position.set(vec3.x, vec3.y + cubeSize / 2, vec3.z);
            g.lookAt(new THREE.Vector3(0, 0, 0));
            g.rotation.z += Math.PI;
            //plane
            let planeGeo = new THREE.PlaneBufferGeometry(15, 15, 2);
            let planeTextur = createOuterRing(128, 0.4);
            let planeMater = new THREE.MeshBasicMaterial({
                color: 0x5588aa,
                side: THREE.DoubleSide,
                map: planeTextur,
                transparent: true,
                depthTest: false,
            });
            let plane = new THREE.Mesh(planeGeo, planeMater);
            plane.rotation.x -= Math.PI / 2;
            plane.position.y = cubeSize / 2 + 1;
            g.add(plane)
            //圆圈 
            for (let j = 0; j < 3; j++) {
                let arue = addArueMesh(cubeSize / (2.5 - 0.5 * j), arueMaterial);
                let y = (cubeSize / 4 * (1 - j * 1)) || 0;
                arue.mesh.position.y = (cubeSize / 4 * (1 - j * 1)) || 0;
                cubeMesh.add(arue.mesh);
                let positions = arue.points.map(elem => {
                    return [elem.x, y, elem.y]
                })
                let point = addPoint(arue.points[0], arue.mesh.position.y);
                point.userData = {
                    type: 0,
                    index: parseInt(Math.random() * positions.length),
                    position: positions
                }
                cubeMesh.add(point);
                poins.push(point);
            }
            //添加sprite 名字
            let spriteMap = addSpriteText(elem.name, 24, "#fff")
            var spriteMaterial = new THREE.SpriteMaterial({
                map: spriteMap,
                color: 0xffffff
            });
            var sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(elem.name.length * 6, 8);
            sprite.position.y -= 20;
            cubeMesh.add(sprite);

        }
        setInterval(() => {
            let i = 0;
            cone.forEach(function (elem) {
                elem.rotation.y += 0.05;
            })
            poins.forEach((elem, index) => {
                if (elem.userData.index >= elem.userData.position.length) {
                    elem.userData.index = 0;
                }
                let p = elem.userData.position[elem.userData.index];
                elem.position.set(...p)
                elem.userData.index++;
            })
        }, 120)

        function addPoint(position, y) {
            var geometry = new THREE.BufferGeometry();
            geometry.addAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
            var particles = new THREE.Points(geometry, pM);
            return particles
        }

        function addSpriteText(text, fontSzie = 24, color = "#ffffff") {
            let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
            let w = text.length * fontSzie;
            let width = getPowNumber(w);
            let height = getPowNumber(fontSzie);
            let ctx = canvas.getContext("2d");
            canvas.width = width;
            canvas.height = height;
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.font = fontSzie + "px 微软雅黑";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            var n = ctx.measureText(text).width;
            ctx.fillText(text, width / 2, 1);
            let _texture = new THREE.Texture(canvas);
            _texture.needsUpdate = true;
            return _texture
        }

    }
    /**
     * [addArueMesh addArueMesh]
     * @Author   RAOYN
     * @DateTime 2019-09-09
     * @param    {Number}   radius   [创建一个圆的几何] 
     * @param    {[type]}   material [材质]
     * @return   {[Mesh]}            [Mesh]
     */
    function addArueMesh(radius, material) {
        var curve = new THREE.EllipseCurve(
            0, 0, // ax, aY
            radius, radius, // xRadius, yRadius
            0, 2 * Math.PI, // aStartAngle, aEndAngle
            false, // aClockwise
            0 // aRotation
        );
        var points = curve.getPoints(64);
        var geometry = new THREE.BufferGeometry().setFromPoints(points);


        // Create the final object to add to the scene
        var ellipse = new THREE.Line(geometry, material);
        ellipse.rotation.x += -Math.PI / 2;
        return {
            mesh: ellipse,
            points: points
        }
    }
    /**
     * [createOuterCube 创建外圈立方体]
     * @Author   RAOYN
     * @DateTime 2019-09-09
     * @param    {Array}    positions [坐标]
     * @param    {Number}   cubeSize  [大小]
     * @param    {[type]}   map       [贴图]
     * @return   {Group}              [THREE Group]
     */
    function createOuterCube(positions = [], cubeSize, map) {
        let textur = new THREE.TextureLoader().load(map);
        let material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: textur
        });
        for (let i = 0; i < positions.length; i++) {
            //生成cube
            let elem = positions[i];
            let geometry = addCube(cubeSize);
            let cubeMesh = new THREE.Mesh(geometry, material);
            thm.childCubeObject.add(cubeMesh);
            const vec3 = new THREE.Vector3(elem.pre[0], 0, elem.pre[1]);
            cubeMesh.position.set(vec3.x, vec3.y, vec3.z);
            cubeMesh.lookAt(new THREE.Vector3(0, 0, 0));
            cubeMesh.rotation.z = Math.PI / 4;
            cubeMesh.rotation.y = Math.PI / 4;
        }
    }
    /**
     * [createInsideImg 创建中间的sprit图层]
     * @Author   RAOYN
     * @DateTime 2019-09-05
     * @param    {[type]}   img [图片]
     * @param    {[type]}   p   [坐标] 
     */
    function createInsideImg(img, p) {
        //创建sprit 图片 位置中间
        const w = 64;
        const h = 64;
        createTexture({
            width: w,
            height: h,
            img: img
        }, function (texture) {
            // 创建完成 
            let spriteMaterial = new THREE.SpriteMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
                depthTest: false,
            });
            thm.insidePoint = new THREE.Sprite(spriteMaterial);
            thm.insidePoint.scale.set(w, h, (w + h) / 2);
            thm.insidePoint.position.set(p.x, p.y, p.z);
            thm.layout.add(thm.insidePoint);
        });
    }
    /**
     * [createLine 生成中心店连接外圈的连线]
     * @Author   RAOYN
     * @DateTime 2019-09-05
     * @param    {[type]}   lineStyle [线条样式，实线虚线光线光带等]
     * @param    {String}   color     [线条颜色] 
     */
    function createLine(lineStyle, color = "rgba(255,255,255,1)") {
        let colorArr = _Utils.getColorArr(color);
        let linePositionArr = [];
        let line_mat = null;
        let line_mat_params = {
            color: colorArr[0],
            opacity: colorArr[1],
            linewidth: 1,
        }
        let lineGeometry = new THREE.BufferGeometry();
        //根据type生成不同类型的线条类型
        if (lineStyle === 'dashed') {
            line_mat = new THREE.LineDashedMaterial({
                scale: 2,
                dashSize: 4,
                gapSize: 4,
                ...line_mat_params
            });
        } else {
            line_mat = new THREE.LineBasicMaterial({
                linewidth: 1,
                ...line_mat_params
            });

        }
        //加入顶点
        thm.lineArrPosition.forEach(function (elem) {
            let src = elem.src;
            let dst = elem.dst;
            linePositionArr.push(src.x, src.y, src.z);
            linePositionArr.push(dst.x, dst.y, dst.z);
        })
        lineGeometry.addAttribute("position", new THREE.Float32BufferAttribute(linePositionArr, 3))

        thm.lineMesh = new THREE.LineSegments(lineGeometry, line_mat);
        thm.layout.add(thm.lineMesh);
        //如果是虚线  执行虚线方法
        if (lineStyle === 'dashed') {
            thm.lineMesh.computeLineDistances();
        }
    }
    /**
     * [createCubeMaterial 创建立方体材质]
     * @Author   RAOYN
     * @DateTime 2019-09-05
     * @param    {String}   img [图片]
     * @return   {Object}       [材质]
     */
    function createCubeMaterial(img) {
        let textur = new THREE.TextureLoader().load(img);
        let material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: textur
        });
        return material
    }

    /**
     * [addCube 添加立方体 并且设置UV位置]
     * @Author   RAOYN
     * @DateTime 2019-09-05
     * @param    {Object}   _material [材质]
     * @return   {Object}             [Geometry]
     */
    function addCube(size) {
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
    /**
     * [addHaloLine 添加飞线]
     * @Author   RAOYN
     * @DateTime 2019-09-05
     * @param    {Array}    position [飞线数组]
     */
    function addHaloLine(position = []) {
        position.forEach(function (elem, index) {
            //添加飞线
            // console.log(_Assets.halo)
            let haloAssets = new THREE.TextureLoader().load(_Assets.halo);
            //材质
            let _MLineMater = new _MLine.MeshLineMaterial({
                color: new THREE.Color("#ffffff"),
                opacity: 1,
                resolution: resolution,
                map: haloAssets,
                useMap: 1.0,
                sizeAttenuation: 1,
                lineWidth: 5,
                near: 0.1,
                far: 100000,
                depthTest: false,
                blending: THREE.AdditiveBlending,
                transparent: true,
                side: THREE.DoubleSide
            })
            let line = new _MLine.MeshLine();
            let geometry = new THREE.Geometry();
            for (let i = 0; i < 30; i++) {
                // cloneSrc.setLength(cloneSrc.length() - 3)
                geometry.vertices.push(new THREE.Vector3(i, i, i))
            }
            line.setGeometry(geometry);
            let mesh = new THREE.Mesh(line.geometry, _MLineMater);
            mesh.userData = {
                line: line,
                src: elem.src,
                dst: elem.dst,
                progress: 0,
                id: index
            }
            thm.haloGroup.add(mesh);
            let i = 0;
        })

    }
    /**
     * [createTexture 通过canvas创建纹理]
     * @Author   RAOYN
     * @DateTime 2019-08-31
     * @param    {Object}   opt      [参数]
     * @param    {Function} callback [回调函数，返回纹理] 
     */
    function createTexture({
        width = 64,
        height = 64,
        img
    } = opt, callback) {
        if (!img) {
            return false;
        }
        let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
        canvas.width = getPowNumber(width);
        canvas.height = getPowNumber(height);
        let ctx = canvas.getContext("2d");
        let _Image = new Image();
        _Image.src = img;
        //等待图片加载完成
        _Image.onload = function () {
            ctx.drawImage(_Image, 0, 0, width, height);
            let _texture = new THREE.Texture(canvas);
            _texture.needsUpdate = true;
            canvas = null;
            typeof callback === 'function' ? callback(_texture) : false;
        }
    }
    /**
     * @Description: [createInsideRing 创建内圈]
     * @Description: [createOuterRing 创建外圈] 
     * @Author: RAOYAN
     * @DateTime: 2019-08-31 16:33:36
     * @param [object] opt 宽高
     * @return [Texture] 贴图
     */
    function createInsideRing(len) {
        let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
        len = getPowNumber(len);
        canvas.width = len;
        canvas.height = len;
        let ctx = canvas.getContext("2d");
        ctx.beginPath()
        ctx.arc(len / 2, len / 2, len / 2, 0, Math.PI * 2, false);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fill();
        let _texture = new THREE.Texture(canvas);
        _texture.needsUpdate = true;
        return _texture
    }
    /**
     * [createOuterRing 创建外光圈样式]
     * @Author   RAOYN
     * @DateTime 2019-09-04
     * @param    {[number]}   len [长度]
     * @return   {[texture]}       [纹理]
     */
    function createOuterRing(len, bi = 0.1) {
        let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
        len = getPowNumber(len);
        canvas.width = len;
        canvas.height = len;
        let ctx = canvas.getContext("2d");
        ctx.beginPath()
        ctx.arc(len / 2, len / 2, len / 2, 0, Math.PI * 2, false);
        let canvasGradient = ctx.createRadialGradient(len / 2, len / 2, len / 2, len / 2, len / 2, len / 4);
        canvasGradient.addColorStop(0, "rgba(255,255,255,1)");
        canvasGradient.addColorStop(bi, "rgba(255,255,255,0)");
        canvasGradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = canvasGradient;
        ctx.fill();
        let _texture = new THREE.Texture(canvas);
        _texture.needsUpdate = true;
        return _texture
    }
    /**
     * [createAura 创建光圈样式]
     * @Author   RAOYN
     * @DateTime 2019-09-04
     * @param    {[number]}    radnius   [半径]
     * @param    {[number]}    lineWidth [宽度]
     * @return   {[texture]}             [纹理]
     */
    function createAura(radnius, lineWidth) {
        let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
        radnius = getPowNumber(radnius);
        canvas.width = radnius;
        canvas.height = radnius;
        let ctx = canvas.getContext("2d");
        ctx.beginPath();
        let r = radnius - lineWidth;
        ctx.arc(radnius / 2, radnius / 2, r / 2, 0, Math.PI * 2, false);
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        let _texture = new THREE.Texture(canvas);
        _texture.needsUpdate = true;
        return _texture
    }
    /**
     * @Description: [initCanvas 生成canvas]
     * @Author: RAOYAN
     * @DateTime: 2019-08-31 16:50:12
     */
    function initCanvas({
        width = 256,
        height = 256
    } = opt) {
        let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
        width = getPowNumber(width);
        height = getPowNumber(height);
        return canvas;
    }
    /**
     * [createHalo 生成发光光环]
     * @Author   RAOYN
     * @DateTime 2019-09-05
     * @param    {String}   color [颜色] 
     */
    function createHalo(color = "#5588aa") {
        let colorArr = _Utils.getColorArr(color);
        let halo_Geo = new THREE.PlaneBufferGeometry(120, 120);
        let halo_Textur = createHaloEffect(150, 5); //内置默认光环样式
        let halo_Mat = new THREE.MeshBasicMaterial({
            color: colorArr[0],
            opacity: colorArr[1],
            side: THREE.DoubleSide,
            map: halo_Textur,
            transparent: true,
            depthTest: false,
            blending: THREE.AdditiveBlending
        });
        thm.haloMesh = new THREE.Mesh(halo_Geo, halo_Mat);
        thm.haloMesh.rotation.x = -Math.PI / 2;
        thm.haloMesh.position.y = 30;
        thm.haloMesh.name = "halo";
        thm.layout.add(thm.haloMesh);

        let haloAura = createAura(120, 4);
        // 添加光环 
        let haloAura_Geo = new THREE.PlaneBufferGeometry(108, 108);
        let haloAura_Textur = createAura(120, 1.5);
        let haloAura_Mat = new THREE.MeshBasicMaterial({
            color: colorArr[0],
            opacity: colorArr[1],
            side: THREE.DoubleSide,
            map: haloAura_Textur,
            transparent: true,
            depthTest: false,
            blending: THREE.AdditiveBlending
        });
        thm.haloAuraMesh = new THREE.Mesh(haloAura_Geo, haloAura_Mat);
        thm.haloAuraMesh.rotation.x = -Math.PI / 2;
        thm.haloAuraMesh.position.y = 30;
        thm.haloAuraMesh.name = "haloAura";
        thm.layout.add(thm.haloAuraMesh);
    }
    /**
     * [createHaloEffect 创建光环特效  位置位于中间 有光效的圆]
     * @Author   RAOYN
     * @DateTime 2019-09-04
     * @param    {number}   radius    [半径]
     * @param    {number}   lineWidth [宽度]
     * @return   {document}           [canvas]
     */
    function createHaloEffect(radius, lineWidth) {
        let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
        radius = getPowNumber(radius);
        canvas.width = radius;
        canvas.height = radius;
        let ctx = canvas.getContext("2d");
        //光环
        let center = radius / 2; //center
        let len = 15;
        radius = radius / 2 - len * 2;
        for (let i = 0; i < len; i++) {
            addArc((i / len), radius + i);
            addArc((i / len), radius - i + len * 2 + 1);
        }

        function addArc(opacity, r) {
            ctx.beginPath()
            ctx.arc(center, center, r, 0, Math.PI * 2, false);
            ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
            ctx.stroke();
        }
        //光晕
        let _texture = new THREE.Texture(canvas);
        _texture.needsUpdate = true;
        return _texture
    }
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
    function drawCircle(dot, r, Ratio, len) {
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