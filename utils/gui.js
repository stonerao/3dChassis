var initGui = function(chassis) {
    let C_Layer = chassis.C_Layer;
    var _df = {
        insideColor: "", //内圈颜色
        outerColor: "", //外圈颜色
        insideImg: "./image/center.png", //内圈图片
        insideX: 0, //内圈图片坐标相对位置
        insideY: 30, //内圈图片坐标相对位置
        insideZ: 0, //内圈图片坐标相对位置
        cube: "1", //立方体样式
        cubeStyle: 1, //立方体皮肤 内置 1 立方体 2椎体  3圆 节点样式  
        cubeStyleAssets: "./image/texture-atlas.jpg",
        cubeSize: 25, //立方体大小
        cubeNumber: 20, //立方体数量
        cubeLook: 1, //1 朝中心点  
        cubeColor: "#ff0000", //模型颜色
        pointColor: "#ff0000", //粒子颜色
        pointNumber: 20, //粒子数量
        pointSpeed: 1, //粒子数量
        aureColor: "#ff0000", //光环颜色
        aureeffectColor: "#ff0000", //光环特效颜色
        lineStyle: "dashed", //线条样式  实线 虚线
        lineColor: "rgba(255,255,50,0.4)", //线条颜色
        lightEffect: "", //光效样式
        lightDotColor: "#ff0000",
        lightColor: "#ff0000", //光效颜色
        lightSize: 120, //光环大小
        lightPth: "", //光效方向
        lightSpeed: "", //光效速度
        chassisRotate: 0, //旋转方向 旋转方向 1 正 2反 0 停
        chassisRotateSpeed: 1, //旋转速度
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
    const imgItems = ['d1','d2','d3','d4','d5','d6']
    centerGui.add(_df, "insideImg",imgItems ).onChange(function(elem) {
         C_Layer.setStyle({
                insideImg: "./image/"+elem+".png"
            })
    })

    centerGui.add(_df, "insideX", -60, 30, 1).onChange(function(elem) {
        C_Layer.setStyle({
            insideX: elem
        })
    })
    centerGui.add(_df, "insideY", -60, 60, 1).onChange(function(elem) {
        C_Layer.setStyle({
            insideY: elem
        })
    })
    centerGui.add(_df, "insideZ", -60, 60, 1).onChange(function(elem) {
        C_Layer.setStyle({
            insideZ: elem
        })
    })
    centerGui.addColor(_df, "aureColor").onChange(function(elem) {
        C_Layer.setStyle({
            aureColor: elem
        })
    })
    centerGui.add(_df, "lightSize", 1, 250, 1).onChange(function(elem) {
        C_Layer.setStyle({
            lightSize: elem
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
     lineGui.addColor(_df, "lightDotColor").onChange(function(elem) {
        C_Layer.setStyle({
            lightDotColor: elem
        })
    }) 
    var PointGui = gui.addFolder("外");
    //粒子
    PointGui.addColor(_df, 'pointColor').onChange(function(elem) {
        C_Layer.setStyle({
            pointColor: elem
        })
    })
    //粒子
    PointGui.add(_df, 'pointNumber', 1, 100, 1).onChange(function(elem) {
        C_Layer.setStyle({
            pointNumber: elem
        })
    })
    PointGui.add(_df, 'pointSpeed', 1, 50, 1).onChange(function(elem) {
        C_Layer.setStyle({
            pointSpeed: elem
        })
    })
    var cubeGui = gui.addFolder("立方体");
    cubeGui.add(_df, 'cubeSize', 1, 100, 1).onChange(function(elem) {
        C_Layer.setStyle({
            cubeSize: elem
        })
    })
    cubeGui.add(_df, 'cubeLook', [1, 2]).onChange(function(elem) {
        C_Layer.setStyle({
            cubeLook: elem
        })
    })
    cubeGui.add(_df, 'cubeStyle', [1, 2, 3]).onChange(function(elem) {
        C_Layer.setStyle({
            cubeStyle: elem
        })
    })
    cubeGui.add(_df, 'cubeNumber', 1, 30, 1).onChange(function(elem) {
        C_Layer.setStyle({
            cubeNumber: elem
        })
    })
    const assets = [
        "./image/texture-atlas.jpg",
        "./image/d1.png",
        "./image/d2.png",
        "./image/d3.png",
        "./image/d4.png",
        "./image/d5.png",
        "./image/d6.png",
    ]
    cubeGui.add(_df, 'cubeStyleAssets', assets).onChange(function(elem) {
        C_Layer.setStyle({
            cubeStyleAssets: elem
        })
    })
    cubeGui.addColor(_df, 'cubeColor', assets).onChange(function(elem) {
        C_Layer.setStyle({
            cubeColor: elem
        })
    })
    var floorGui = gui.addFolder("底板");
    floorGui.add(_df, 'outerFloor', 1, 300, 1).onChange(function(elem) {
        C_Layer.setStyle({
            outerFloor: elem
        })
    })
    floorGui.addColor(_df, 'outerFloorColor').onChange(function(elem) {
        C_Layer.setStyle({
            outerFloorColor: elem
        })
    })
    floorGui.add(_df, 'insideFloor', 1, 300, 1).onChange(function(elem) {
        C_Layer.setStyle({
            insideFloor: elem
        })
    })
    floorGui.addColor(_df, 'insideFloorColor', 1, 300, 1).onChange(function(elem) {
        C_Layer.setStyle({
            insideFloorColor: elem
        })
    })
    var labelGui = gui.addFolder("标签");
    /* labelSize: 14, //标签大小
        labelColor: "#fff", //标签颜色
        labelStyle: "#fff", //标签样式
        labelBold: "#fff", //标签粗细*/
    labelGui.add(_df, 'labelShow', [true, false]).onChange(function(elem) {
        C_Layer.setStyle({
            labelShow: elem
        })
    })
    labelGui.add(_df, 'labelSize',1,50,1).onChange(function(elem) {
        C_Layer.setStyle({
            labelSize: elem
        })
    })
    labelGui.addColor(_df, 'labelColor' ).onChange(function(elem) {
        C_Layer.setStyle({
            labelColor: elem
        })
    })
    let arue = {
        x:0,
        y:0,
        z:0
    }
    labelGui.add(arue, 'x',-Math.PI,Math.PI,0.1 ).onChange(function(elem) {
        C_Layer.setArue(0,{ 
            x: elem
        })
    })
    labelGui.add(arue, 'y',-Math.PI,Math.PI,0.1 ).onChange(function(elem) {
        C_Layer.setArue(0,{ 
            y: elem
        })
    })
    labelGui.add(arue, 'z',-Math.PI,Math.PI,0.1 ).onChange(function(elem) {
        C_Layer.setArue(0,{ 
            z: elem
        })
    })
    let arue1 = {
        x:0,
        y:0,
        z:0
    }
    labelGui.add(arue1, 'x',-Math.PI,Math.PI,0.1 ).onChange(function(elem) {
        C_Layer.setArue(1,{ 
            x: elem
        })
    })
    labelGui.add(arue1, 'y',-Math.PI,Math.PI,0.1 ).onChange(function(elem) {
        C_Layer.setArue(1,{ 
            y: elem
        })
    })
    labelGui.add(arue1, 'z',-Math.PI,Math.PI,0.1 ).onChange(function(elem) {
        C_Layer.setArue(1,{ 
            z: elem
        })
    })

}