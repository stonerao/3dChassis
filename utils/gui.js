var initGui = function(chassis) {
    let C_Layer = chassis.C_Layer;
    var _df ={
        insideColor: "", //内圈颜色
        outerColor: "", //外圈颜色
        insideImg: "./image/center.png", //内圈图片
        insideX: 0, //内圈图片坐标相对位置
        insideY: 30, //内圈图片坐标相对位置
        insideZ: 0, //内圈图片坐标相对位置
        cube: "1", //立方体样式
        cubeStyle: 1, //立方体皮肤 内置 1 立方体
        cubeStyleAssets:"./image/texture-atlas.jpg",
        cubeSize: 25, //立方体大小
        cubeNumber: 22, //立方体数量
        aureColor: "", //光环颜色
        aureeffectColor: "", //光环特效颜色
        lineStyle:"dashed", //线条样式  实线 虚线
        lineColor: "rgba(255,255,50,0.4)", //线条颜色
        lightEffect: "", //光效样式
        lightDotColor:"#fff",
        lightColor: "#fff", //光效颜色
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
        labelOffsetX:0,//标签相对X位移
        labelOffsetY:0,//标签相对Y位移
        labelOffsetZ:0,//标签相对Z位移
    }
    let _basic = {
        style: "样式一",
        color: "rgba(255,255,255,1)"
    }
    var gui = new dat.GUI();

    var basicGui = gui.addFolder("基础");
    //内置样式选择
    let _basic_style = [{
        name: "样式一",
        id: 0
    }, {
        name: "样式二",
        id: 1
    }, ]
    basicGui.add(_basic, "style", _basic_style.map(elem => elem.name)).onChange(function(elem) {
        const s = _basic_style.filter(e => e.name == elem)[0];
    })
    basicGui.addColor(_basic, "color").onChange(function(elem) {
        console.log(elem)
    })
    basicGui.add(_df, "chassisRotate", ['正', '反', '停']).onChange(function(elem) {
        if (elem == '正') {
            C_Layer.setStyle({
                chassisRotate: 1
            })
        } else if (elem == '反') {
            C_Layer.setStyle({
                chassisRotate: 2
            })
        } else {
            C_Layer.setStyle({
                chassisRotate: 0
            })
        }
    })
    basicGui.add(_df, "chassisRotateSpeed", 1, 20, 1).onChange(function(elem) {
        C_Layer.setStyle({
            chassisRotateSpeed: elem
        })
    })
    var centerGui = gui.addFolder("中心");
    centerGui.add(_df, "insideImg", ['样式一', '样式二']).onChange(function(elem) {
        if (elem == '样式一') {
            C_Layer.setStyle({
                insideImg: "./image/center.png"
            })
        } else if (elem == '样式二') {
            C_Layer.setStyle({
                insideImg: "./image/centerBox.png"
            })
        }
    })

    centerGui.add(_df, "insideX", -30, 30, 1).onChange(function(elem) {
        C_Layer.setStyle({
            insideX: elem
        })
    })
    centerGui.add(_df, "insideY", -30, 30, 1).onChange(function(elem) {
        C_Layer.setStyle({
            insideY: elem
        })
    })
    centerGui.add(_df, "insideZ", -30, 30, 1).onChange(function(elem) {
        C_Layer.setStyle({
            insideZ: elem
        })
    })
    centerGui.addColor(_df, "lightColor").onChange(function(elem) {
        C_Layer.setStyle({
            lightColor: elem
        })
    })
    centerGui.addColor(_df, "lightDotColor").onChange(function(elem) {
        C_Layer.setStyle({
            lightDotColor: elem
        })
    })
    var lineGui = gui.addFolder("线");
    //线条样式  实线  虚线 光线  光带
    let lineStyle = [{
        name: "实线",
        type: "solid"
    }, {
        name: "虚线",
        type: "dashed"
    }, {
        name: "光线",
        type: "solid"
    }, {
        name: "光带",
        type: "solid"
    }]
    lineGui.add(_df, 'lineStyle', lineStyle.map(e => e.name)).onChange(function(elem) {
        const c = lineStyle.filter(e => e.name == elem)[0];
        C_Layer.setStyle({
            lineStyle: c.type
        })
    })
    lineGui.addColor(_df, 'lineColor').onChange(function(elem) {
        C_Layer.setStyle({
            lineColor: elem
        })
    })
    // var outerGui = gui.addFolder("外圈");
}