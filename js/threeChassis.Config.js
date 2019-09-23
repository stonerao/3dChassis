var Basic_Config = {
    controls: {

    },
    background: {
        color: '#333',
        opacity: 1.0,
    },
    camera: {
        fov: 45,
        near: 1,
        far: 20000,
        position: [164, 386, 388]
    },
    controls: {
        enableZoom: true,
        enableRotate: true,
        autoRotate: false,
        autoRotateSpeed: 0.0,
        enableDamping: true,
        dampingFactor: 0.05,
        panSpeed: .1,
        zoomSpeed: .8,
        rotateSpeed: .05,
        distance: [50, 1000],
        polarAngle: [-Math.PI * .5, 3 * Math.PI * .5],
        azimuthAngle: [-Infinity, Infinity]
    }
};
var Chassis_Config = {
    skinOne: {
        // insideColor: "#ff0000", //内圈颜色 x
        // outerColor: "#ff0000", //外圈颜色 x 
        insideImg: "./image/d1.png", //内圈图片 v
        insideX: 0, //内圈图片坐标相对位置
        insideY: 30, //内圈图片坐标相对位置
        insideZ: 0, //内圈图片坐标相对位置
        cube: "1", //立方体样式  选择皮肤1  2 皮肤2
        cubeStyle: 1, //立方体皮肤 内置 1 立方体 2椎体  3圆 节点样式  
        cubeStyleAssets: "./image/texture-atlas.jpg",
        cubeSize: 25, //立方体大小
        cubeNumber: 20, //立方体数量
        cubeLook: 2, //1 朝中心点  
        cubeColor: "#555500", //1 朝中心点  
        pointColor: "#ff0000", //粒子颜色
        pointNumber: 20, //粒子数量
        pointSpeed: 30, //粒子速度
        aureColor: "#ff0000", //光环颜色
        // aureeffectColor: "#55ccaa", //光环特效颜色
        lineStyle: "dashed", //线条样式  实线 虚线
        lineColor: "rgba(255,255,50,0.4)", //线条颜色
        // lightEffect: "#ffffff", //光环光效样式
        // lightDotColor: "#ffffff",
        lightColor: "#ffffff", //光效颜色
        lightSize: 120, //光环大小
        lightPth: "", //光效方向 x
        lightSpeed: "", //光效速度
        chassisRotate: 1, //旋转方向 旋转方向 1 正 2反 0 停
        chassisRotateSpeed: 1, //旋转速度
        labelSize: 12, //标签大小
        labelColor: "#ff0000", //标签颜色
        labelStyle: "#ff0000", //标签样式
        labelBold: "#fff", //标签粗细
        labelBorderBold: "#fff", //边框粗细
        labelMax: 10, //标签最大显示数量 
        labelOffsetX: 0, //标签相对X位移
        labelOffsetY: 0, //标签相对Y位移
        labelOffsetZ: 0, //标签相对Z位移
        outerFloor: 175, //外圈半径
        insideFloor: 50, //内圈半径 
        data: [],
        rubik: {
            outerBorderWidth: 1, //外方块边框粗细
            outerBorderColor: "#5599aa", //外方块边框粗细
            outerColor: "rgba(255,255,255,0.8)", //外方块背景色
            row: 4, //方块行数
            col: 4, //方块列数
            plateBorderColor: "#5588aa", //板块边框颜色
            plateColor: "#5588aa", //板块颜色
            higBorderColor: "#fff", //高亮板块边框颜色
            higPlateColor: "#fff", //高亮板块颜色
            arueColor: "#fff",
            aureEffectColor: "#fff",
            dotStyle:1,//光点样式
            dotColor:"rgba(255,255,255,0.5)",

        }
    },
    skinTwo: {

    }
};
var _Config = {};
_Config.Basic_Config = Basic_Config;
_Config.Chassis_Config = Chassis_Config;