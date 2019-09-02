/*
 * @Description: [Chassis_Layer 底部轮播组件]
 * @Author: RAOYAN
 * @DateTime: 2019-08-26 17:35:42
 * @param: {[object]} 初始滑参数 {父组件this}
 */
var Chassis_Layer = function (layout) {
    var thm = this;
    //组件所使用的的group组
    thm.layout = layout.layoutObject;
    thm.childCubeObject = new THREE.Group();
    thm.layout.add(thm.childCubeObject);
    //配置 Config  
    let df_Config = _Utils.cloneJSON(_Config.Chassis_Config.skinOne);
    //全局配置
    let center = new THREE.Vector3(0, 0, 0);//中心
    let chassisRadius = 200; //半径
    thm.lineArrPosition = [];//
    /**
     * @Author: RAOYAN
     * @Description: [initChassis 创建轮盘组件]
     * @DateTime: 2019-08-31 13:54:15
     */
    function initChassis() {

    }
    /**
     * @Description: [this.init 调用方法，根据不同的参数生成不同的样式]
     * @Author: RAOYAN 
     * @parma:(_Config) 调用组件所传递的参数，没传递的参数使用默认参数   
     * @DateTime: 2019-08-31 13:57:54
     */
    thm.init = function (_Config) {
        //中间图
        if (_Config.hasOwnProperty("insideImg")) {
            //创建sprit 图片 位置中间
            const w = 64;
            const h = 64;
            createTexture({
                width: w,
                height: h,
                img: _Config.insideImg
            }, function (texture) {
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
        const cubeNumber = df_Config.cubeNumber;//根数
        const cubeSize = df_Config.cubeSize;//大小
        const cubeStyle = df_Config.cubeStyle;//样式 quit
        const cube = df_Config.cube;//图 quit
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
        thm.lineArrPosition.forEach(function (elem) {
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
     * @Description: [createTexture 通过canvas创建纹理]
     * @Author: RAOYAN
     * @DateTime: 2019-08-31 14:44:32
     */
    function createTexture({ width = 64, height = 64, img } = opt, callback) {
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
    //圆环
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
    function initCanvas({ width = 256, height = 256 } = opt) {
        let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
        width = getPowNumber(width);
        height = getPowNumber(height);
        return canvas;
    }
    /**
    * @Description: [drawCircle 绘制圆]
    * @Author: RAOYAN
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
                pre, rad
            })
        }
        return arr
    }
    function getPowNumber(h = 2) {
        while (!((h & h - 1) == 0)) {
            h++
        }
        return h
    }
}    