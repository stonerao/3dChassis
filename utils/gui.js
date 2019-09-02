var initGui = function ({ lines, dots }) {

    var _df = {
        insideColor: "",//内圈颜色
        outerColor: "",//外圈颜色
        insideImg:"",//内圈图片
        cube: "",//立方体样式
        cubeStyle: "",//立方体皮肤 内置
        cubeSize: 10,//立方体大小
        cubeNumber: 20,//立方体数量
        aureColor: "",//光环颜色
        aureeffectColor: "",//光环特效颜色
        lineStyle: "",//线条样式  实线 虚线
        lineColor: "",//线条颜色
        lightEffect: "",//光效样式
        lightColor: "",//光效颜色
        lightPth: "",//光效方向
        lightSpeed: "",//光效速度
        chassisRotate: "",//旋转方向
        chassisRotateSpeed: "",//旋转速度
        labelSize: 14,//标签大小
        labelColor: "#fff",//标签颜色
        labelStyle: "#fff",//标签样式
        labelBold: "#fff",//标签粗细
        labelBorderBold: "#fff",//边框粗细
        labelMax: 10,//标签最大显示数量 
    }
    var gui = new dat.GUI();

    // dots bigdata
    var dotsGui = gui.addFolder("one");
    dotsGui.add(_df, 'size', 0, 3, 0.1).onChange(function (elem) {

    })
    dotsGui.addColor(_df, 'color', "#133718").onChange(function (elem) {

    })


}