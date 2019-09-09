var Basic_Config = {
    controls: {

    },
    background: {
        color: '#000',
        opacity: 1.0,
    },
    camera: {
        fov: 45,
        near: 1,
        far: 20000,
        position: [164, 386, 428]
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
        insideColor: "", //内圈颜色
        outerColor: "", //外圈颜色
        insideImg: "./image/center.png", //内圈图片
        insideX: 0, //内圈图片坐标相对位置
        insideY: 0, //内圈图片坐标相对位置
        insideZ: 0, //内圈图片坐标相对位置
        cube: "1", //立方体样式
        cubeStyle: 2, //立方体皮肤 内置 1 立方体
        cubeStyleAssets:"./image/texture-atlas.jpg",
        cubeSize: 15, //立方体大小
        cubeNumber: 20, //立方体数量
        aureColor: "", //光环颜色
        aureeffectColor: "", //光环特效颜色
        lineStyle:"dashed", //线条样式  实线 虚线
        lineColor: "rgba(255,255,50,0.4)", //线条颜色
        lightEffect: "", //光效样式
        lightDotColor:"",
        lightColor: "", //光效颜色
        lightPth: "", //光效方向
        lightSpeed: "", //光效速度
        chassisRotate: "", //旋转方向 旋转方向 1 正 2反 0 停
        chassisRotateSpeed: "", //旋转速度
        labelSize: 14, //标签大小
        labelColor: "#fff", //标签颜色
        labelStyle: "#fff", //标签样式
        labelBold: "#fff", //标签粗细
        labelBorderBold: "#fff", //边框粗细
        labelMax: 10, //标签最大显示数量 
    }
};
var _Config = {};
_Config.Basic_Config = Basic_Config;
_Config.Chassis_Config = Chassis_Config;