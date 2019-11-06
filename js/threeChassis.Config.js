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
    basic:{
        radius:200
    },
    skinOne: {
        insideColor: "", //内圈颜色
        outerColor: "", //外圈颜色
        insideImg: "./image/d3.png", //内圈图片
        insideSize: 20, //内圈图片
        insideX: 0, //内圈图片坐标相对位置
        insideY: 30, //内圈图片坐标相对位置
        insideZ: 0, //内圈图片坐标相对位置
        cube: 1, //立方体样式
        cubeStyle: 1, //立方体皮肤 内置 1 立方体 2椎体  3圆 节点样式  
        cubeStyleAssets: "./image/texture-atlas.jpg",
        cubeSize: 25, //立方体大小
        cubeNumber: 20, //立方体数量
        cubeLook: 1, //1 朝中心点  
        cubeColor: "#ff0000", //模型颜色
        pointColor: "#ff0000", //粒子颜色 
        pointNumber: 20, //粒子数量
        pointSize: 20, //粒子数量
        pointSpeed: 1, //粒子速度
        pointHeight: 30, //粒子高度
        pointShow: true, //粒子效果是否显示
        aureColor: "#ff0000", //光环颜色
        aureeffectColor: "#ff0000", //光环特效颜色
        lineStyle: "dashed", //线条样式  实线 虚线
        lineColor: "rgba(255,255,50,1)", //线条颜色
        lightEffect: "", //光效样式
        lightDotColor: "#ff0000",
        lightColor: "#ff0000", //光效颜色
        lightSize: 120, //光环大小
        lightPth: "", //光效方向
        lightSpeed: "", //光效速度
        flyShow: true,
        flySize: 10, //飞线粒子大小
        flySpeed: 1, //飞线速度
        flyDpi: 10, //精确度  越高 线条占用越短
        flyLength: 100, //飞线长度
        flyColor: "#ff0000", //飞线颜色
        flyOrder: false, //飞线方向
        chassisSetRotate: 0, // 停0为不运动  -1 为逆时针 0为顺时针 
        labelShow: true, //是否显示标签
        labelSize: 14, //标签大小
        labelColor: "#fff", //标签颜色
        labelStyle: "#fff", //标签样式
        labelBold: "#fff", //标签粗细
        labelBorderBold: "#fff", //边框粗细
        labelMax: 10, //标签最大显示数量 
        labelOffsetX: 0, //标签相对X位移
        labelOffsetY: 0, //标签相对Y位移
        labelOffsetZ: 0, //标签相对Z位移
        outerFloor: 175, //外圈半径
        outerFloorColor: "#5588aa", //外圈颜色
        insideFloor: 50, //内圈半径
        insideFloorColor: "#5588aa", //内圈颜色
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
            dotStyle: 1, //光点样式
            dotColor: "rgba(255,255,255,0.5)"
        }
    },
    skinTwo: {

    },
    ambient: {
        size: 20,
        look: 1, 
        image: "",
        number: 20,
        color:"rgba(255,255,255,1)"
    }
};
var _Config = {};
_Config.Basic_Config = Basic_Config;
_Config.Chassis_Config = Chassis_Config;