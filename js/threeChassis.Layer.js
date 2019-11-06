/**
 * [Chassis_Layer 底部轮播组件]
 * @Author   RAOYN
 * @DateTime 2019-09-06
 * @param    {object}   layout [初始滑参数 父组件this]
 */
/*
    //需要引入的文件
    _Config=>_Config.basic

*/
let basicConfig = _Config.Chassis_Config.basic;
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
    //文字
    thm.spriteGroup = new THREE.Group();
    thm.layout.add(thm.spriteGroup);
    //灯光组
    thm.lightGroup = new THREE.Group();
    thm.layout.add(thm.lightGroup);
    thm.layersObject = new THREE.Group();
    thm.layersArray = []; //图层
    thm.layersOrder = []; //图层顺序
    thm.layout.add(thm.layersObject);
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
    //转盘旋转方向 正为顺时针  负为逆时针 0为不懂    
    thm.chassisRotateSpeed = 0;

    //line
    let _Line = null;

    /**
     * [init 调用方法，根据不同的参数生成不同的样式]
     * @Author   RAOYN
     * @DateTime 2019-09-04
     * @param    {Object}   _Config [调用组件所传递的参数，没传递的参数使用默认参数]
     */
    thm.Cube3D = null;
    thm.PointCube = null;
    circleArr = [];
    thm.init = function (_Config = {}, _Option) {
        df_Config = _Utils.setParms(df_Config, _Config);
        df_Config = _Utils.setParms(df_Config, _Option);
        const outerFloor = df_Config.outerFloor || chassisRadius - 25;
        const insideFloor = df_Config.insideFloor || 50;
        //需要抽  
        //判断当前需要哪一种皮肤 
        switch (~~df_Config.cube) {
            case 1:
                //中间图  
                createInsideImg(df_Config.insideImg, {
                    x: df_Config.insideX,
                    y: df_Config.insideY,
                    z: df_Config.insideZ,
                    width: df_Config.insideSize,
                    height: df_Config.insideSize,
                    DPI: 1
                });
                break;
            case 2:
                thm.threeCube = new initCube(thm.layout, df_Config.rubik);
                thm.Cube3D = thm.threeCube.layou;
                thm.PointCube = thm.threeCube.point;
                // thm.Cube3D.name = "cube3d"
                thm.layout.add(thm.threeCube.init())
                break;
        }


        //地板 外
        createCircleFloor({
            radius: outerFloor,
            color: df_Config.outerFloorColor
        })
        //地板 内
        createInsideFloor({
            color: df_Config.insideFloorColor,
            radius: insideFloor,
            gap: 7
        })

        //创建中间光效光环 
        createHalo(df_Config.aureColor, df_Config.lightSize);
        //生成外围的坐标角度
        let circleArr = _Utils.drawCircle([0, 0], basicConfig.radius, 1, df_Config.cubeNumber);
        //创建 外围物体 
        let ambient = new initAmbient(thm.layersObject);
        ambient.init({
            size: df_Config.cubeSize,
            look: df_Config.cubeLook,
            image: df_Config.cubeStyleAssets,
            number: df_Config.cubeNumber,
            color: "rgba(255,255,255,1)",
            data: df_Config.data,
            position: circleArr,
            type: df_Config.cubeStyle,
            radius: basicConfig.radius
        })
        //创建连线
        let Lines = new initLine(thm.layersObject);
        Lines.init(circleArr, {
            type: df_Config.lineStyle,
            color: df_Config.lineColor,
            centerRadius: 30,
            curve: 0
        })
        /* 
                const cubePosition = createCube({
                    color: "#fff",
                    style: df_Config.cubeStyle,
                    size: df_Config.cubeSize,
                    number: df_Config.cubeNumber,
                    look: df_Config.cubeLook,
                    assets: df_Config.cubeStyleAssets,
                    radius: basicConfig.radius,
                    isLoadText: true,
                    data: df_Config.data
                }) */
        // shaderOuterPonint(cubePosition, df_Config.pointColor, df_Config.cubeSize);
        //创建连线线条 
        // createGradientLine(df_Config.lineStyle, df_Config.lineColor);
        // 初始化参数
        let haloAssets = new THREE.TextureLoader().load('./image/50.png');
        _Line = new initLinePoint({
            layout: thm.layout
        })
        _Line.add({
            point: {},
            data: thm.lineArrPosition,
            line: {
                style: df_Config.lineStyle,
                color: df_Config.lineColor,
                gradient: 0,
            },
            fly: {
                show: df_Config.flyShow,
                texture: new THREE.TextureLoader().load("./image/point.png"),
                size: df_Config.flySize,
                speed: df_Config.flySpeed,
                lenth: df_Config.flyLength,
                dpi: df_Config.flyDpi
            },
            point: {
                show: df_Config.pointShow,
                texture: haloAssets,
                size: df_Config.pointSize,
                height: df_Config.pointHeight,
                color: df_Config.pointColor,
                number: df_Config.pointNumber,
                speed: df_Config.pointSpeed
            }
        })
        //添加连线 默认实线
        //添加飞线 
        // addHaloLine(thm.lineArrPosition); 
        addLight()
    }
    /**
     * [animation 刷新]
     * @Author   RAOYN
     * @DateTime 2019-09-04
     * @param    {Number}   delte [每次刷新的间隔时间]
     */
    let len = 0;
    thm.animation = function (delta) {
        //旋转
        if (thm.chassisRotateSpeed != 0) {
            thm.layout.rotation.y += thm.chassisRotateSpeed;
        }
        // 飞线
        /* thm.haloGroup.children.forEach(function(mesh) {
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
         })*/
        if (thm.fly) {
            thm.fly.animation(delta, function () {
                thm.point.addPoint(new THREE.Vector3(0, Math.random() * 30, 0));
            })
        }
        if (_Line) {
            _Line.animation(delta)
        }
        if (thm.point) {
            thm.point.animation(delta, function () {

            })
        }
        if (thm.pointMesh) {
            thm.pointMesh.material.uniforms.time.value += 0.001;
        }
        if (thm.threeCube) {
            thm.threeCube.animation()
        }
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
        // console.log(layout.camera)
        /*var intersects = df_Raycaster.intersectObjects(thm.spotGroup.children, true);
        var intersection = (intersects.length) > 0 ? intersects[0] : {};*/
        /*if(intersection.length>0){

        }*/
    }
    thm.setArue = function (index, opt) {
        thm.threeCube.setArue(index, opt)
    }
    /**
     * [setStyle 修改转盘中的样式]
     * @Author   RAOYN
     * @DateTime 2019-09-05
     * @param    {Object}   option [所需要修改的样式，根据样式修改对应的]
     */
    thm.setStyle = function (option) {
        //update config
        df_Config = _Utils.setParms(df_Config, option);
        ////////
        // 基础 //
        ////////
        //旋转方向 0为不运动  -1 为逆时针 0为顺时针
        if (option.hasOwnProperty("chassisSetRotate")) {
            let n = _Utils.parseNumber(option.chassisSetRotate);
            thm.chassisRotateSpeed = n * 0.001;
        }
        ///////
        //中心 //
        ///////
        //更换中间样式图片
        if (option.hasOwnProperty("insideImg")) {
            const w = 90;
            const h = 90;
            createTexture({
                width: 512,
                height: 512,
                img: option.insideImg
            }, function (texture) {
                // 创建完成 
                let m = thm.insidePoint.material;
                let spriteMaterial = new THREE.SpriteMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                    transparent: true,
                    depthTest: true,
                });
                thm.insidePoint.material = spriteMaterial;
                thm.insidePoint.scale.set(w, h, 0);
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
        //中线物体的大小
        if (option.hasOwnProperty("insideSize")) {
            let size = option.insideSize;
            thm.insidePoint.scale.set(size, size, size);
        }
        //中线的颜色
        if (option.hasOwnProperty("aureColor")) {
            let color = _Utils.getColorArr(option.aureColor)
            thm.haloMesh.material.color = color[0];
            thm.haloMesh.material.opacity = color[1];
            thm.haloMesh.material.needsUpdate = true;
        }
        if (option.hasOwnProperty("lightSize")) {
            const size = option.lightSize;
            thm.haloMesh.scale.set(size, size, size);
        }


        ///////
        //线条 //
        ///////
        //修改线条样式
        if (option.hasOwnProperty("lineStyle")) {
            //材质 
            _Line.update("line", {
                type: option.lineStyle
            })
        }
        //修改线条颜色
        if (option.hasOwnProperty("lineColor")) {
            let colorArr = _Utils.getColorArr(option.lineColor);
            _Line.update("line", {
                color: option.lineColor
            })
        }
        //改变飞线长度个数
        if (option.hasOwnProperty("flyLength")) {
            _Line.update("fly", {
                flyLength: option.flyLength
            })
        }
        //改变飞线粒子大小
        if (option.hasOwnProperty("flySize")) {
            _Line.update("fly", {
                flySize: option.flySize
            })
        }
        if (option.hasOwnProperty("flyColor")) {
            _Line.update("fly", {
                flyColor: option.flyColor
            })
        }
        if (option.hasOwnProperty("flyOrder")) {
            _Line.update("fly", {
                flyOrder: JSON.parse(option.flyOrder)
            })
        }
        if (option.hasOwnProperty("pointColor")) {
            _Line.update("point", {
                pointColor: option.pointColor
            })
        }
        if (option.hasOwnProperty("pointSize")) {
            _Line.update("point", {
                pointSize: option.pointSize
            })
        }
        if (option.hasOwnProperty("pointSpeed")) {
            _Line.update("point", {
                pointSpeed: option.pointSpeed
            })
        }
        if (option.hasOwnProperty("pointNumber")) {
            _Line.update("point", {
                pointNumber: option.pointNumber
            })
        }
        if (option.hasOwnProperty("pointHeight")) {
            _Line.update("point", {
                pointHeight: option.pointHeight
            })
        }

        //修改粒子颜色
        /* if (option.hasOwnProperty("pointColor")) {
            const colorArr = _Utils.getColorArr(option.pointColor);
            thm.pointMesh.material.uniforms.color.value = colorArr[0];
            thm.pointMesh.material.uniforms.alphas.value = colorArr[1];
        } */
        //立方体
        if (option.hasOwnProperty("cubeSize")) {
            const size = option.cubeSize;
            thm.spriteGroup.position.y = size * 1.2;
            thm.childCubeObject.children.forEach(function (elem) {
                if (elem.name == 'cone') {
                    elem.scale.set(size / 1.7, size, size / 1.7);
                } else {
                    elem.scale.set(size, size, size);
                }
                elem.position.y = size / 2;
            })
        }

        if (option.hasOwnProperty("cubeNumber")) {
            //修改立方体数量
            const cubeNumber = option.cubeNumber;

            circleArr = drawCircle([center.x, center.z], chassisRadius, 1, cubeNumber);
            let position = getVecsPosition(circleArr);
            //更新线条 
            let vecs = [];
            position.forEach(function (elem) {
                vecs.push({
                    src: center,
                    dst: elem
                })
            })
            setLineGeometry(vecs);
            removeHaloLine()
            addHaloLine(vecs);
            //跟新点
            //确定当前类型
            let styleName = getCubeStyle(df_Config.cubeStyle);
            let cubeChild = thm.childCubeObject.children.filter(elem => elem.name == styleName);

            if (cubeChild.length < cubeNumber) {
                //根据当前类型 重新添加 
                for (let i = cubeChild.length; i < cubeNumber; i++) {
                    let mesh = cubeChild[0].clone();
                    thm.childCubeObject.add(mesh);
                    mesh.visible = true;
                    mesh.position.set(...Object.values(position[i - 1]))
                    if (df_Config.data[i]) {
                        let colorArr = _Utils.getColorArr(df_Config.labelColor);
                        let elem = df_Config.data[i];
                        let spriteMap = addSpriteText(elem.name, 24, "#fff");
                        let WH = textureToWH(spriteMap);
                        let spriteMaterial = new THREE.SpriteMaterial({
                            map: spriteMap,
                            color: colorArr[0],
                            opacity: colorArr[1],
                            depthTest: true,
                        });
                        let fontsize = df_Config.labelSize;
                        let sprite = new THREE.Sprite(spriteMaterial);
                        sprite.userData = {
                            width: WH.width / WH.height,
                            height: 1
                        }
                        sprite.scale.set(WH.width / WH.height * fontsize, 1 * fontsize);
                        sprite.position.set(...Object.values(position[i - 1]));
                        thm.spriteGroup.add(sprite);

                        spriteMap.dispose();
                        spriteMap = null;
                    }

                }
            }
            let cubeArr = thm.childCubeObject.children.filter(elem => elem.name == styleName);
            cubeArr.forEach(function (elem, index) {
                if (cubeArr.length >= cubeNumber) {
                    if (index >= cubeNumber) {
                        elem.visible = false;
                        if (thm.spriteGroup.children[index]) {
                            thm.spriteGroup.children[index].visible = false;
                        }

                    } else {
                        elem.visible = true;
                        const p = vecs[index].dst;
                        elem.position.set(p.x, p.y + df_Config.cubeSize / 2, p.z);
                        if (thm.spriteGroup.children[index]) {
                            thm.spriteGroup.children[index].visible = true;
                            thm.spriteGroup.children[index].position.set(p.x, p.y, p.z);
                        }
                    }
                }

            })
            //修改粒子 
            setPointVecs(position)
            option.cubeLook = df_Config.cubeLook;
        }
        //立方体
        if (option.hasOwnProperty("cubeLook")) {
            thm.childCubeObject.children.forEach(function (elem) {
                let vec3 = [0, 0, 0]
                if (option.cubeLook == 1) {
                    vec3 = [0, df_Config.cubeSize / 2, 0]
                } else {
                    vec3 = Object.values(elem.position)
                }
                elem.lookAt(new THREE.Vector3(...vec3));
            })
        }
        //样式
        if (option.hasOwnProperty("cubeStyle")) {
            const style = parseInt(option.cubeStyle);
            if (typeof style != 'number' || isNaN(style)) return;
            let styleName = getCubeStyle(style);
            //创建 外围物体
            //检查是否已有当前类型的物体
            if (thm.childCubeObject.children.filter(elem => elem.name == styleName).length == 0) {
                createCube({
                    color: "#fff",
                    style: df_Config.cubeStyle,
                    size: df_Config.cubeSize,
                    number: df_Config.cubeNumber,
                    look: df_Config.cubeLook,
                    assets: df_Config.cubeStyleAssets,
                    radius: 200,
                    isLoadText: false,
                    data: df_Config.data
                })
            }

            //选择到类型的显示 否则隐藏
            thm.childCubeObject.children.forEach(function (elem) {
                if (elem.name == styleName) {
                    elem.visible = true;
                } else {
                    elem.visible = false
                }
            })
        }
        //修改盒子图片
        if (option.hasOwnProperty("cubeStyleAssets")) {
            let textur = new THREE.TextureLoader().load(option.cubeStyleAssets);
            const styleName = getCubeStyle(parseInt(df_Config.cubeStyle));
            const child = thm.childCubeObject.children.filter(elem => elem.name == styleName);
            child.forEach(function (elem) {
                if (elem.type == "Mesh") {
                    elem.material.map = textur;
                    elem.material.needsUpdate = true;
                }
                if (elem.type == 'Group') {
                    elem.children[0].material.map = textur;
                    elem.children[0].material.needsUpdate = true;
                }
            })
            //dispose 
            textur.dispose();
            textur = null;
        }
        if (option.hasOwnProperty("cubeColor")) {
            let colorArr = _Utils.getColorArr(option.cubeColor);
            thm.childCubeObject.children.forEach(function (elem) {
                if (elem.type == "Mesh") {
                    elem.material.color = colorArr[0];
                    elem.material.opacity = colorArr[1];
                    elem.material.needsUpdate = true;
                }
                if (elem.type == 'Group') {
                    elem.children[0].material.color = colorArr[0];
                    elem.children[0].material.opacity = colorArr[1];
                    elem.children[0].material.needsUpdate = true;
                }
            })
        }
        //修改底板
        if (option.hasOwnProperty("outerFloor")) {
            const scale = option.outerFloor * 2;
            thm.ringOuterMesh.scale.set(scale, scale, scale);
        }
        if (option.hasOwnProperty("insideFloor")) {
            const scale = option.insideFloor * 2;
            const gap = 20;
            thm.ringInsiderMesh.scale.set(scale, scale, scale);
            thm.auraMesh.scale.set(scale + gap, scale + gap, scale + gap);
        }
        //外颜色
        if (option.hasOwnProperty("outerFloorColor")) {
            let colorArr = _Utils.getColorArr(option.outerFloorColor);
            thm.ringOuterMesh.material.color = colorArr[0];
            thm.ringOuterMesh.material.opacity = colorArr[1];
        }
        //nei 颜色
        if (option.hasOwnProperty("insideFloorColor")) {
            let colorArr = _Utils.getColorArr(option.insideFloorColor);
            thm.ringInsiderMesh.material.color = colorArr[0];
            thm.ringInsiderMesh.material.opacity = colorArr[1];
            thm.auraMesh.material.color = colorArr[0];
            thm.auraMesh.material.opacity = colorArr[1];
        }
        //label
        //是否显示标签
        if (option.hasOwnProperty("labelShow")) {
            thm.spriteGroup.visible = JSON.parse(option.labelShow);
        }
        if (option.hasOwnProperty("labelSize")) {
            const size = option.labelSize;
            thm.spriteGroup.children.forEach(function (elem) {
                const data = elem.userData
                elem.scale.set(data.width * size, data.height * size);
            })
        }
        if (option.hasOwnProperty("labelColor")) {
            let colorArr = _Utils.getColorArr(option.labelColor);
            thm.spriteGroup.children.forEach(function (elem) {
                elem.material.color = colorArr[0];
                elem.material.opacity = colorArr[1];
            })
        }
    }

    /**
     * [createCube 创建外圈立方体]
     * @Author   RAOYN
     * @DateTime 2019-09-17
     * @param    {Object}    option  [所有参数 color 颜色 style 样式 number 数量 size 大小 look 朝向 isLoadText 是否加载文字]
     * @return   {Array}             [返回所有点的坐标值]
     * 
     */
    function createCube(option) {
        //立方体 
        const cubeNumber = option.number; //根数
        const cubeSize = option.size; //大小
        const cubeStyle = parseInt(option.style); //样式 quit
        const cubeStyleAssets = option.assets; //样式 quit 
        const radius = option.radius; //样式 quit 
        const isLoadText = option.isLoadText; //样式 quit 
        let data = option.data || [];
        circleArr = drawCircle([center.x, center.z], radius, 1, cubeNumber);
        thm.lineArrPosition = [];
        //立方体贴图 
        //添加中心点到四周立方体的线段
        for (let i = 0; i < circleArr.length; i++) {
            let elem = circleArr[i];
            elem.name = data[i].name;
            const vec3 = new THREE.Vector3(elem.pre[0], 0, elem.pre[1]);
            //获取连线的顶点
            thm.lineArrPosition.push({
                src: center,
                dst: vec3,
            })
            if (isLoadText) {
                //添加sprite 名字
                let colorArr = _Utils.getColorArr(df_Config.labelColor);
                let spriteMap = addSpriteText(elem.name, 24, "#fff");
                let WH = textureToWH(spriteMap);
                let spriteMaterial = new THREE.SpriteMaterial({
                    map: spriteMap,
                    color: colorArr[0],
                    opacity: colorArr[1],
                    depthTest: false,
                    transparent: true
                });
                let sprite = new THREE.Sprite(spriteMaterial);
                let fontsize = df_Config.labelSize
                sprite.userData = {
                    width: WH.width / WH.height,
                    height: 1
                }
                sprite.scale.set(WH.width / WH.height * fontsize, 1 * fontsize);
                sprite.position.set(vec3.x, vec3.y, vec3.z);
                thm.spriteGroup.add(sprite);
            }
        }
        if (isLoadText) {
            thm.spriteGroup.position.y = cubeSize * 1.2;
        }
        //根据样式不同 创建不同的外圈模型
        thm.cubeMaterial;
        switch (cubeStyle) {
            //立方体
            case 1:
                createOuterCube(circleArr, cubeSize, cubeStyleAssets);
                break;
            case 2:
                //椎体  
                createOuterCone(circleArr, cubeSize, cubeStyleAssets);
                break;
            case 3:
                // 圆
                createOuterCircle(circleArr, cubeSize, cubeStyleAssets);
        }
        //粒子
        /* let position = circleArr.map(function(elem) {
             return new THREE.Vector3(elem.pre[0], 0, elem.pre[1]);
         });
         return position;*/
    }
    /**
     * [createInsideFloor 添加内圈圆圈]
     * @Author   RAOYN
     * @DateTime 2019-09-17
     * @param    {Object}    option  [所有参数 color 颜色 map 贴图（可传图）radius 半径]
     */
    function createInsideFloor(option) {
        const radius = option.radius || chassisRadius;
        const gap = option.gap || 20;
        const colorArr = _Utils.getColorArr(option.color);
        let ringInsider_Geo = new THREE.PlaneBufferGeometry(1, 1, 2);
        //如果当前没有传递贴图  使用默认 自己创建
        let map = null;
        if (!option.hasOwnProperty('map')) {
            map = createInsideRing(radius * 3);
        } else {
            map = new THREE.TextureLoader().load(option.map);
        }
        //内圈  
        let ringInsider_Mat = new THREE.MeshBasicMaterial({
            color: colorArr[0],
            opacity: colorArr[1],
            map: map,
            side: THREE.DoubleSide,
            transparent: true,
            // depthTest: false,
        });
        thm.ringInsiderMesh = new THREE.Mesh(ringInsider_Geo, ringInsider_Mat);
        thm.ringInsiderMesh.rotation.x = -Math.PI / 2;
        thm.ringInsiderMesh.name = "insiderRing";
        thm.ringInsiderMesh.scale.set(radius * 2, radius * 2, radius * 2);
        thm.ringInsiderMesh.position.y = 1;
        thm.layout.add(thm.ringInsiderMesh);
        /* // 添加光环 
         let aura_Geo = new THREE.CircleBufferGeometry(1, 32);
         let aura_Textur = createAura(150, 3);
         let aura_Mat = new THREE.MeshBasicMaterial({
             color: colorArr[0],
             opacity: colorArr[1],
             side: THREE.DoubleSide,
             map: aura_Textur,
             transparent: true,
             blending: THREE.AdditiveBlending
             // depthTest: false,
         });
         thm.auraMesh = new THREE.Mesh(aura_Geo, aura_Mat);
         thm.auraMesh.rotation.x = -Math.PI / 2;
         thm.auraMesh.name = "aura";
         thm.auraMesh.scale.set(radius + gap, radius + gap, radius + gap);
         thm.auraMesh.position.y = 2;
         thm.layout.add(thm.auraMesh);*/

    }
    /**
     * [createCircleFloor 添加圆圈地板]
     * @Author   RAOYN
     * @DateTime 2019-09-17
     * @param    {Object}    option  [所有参数 color 颜色 map 贴图（可传图）radius 半径]
     */
    function createCircleFloor(option) {
        const radius = option.radius || chassisRadius;
        const colorArr = _Utils.getColorArr(option.color);
        let ringOuter_Geo = new THREE.CircleBufferGeometry(1, 64);
        // let ringOuter_Geo = new THREE.PlaneBufferGeometry(1,1, 2);
        //如果当前没有传递贴图  使用默认 自己创建
        let map = null;
        if (!option.hasOwnProperty('map')) {
            map = createOuterRing({
                srcColor: "rgba(255,255,255,1)",
                dstColor: "rgba(255,255,255,0)",
                endRadius: 128,
                radius: 300
            });
        } else {
            map = new THREE.TextureLoader().load(option.map);
        }
        let ringOuter_Mat = new THREE.MeshBasicMaterial({
            color: colorArr[0],
            opacity: colorArr[1],
            side: THREE.DoubleSide,
            map: map,
            transparent: true,
            blending: THREE.AdditiveBlending
            // depthTest: false,
        });
        thm.ringOuterMesh = new THREE.Mesh(ringOuter_Geo, ringOuter_Mat);
        thm.ringOuterMesh.scale.set(radius, radius, radius);
        thm.ringOuterMesh.rotation.x = -Math.PI / 2;
        thm.ringOuterMesh.name = "outerRing";
        thm.layout.add(thm.ringOuterMesh);
    }
    /**
     * [shaderOuterPonint 添加圆]
     * @Author   RAOYN
     * @DateTime 2019-09-16  
     * @param    {Array}    vecs  [所有的顶点]
     * @param    {Color}    color [颜色]
     * @param    {Number}   size  [大小]
     */
    thm.pointMesh = null; //粒子
    function shaderOuterPonint(vecs, color, size) {
        let shader = {
            vertexshader: `uniform vec3 color;
                uniform float time;
                uniform float size; 
                uniform float speed; 
                uniform float alphas; 
                attribute float indexs;
                varying float valpha;
                varying vec3 vcolor;
                varying vec3 pos;
                void main(){ 
                    vcolor = color;
                    valpha = alphas;
                    float yp = position.y+abs(sin(time*speed+indexs))*15.0;
                    pos = vec3(position.x,yp,position.z);
                    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
                    gl_PointSize = abs( sin(time)) + size * ( 150.0 / -mvPosition.z ) ;
                    gl_Position = projectionMatrix * mvPosition; 
                }`,
            fragmentshader: ` 
                varying vec3 vcolor; 
                varying float valpha;
                uniform sampler2D texture;
                void main(){
                    gl_FragColor = vec4(vcolor,valpha);
                    gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );
                }
            `
        }
        let pointTextur = _Collects.initPoint(8);
        let radius = size / 2; //半径
        const pointN = df_Config.pointNumber || 10; //粒子数量  
        const index = [];
        const position = [];
        //position  当前索引
        vecs.forEach(elem => {
            for (let i = 0; i < pointN; i++) {
                let x = THREE.Math.randFloat(-radius, radius) + elem.x;
                let y = -size //THREE.Math.randFloat(-radius*1.5,  - radius*2.5) ;
                let z = THREE.Math.randFloat(-radius, radius) + elem.z;
                position.push(x, y, z);
                index.push(i + 3)
            }
        })
        //材质
        let colorArr = _Utils.getColorArr(color);
        var material = new THREE.ShaderMaterial({
            uniforms: {
                color: {
                    value: colorArr[0],
                    type: "c"
                },
                alphas: {
                    value: colorArr[1],
                    type: "f"
                },
                size: {
                    value: 10.0,
                    type: "f"
                },
                time: {
                    value: 0.0,
                    type: "f"
                },
                speed: {
                    value: df_Config.pointSpeed,
                    type: "f"
                },
                radius: {
                    value: radius,
                    type: "f"
                },
                texture: {
                    type: "t2",
                    value: pointTextur
                }
            },
            vertexShader: shader.vertexshader,
            fragmentShader: shader.fragmentshader,
            transparent: true,
            depthTest: false,
            blending: THREE.AdditiveBlending
        });
        //mesh
        var geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', new THREE.Float32BufferAttribute(position, 3));
        geometry.addAttribute('indexs', new THREE.Float32BufferAttribute(index, 1));
        thm.pointMesh = new THREE.Points(geometry, material);
        thm.pointMesh.userData = {
            size: size
        }
        thm.pointMesh.position.y = size / 2;
        thm.layout.add(thm.pointMesh)

    }
    /**
     * [setPointVecs 修改所有粒子的顶点]
     * @Author   RAOYN
     * @DateTime 2019-09-17
     * @param    {Array}   position [所有位置]
     */
    function setPointVecs(position) {
        const cindex = [];
        const cposition = [];
        const pointN = df_Config.pointNumber;
        const radius = df_Config.cubeSize / 2;
        const size = df_Config.cubeSize;
        //position  当前索引
        position.forEach(elem => {
            for (let i = 0; i < pointN; i++) {
                let x = THREE.Math.randFloat(-radius, radius) + elem.x;
                let y = -size //THREE.Math.randFloat(-radius*1.5,  - radius*2.5) ;
                let z = THREE.Math.randFloat(-radius, radius) + elem.z;
                cposition.push(x, y, z);
                cindex.push(i + 3)
            }
        })

        thm.pointMesh.geometry.addAttribute('position', new THREE.Float32BufferAttribute(cposition, 3));
        thm.pointMesh.geometry.addAttribute('indexs', new THREE.Float32BufferAttribute(cindex, 1));
    }
    /**
     * [createOuterCircle 添加圆体]
     * @Author   RAOYN
     * @DateTime 2019-09-09
     * @param    {Array}    positions [信息{坐标 角度 name}]
     * @param    {Array}    info      [位置信息]
     * @param    {Number}   radius    [大小]
     * @param    {[type]}   map       [贴图]
     * @param    {[type]}   text      [字体]
     * @return   {[type]}             [description]
     */
    function createOuterCircle(info = [], radius, map, text) {
        let texture = new THREE.TextureLoader().load("./image/texture-atlas.jpg");
        let material = new THREE.MeshBasicMaterial({
            color: 0xfffffff,
            transparent: true,
            opacity: 1,
            map: texture,
            depthTests: true,
            polygonOffset: true,
            polygonOffsetUnits: 10,
            polygonOffsetFactor: 5
        });
        /* texture.offset.x = 0.2;
        texture.offset.y = -0.1;  */
        // 设置阵列模式为 RepeatWrapping 
        // 设置x方向的偏移(沿着管道路径方向)，y方向默认1
        //等价texture.repeat= new THREE.Vector2(20,1) 
        let geometry = new THREE.DodecahedronBufferGeometry(15, 3)
        for (let i = 0; i < info.length; i++) {
            let elem = info[i];
            const vec3 = new THREE.Vector3(elem.pre[0], 0, elem.pre[1]);
            let group = new THREE.Group();
            let mesh = new THREE.Mesh(geometry.clone(), material.clone());
            thm.childCubeObject.add(mesh);
            mesh.name = "circle";
            mesh.position.set(vec3.x, vec3.y + radius / 2, vec3.z);
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
        var materials = [];

        for (var i = 0; i < 3; i++) {
            materials.push(new THREE.MeshBasicMaterial({
                color: new THREE.Color('rgba(255,255,255,1)'),
                transparent: true,
                opacity: 1,
                depthTests: true,
                map: i == 0 ? new THREE.TextureLoader().load("./image/cc3.png") : new THREE.TextureLoader().load("./image/cc1.png"),
                // overdraw: true
            }))
        }
        /*  let material = new THREE.MeshLambertMaterial({
            color: new THREE.Color('rgba(53,76,220,1)'),
            transparent: true,
            opacity: 1,
            depthTests: true,
            map: new THREE.TextureLoader().load("./image/texture-atlas.jpg")
        });   */
        let material = new THREE.MeshFaceMaterial(materials);
        let cone = [];
        for (let i = 0; i < info.length; i++) {
            //生成cube
            let g = new THREE.Group();
            g.name = "cone";
            thm.childCubeObject.add(g);
            let elem = info[i];
            let geometry = new THREE.ConeGeometry(1, 1, 4);
            let cubeMesh = new THREE.Mesh(geometry, material);
            console.log(cubeMesh)
            cubeMesh.rotation.z += Math.PI;
            cubeMesh.name = "point";
            g.add(cubeMesh)
            cone.push(cubeMesh)
            const vec3 = new THREE.Vector3(elem.pre[0], 0, elem.pre[1]);
            g.position.set(vec3.x, vec3.y + cubeSize / 2, vec3.z);
            // g.lookAt(new THREE.Vector3(0, 0, 0));
            g.scale.set(cubeSize / 1.7, cubeSize, cubeSize / 1.7);
        }



    }
    /**
     * [addSpriteText 添加中文字体]
     * @Author   RAOYN
     * @DateTime 2019-09-16
     * @param    {String}   text        [字]]
     * @param    {String}   fontSzie    [字体大小]
     * @param    {String}   color       [颜色]
     * @return   {Texture}              [Mesh]
     */
    function addSpriteText(text, fontSzie = 24, color = "#ffffff") {
        let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
        let height = fontSzie
        let ctx = canvas.getContext("2d");
        ctx.font = fontSzie + "px 微软雅黑";
        let offset = ctx.measureText(text);
        canvas.width = getPowNumber(offset.width);
        canvas.height = getPowNumber(height);
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.font = fontSzie + "px 微软雅黑";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(text, canvas.width / 2, 1);

        let _texture = new THREE.Texture(canvas);
        _texture.needsUpdate = true;
        return _texture
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
            map: textur,
            // depthTest: false,
            transparent: true
        });
        let materialClone = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: textur,
            // depthTest: false,
            opacity: 0.1,
            transparent: true
        });
        let position = [];
        for (let i = 0; i < positions.length; i++) {
            //生成cube
            let elem = positions[i];
            let geometry = addCube(cubeSize);
            let cubeMesh = new THREE.Mesh(geometry, material);
            thm.childCubeObject.add(cubeMesh);
            const vec3 = new THREE.Vector3(elem.pre[0], 0, elem.pre[1]);
            cubeMesh.position.set(vec3.x, vec3.y + cubeSize / 2, vec3.z);
            position.push(vec3);
            if (df_Config.cubeLook == 1) {
                cubeMesh.lookAt(new THREE.Vector3(0, cubeSize / 2, 0));
            }
            cubeMesh.name = "cube";
            cubeMesh.scale.set(cubeSize, cubeSize, cubeSize);

            //投影
            let cloneCube = cubeMesh.clone();
            thm.childCubeObject.add(cloneCube);
            cloneCube.position.y -= cubeSize + 5;
            cloneCube.material = materialClone
            /*  cubeMesh.rotation.z = Math.PI / 4;
             cubeMesh.rotation.y = Math.PI / 4; */
        }

    }
    /**
     * [createInsideImg 创建中间的sprit图层]
     * @Author   RAOYN
     * @DateTime 2019-09-05
     * @param    {[type]}   img      [图片]
     * @param    {[type]}   option   [参数 xyz坐标 width，height 宽高  DPI清晰度  值越大越大] 
     */
    function createInsideImg(img, option) {
        //创建sprit 图片 位置中间
        const w = option.width || 64;
        const h = option.height || 64;
        const dpi = option.DPI || 1;
        createTexture({
            width: 512,
            height: 512,
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
            thm.insidePoint.scale.set(w, h);
            thm.insidePoint.position.set(option.x, option.y, option.z);
            thm.layout.add(thm.insidePoint);
        });
    }



    function setLineGeometry(vecs) {
        //更新线条的顶点
        let position = []
        vecs.forEach(function (elem) {
            position.push(elem.src.x, elem.src.y, elem.src.z);
            position.push(elem.dst.x, elem.dst.y, elem.dst.z);
        })
        thm.lineMesh.geometry.addAttribute("position", new THREE.Float32BufferAttribute(position, 3))
        if (df_Config.lineStyle === 'dashed') {
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
     * [addLight 创建灯光组 默认不显示 显示某种类型的mesh才显示]
     * @Author   RAOYN
     * @DateTime 2019-09-18
     */
    function addLight() {
        var light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.4);
        thm.layout.add(light);
        var light = new THREE.AmbientLight(0xffffff); // soft white light
        thm.layout.add(light);
        let sootItems = [
            [110, 80, -230],
            [-270, 80, 130],
            [0, 80, 230],
            [0, 320, 0]
        ]
        sootItems.forEach(function (elem) {
            var spotLight = new THREE.SpotLight({
                color: 0xa5ddfa,
                intensity: 2,
                distance: 200,
                angle: 1,
                penumbra: 0.3,
                decay: 1
            });
            spotLight.position.set(...elem);
            thm.lightGroup.add(spotLight);
            spotLight.shadow.mapSize.width = 2024;
            spotLight.shadow.mapSize.height = 2024;

            spotLight.shadow.camera.near = 500;
            spotLight.shadow.camera.far = 4000;
            spotLight.shadow.camera.fov = 30;
        })

    }
    /**
     * [addCube 添加立方体 并且设置UV位置]
     * @Author   RAOYN
     * @DateTime 2019-09-05
     * @param    {Object}   _material [材质]
     * @return   {Object}             [Geometry]
     */
    function addCube(size) {
        let geometry = new THREE.BoxGeometry(1, 1, 1);
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
    thm.fly = null;
    thm.point = null;

    function addHaloLine(position = []) {
        let haloAssets = new THREE.TextureLoader().load(_Assets.halo);
        let config = {
            color: "rgba(255,255,255,1)",
            size: 10,
            length: 80,
            dpi: 2,
            speed: 2,
            img: haloAssets
        }

        // thm.fly = new initFlys({});
        /*   let items = position.map(elem => {
              return {
                  dst: [elem.src.x, elem.src.y, elem.src.z],
                  src: [elem.dst.x, elem.dst.y, elem.dst.z]
              }
          })
          let g = thm.fly.initFiy(items, config);
          thm.haloGroup.add(g); */
        // thm.point = new initPoint()
        /* let pg = thm.point.initPoint({
            size: 5,
            img: new THREE.TextureLoader().load('./image/50.png'),
            number: 130,
            height: 200
        }) */
        // thm.haloGroup.add(pg);
        /*position.forEach(function(elem, index) {
            //添加飞线 
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
                // blending: THREE.AdditiveBlending,
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
        //创建完毕销毁
        haloAssets.dispose();
        haloAssets = null;*/
    }
    /**
     * [removeHaloLine 删除所有的飞线]
     * @Author   RAOYN
     * @DateTime 2019-09-18
     * @return   {[type]}   [description]
     */
    function removeHaloLine() {
        for (let i = thm.haloGroup.children.length - 1; i >= 0; i--) {
            thm.disposeMesh(thm.haloGroup.children[i])
        }
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
     * @DateTime 2019-09-20
     * @param    {String}   options.srcColor  [其实颜色]
     * @param    {String}   options.dstColor  [结束颜色]
     * @param    {Number}   options.endRadius [结束半径]
     * @param    {Number}   options.radius    [半径]
     * @return   {[type]}                     [贴图]
     */
    function createOuterRing({
        srcColor = "rgba(255,255,255,1)",
        dstColor = "rgba(255,255,255,0)",
        endRadius,
        radius = 128
    }) {
        let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
        let len = getPowNumber(radius);
        if (!endRadius) {
            endRadius = len / 4;
        }
        canvas.width = len;
        canvas.height = len;
        let ctx = canvas.getContext("2d");
        ctx.beginPath()
        ctx.arc(len / 2, len / 2, len / 2, 0, Math.PI * 2, false);
        let canvasGradient = ctx.createRadialGradient(len / 2, len / 2, len / 2, len / 2, len / 2, endRadius);
        canvasGradient.addColorStop(0, srcColor);
        canvasGradient.addColorStop(1, dstColor);
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
     * [createHalo 生成发光光环]
     * @Author   RAOYN
     * @DateTime 2019-09-05
     * @param    {String}   color [颜色] 
     */
    function createHalo(color = "#5588aa", size = 120) {
        let colorArr = _Utils.getColorArr(color);
        let halo_Geo = new THREE.PlaneBufferGeometry(1, 1, 2);
        let halo_Textur = createHaloEffect(size * 2, 5); //内置默认光环样式
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
        thm.haloMesh.scale.set(size, size, size);
        thm.layout.add(thm.haloMesh);
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
            addArc((i / len), radius - i + len * 2 - 3);
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
     * [textureToWH 获取狂傲]
     * @Author   RAOYN
     * @DateTime 2019-09-18
     * @param    {[type]}   texture [贴图]
     * @return   {[type]}           [长宽高]
     */
    function textureToWH(texture) {
        if (texture.image.nodeName) {
            return {
                width: texture.image.width,
                height: texture.image.height
            }
        } else {
            return false
        }
    }
    /**
     * [getPowNumber 根据circle返回在3d里面坐标]
     * @Author   RAOYN
     * @DateTime 2019-09-17
     * @param    {Array}     vecs     [所有坐标]
     * @return   {Array}              [改变后成为2的n次方的数值]
     */
    function getVecsPosition(vecs = []) {
        return vecs.map(function (elem) {
            return new THREE.Vector3(elem.pre[0], 0, elem.pre[1]);
        });
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

    /**
     * [getCubeStyle 根据类型ID返回当前类型]
     * @Author   RAOYN
     * @DateTime 2019-09-18
     * @param    {Number}   tyle [数值]
     * @return   {String}        [类型]
     */
    function getCubeStyle(style) {
        style = parseInt(style)
        let styleName = "cube"; //当前样式名 
        switch (style) {
            case 1:
                //立方体
                styleName = "cube";
                break;
            case 2:
                //椎体
                styleName = "cone";
                break;
            case 3:
                //圆
                styleName = "circle";
                break;
        }
        return styleName
    }
    /**
     * [disposeMesh 删除当前模型中的材质和几何体并且返回当前模型]
     * @Author   RAOYN
     * @DateTime 2019-08-24 
     * @param    {[object]}   mesh   [元素]
     */
    thm.disposeMesh = function (mesh) {
        var meshLen = mesh.children.length;
        if (meshLen.length > 0) {
            //递归删除所有children
            for (var i = meshLen.length - 1; i >= 0; i--) {
                thm.disposeMesh(mesh.children[i]);
            }
        }

        if (mesh.material) {
            mesh.material.dispose(); //删除材质
        }
        if (mesh.geometry) {
            mesh.geometry.dispose(); //删除几何体
        }
        mesh.parent && mesh.parent.remove(mesh);
        mesh = null;
    }

}