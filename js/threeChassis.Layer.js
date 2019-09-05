/*
 * @Description: [Chassis_Layer 底部轮播组件]
 * @Author: RAOYAN
 * @DateTime: 2019-08-26 17:35:42
 * @param: {[object]} 初始滑参数 {父组件this}
 */
var Chassis_Layer = function(layout) {
    var thm = this;
    //组件所使用的的group组
    thm.layout = layout.layoutObject;
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
    thm.init = function(_Config = {}) {
        //中间图
        if (_Config.hasOwnProperty("insideImg")) {
            //创建sprit 图片 位置中间
            const w = 64;
            const h = 64;
            createTexture({
                width: w,
                height: h,
                img: _Config.insideImg
            }, function(texture) {
                // 创建完成 
                let spriteMaterial = new THREE.SpriteMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                    transparent: true,
                    depthTest: false,
                });
                let sprite = new THREE.Sprite(spriteMaterial);
                sprite.scale.set(w, h, (w + h) / 2)
                thm.layout.add(sprite);
            });
        }
        //圈 内/外 
        //外圈
        let ringOuter_Geo = new THREE.PlaneBufferGeometry(chassisRadius * 2 - 50, chassisRadius * 2 - 50, 2);
        let ringOuter_Textur = createOuterRing(chassisRadius * 3, chassisRadius * 3);
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
        const cube = df_Config.cube; //图 quit
        let circleArr = drawCircle([center.x, center.z], chassisRadius, 1, cubeNumber);
        //立方体贴图
        thm.cubeMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        for (let i = 0; i < circleArr.length; i++) {
            let elem = circleArr[i];
            let geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            let cubeMesh = new THREE.Mesh(geometry, thm.cubeMaterial);
            thm.childCubeObject.add(cubeMesh);
            const vec3 = new THREE.Vector3(elem.pre[0], 0, elem.pre[1]);
            cubeMesh.position.set(vec3.x, vec3.y, vec3.z);
            cubeMesh.lookAt(new THREE.Vector3(0, 0, 0));
            cubeMesh.rotation.z = Math.PI / 4;
            cubeMesh.rotation.y = Math.PI / 4;
            //添加线段
            thm.lineArrPosition.push({
                src: center,
                dst: vec3
            })
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
        // createHaloEffect
        let halo_Geo = new THREE.PlaneBufferGeometry(120, 120);
        let halo_Textur = createHaloEffect(150, 5);
        let halo_Mat = new THREE.MeshBasicMaterial({
            color: new THREE.Color("#5588aa"),
            side: THREE.DoubleSide,
            map: halo_Textur,
            transparent: true,
            depthTest: false,
        });
        let haloMesh = new THREE.Mesh(halo_Geo, halo_Mat);
        haloMesh.rotation.x = -Math.PI / 2;
        haloMesh.position.y = 30;
        haloMesh.name = "halo";
        thm.layout.add(haloMesh);



        //添加连线 默认实线
        let linePositionArr = [];
        let line_mat = null;
        let line_mat_params = {
            color: 0xffffff,
            linewidth: 1,
        }
        let lineGeometry = new THREE.BufferGeometry();
        if (_Config.lineStyle === 'dashed') {
            line_mat = new THREE.LineDashedMaterial({
                scale: 2,
                dashSize: 4,
                gapSize: 4,
                ...line_mat_params
            });
        } else {
            line_mat = new THREE.LineBasicMaterial({
                color: 0xffffff,
                linewidth: 1,
                ...line_mat_params
            });

        }
        thm.lineArrPosition.forEach(function(elem) {
            let src = elem.src;
            let dst = elem.dst;
            linePositionArr.push(src.x, src.y, src.z);
            linePositionArr.push(dst.x, dst.y, dst.z);
        })
        lineGeometry.addAttribute("position", new THREE.Float32BufferAttribute(linePositionArr, 3))

        let lineMesh = new THREE.LineSegments(lineGeometry, line_mat);
        thm.layout.add(lineMesh);
        if (_Config.lineStyle === 'dashed') {
            lineMesh.computeLineDistances();
        }

        addHaloLine(thm.lineArrPosition)

    }
    /**
     * [animation 刷新]
     * @Author   RAOYN
     * @DateTime 2019-09-04
     * @param    {Number}   delte [每次刷新的间隔时间]
     */
    var len = 0;
    thm.animation = function(delte) {
        // console.log(delte)
        thm.haloGroup.children.forEach(function(mesh) {
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
    thm.disposeValue = function() {
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
    thm.mouseUp = function(evnet = {}, _mouse = {}) {
        var mouse = new THREE.Vector2();
        mouse.x = _mouse.x;
        mouse.y = _mouse.y;
        df_Raycaster.setFromCamera(mouse, layout.camera);
        //点击cube
        thm.clickCube(df_Raycaster)

    }
    /**
     * [clickCube 点击四周立方体事件]
     * @Author   RAOYN
     * @DateTime 2019-09-04
     * @param    {Object}   df_Raycaster [射线拾取] 
     */
    thm.clickCube = function(df_Raycaster = {}) {
        console.log(layout.camera)
        /*var intersects = df_Raycaster.intersectObjects(thm.spotGroup.children, true);
        var intersection = (intersects.length) > 0 ? intersects[0] : {};*/
        /*if(intersection.length>0){

        }*/
    }

    function addHaloLine(position) {
        console.log(position)
        position.forEach(function(elem, index) {
            //添加飞线
            // console.log(_Assets.halo)
            let haloAssets = new THREE.TextureLoader().load(_Assets.halo);

            var _MLineMater = new _MLine.MeshLineMaterial({
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
            var line = new _MLine.MeshLine();
            var geometry = new THREE.Geometry();
            for (var i = 0; i < 30; i++) {
                // cloneSrc.setLength(cloneSrc.length() - 3)
                geometry.vertices.push(new THREE.Vector3(i, i, i))
            }
            line.setGeometry(geometry);
            var mesh = new THREE.Mesh(line.geometry, _MLineMater);
            mesh.userData = {
                line: line,
                src: elem.src,
                dst: elem.dst,
                progress: 0,
                id: index
            }
            thm.haloGroup.add(mesh);
            var i = 0;
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
        _Image.onload = function() {
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
    function createOuterRing(len) {
        let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
        len = getPowNumber(len);
        canvas.width = len;
        canvas.height = len;
        let ctx = canvas.getContext("2d");
        ctx.beginPath()
        ctx.arc(len / 2, len / 2, len / 2, 0, Math.PI * 2, false);
        var canvasGradient = ctx.createRadialGradient(len / 2, len / 2, len / 2, len / 2, len / 2, len / 4);
        canvasGradient.addColorStop(0, "rgba(255,255,255,1)");
        canvasGradient.addColorStop(0.1, "rgba(255,255,255,0)");
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
        var center = radius / 2; //center
        var len = 20;
        var radius = radius / 2 - len * 2;
        for (var i = 0; i < len; i++) {
            addArc((i / 30), radius + i);
            addArc((i / 30), radius - i + len * 1.9);
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
     * @Description [drawCircle 绘制圆]
     * @Author RAOYAN
     * @param [array] dot 中心点
     * @param [float] r 半径 
     * @param [float] Ratio 椭圆
     * @param [int] len 个数
     * @param [function] callback 回调
     * @DateTime: 2019-08-31 14:00:19
     */
    function drawCircle(dot, r, Ratio, len) {
        var pstart = [dot[0] + r, dot[1]]; //起点
        var pre = pstart;
        let total = 360
        let arr = [];
        for (var i = 0; i < 360; i += total / len) {
            var rad = i * Math.PI / 180 + Math.PI / 1.9;
            var cur = [r * Math.cos(rad) + dot[0], Ratio * r * Math.sin(rad) + dot[1]];
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