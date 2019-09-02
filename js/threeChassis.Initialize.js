; (function (global, callback) {
    window.chassisInitialize = new callback();
}(window, function (/* Chassis_Layer */) {
    /**
     * [chassisInitialize 底盘组件]
     * @Author   RAOYAN
     * @DateTime 2019-8-26 17:50:23
     * @return   {[type]}                 [description]
     * 
    */
    var chassisInitialize = function () {
        //-
        var thm = this;
        var globel = window;
        //申明必须用变量
        thm.scene;
        thm.camera;
        thm.renderer;
        thm.controls;
        //数字变量
        thm.GId = "";
        thm.Result = "";
        //图像集合

        //所有图层ID
        thm.renderID = {

        };
        //全局图层
        thm.threeLyoutObject;
        thm.layoutObject;
        //3D基础配置
        var Basic_Config = {};
        var Chassis_Config = {};
        //是否继续渲染3D
        var is_Init = true;
        /**
         * [init 初始化接口]
         * @Author   RAOYAN
         * @DateTime 2019-8-27 09:20:22
         * @param    {[string/object]}   cts    [容器id或者容器dom对象]
         * @param    {[object]}   config [配置参数]
         * @return   {[void/error]}          [初始化错误返回错误提示]
         */
        thm.init = function (cts, config) {
            var conts = cts;
            if (_Utils.detector && conts !== null) {
                try {
                    config = config || {};
                    Basic_Config = Object.assign(_Config.Basic_Config, config.Basic_Config);
                    Chassis_Config = Object.assign(_Config.Chassis_Config, config.Chassis_Config);

                    thm.parentCont = conts;
                    thm.GId += THREE.Math.generateUUID();
                    var TId = conts.attr('id') + '_' + thm.GId;
                    thm.container = _Utils.creatContainer(TId);
                    thm.parentCont.html(thm.container);

                    //initiate 
                    initiate();
                    initiateChassis();
                    //注册鼠标事件
                    thm.renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
                } catch (err) {
                    thm.Result = 'error! Initialization Error!';
                    console.log(err)
                    _Utils.creatError(conts, err);
                }
            } else {
                thm.Result = 'error! Not Support WebGL!';
            }
        }
        thm.render = function (func) {
            if (is_Init) {
                renderers(func);
            }
        };
        this.disposeRender = function () {
            if (is_Init) {
                is_Init = false;
            }
        };
        /**
		* [onContResize 更改容器大小的时候调用]
		* @Author   DUKAI
		* @DateTime 2019-8-27 14:27:59
		* @return   {[type]}                 [description]
		*/
        this.onContResize = function () {
            if (is_Init) {
                onContResize();
            }
        };

        //内部变量
        var df_Clock, df_raf;//essential
        var df_Mouse, df_Raycaster;
        var df_Width, df_Height;//当前盒子的高宽
        /**
        * [initiate 初始化，创建场景、控制器、摄像头等]
        * @Author   RAOYAN
        * @DateTime 2019-8-27 09:20:22 
        */
        function initiate() {
            df_Clock = new THREE.Clock();
            thm.scene = new THREE.Scene();
            // 获取设置width height
            var wh = getWH();
            df_Width = wh.w;
            df_Height = wh.h;

            var cameraConfig = Basic_Config.camera,
                backgroundConfig = Basic_Config.background;
            // 相机
            thm.camera = new THREE.PerspectiveCamera(cameraConfig.fov, wh.w / wh.h, cameraConfig.near, cameraConfig.far);
            thm.camera.position.set(cameraConfig.position[0], cameraConfig.position[2], cameraConfig.position[1]);
            thm.camera.lookAt(thm.scene.position);

            // renderer
            thm.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });
            // thm.renderer.shadowMap.enabled = Basic_Config.controls.shadow;
            thm.renderer.setClearColor(backgroundConfig.color, backgroundConfig.opacity);
            thm.renderer.setSize(df_Width, df_Height);
            thm.renderer.setPixelRatio(1);

            // controls 
            thm.controls = new THREE.OrbitControls(thm.camera, thm.container[0]);
            _Collects.setControls(thm.controls, Basic_Config.controls);

            thm.container.append(thm.renderer.domElement);

            df_Mouse = new THREE.Vector2();
            df_Raycaster = new THREE.Raycaster();
        }
        /**
        * [initiateChassis 创建底盘轮播组件]
        * @Author   RAOYAN
        * @DateTime 2019-8-27 14:41:02
        */
        function initiateChassis() {
            thm.layoutObject = new THREE.Group();
            thm.scene.add(thm.layoutObject);

            //初始化转盘
            thm.C_Layer = new Chassis_Layer(thm);  
            thm.C_Layer.init({
                insideImg:"./image/center.png",
                lineStyle:"dashed"
            })
        }
        /**
        * [animation 动态修改]
        * @Author   RAOYAN
        * @DateTime 2019-8-27 09:20:22
        */
        function animation(delte) {

        }
        //- renderer
        function renderers(func) {
            var fnc = _Utils.toFunction(func);
            var Animations = function () { 
                if (is_Init) {
                    var delta = df_Clock.getDelta();
                    if (delta > 0) animation(delta);
                    if (thm.controls) thm.controls.update();
                    if (TWEEN) TWEEN.update();
                    fnc.bind(thm)(delta); 
                    thm.renderer.render(thm.scene, thm.camera); 
                    globel.requestAnimationFrame(Animations);
                } else {
                    //
                    thm.renderer.dispose();
                    thm.renderer.forceContextLoss();
                    disposeScene();
                    removeEvent();
                    thm.renderer.domElement = null;
                    thm.controls.dispose();
                    thm.container.remove();
                    disposeValue();
                }
            };
            Animations();
        }
        /**
        * [onContResize 监控屏幕大小发生改变]
        * @Author   RAOYAN
        * @DateTime 2019-8-27 14:28:47
        */
        function onContResize() {
            var wh = getWH();
            df_Width = wh.w;
            df_Height = wh.h;
            thm.camera.aspect = wh.w / wh.h;
            thm.camera.updateProjectionMatrix();
            thm.renderer.setSize(wh.w, wh.h);
        }
        /**
         * [onDocumentMouse 鼠标事件]
         * @Author   RAOYAN
         * @DateTime 2019-8-27 14:22:47
         */
        function onDocumentMouse(event) {
            event.preventDefault();
            df_Mouse.x = (event.offsetX / df_Width) * 2 - 1;
            df_Mouse.y = -(event.offsetY / df_Height) * 2 + 1;
            df_Raycaster.setFromCamera(df_Mouse, thm.camera);
            return df_Raycaster
        }
        /**
         * [onDocumentMouseUp 注册鼠标点击事件]
         * @Author   RAOYAN
         * @DateTime 2019-8-27 14:22:47
         */
        function onDocumentMouseUp(event) {
            var Raycaster = onDocumentMouse(event);
        }
        /**
         * [removeEvent 离开清除事件]
         * @Author   RAOYAN
         * @DateTime 2019-8-27 09:20:22
         */
        function removeEvent() {
            thm.renderer.domElement.removeEventListener('mouseup', onDocumentMouseUp, false);
        }
        /**
         * [disposeValue 离开清除]
         * @Author   RAOYAN
         * @DateTime 2019-8-27 09:20:22
         */
        function disposeValue() {
            thm.scene = null;
            thm.camera = null;
            thm.renderer = null;
            thm.controls = null;
            thm.container = null;
            thm.parentCont = null;

            thm = null;
            renderers = null;
            if(thm.C_Layer){
                thm.C_Layer.disposeValue()
            }
        }
        /**
		 * [disposeScene 销毁场景]
		 * @Author   RAOYAN
		 * @DateTime 2019-8-27 10:45:50
		 * @return   {[type]}                 [description]
		 */
        function disposeScene() {
            df_Clock = null;
            df_raf = null;
            df_Mouse = null;
            df_Raycaster = null;
            thm.threeLyoutObject = null;
            thm.layoutObject = null;
        }
        // 获取容器宽高值
        function getWH() {
            return {
                w: thm.parentCont.width(),
                h: thm.parentCont.height()
            };
        }
    }
    return chassisInitialize;
}))