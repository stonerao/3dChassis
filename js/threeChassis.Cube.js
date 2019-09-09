/**
 * [initCube 魔方立方体]
 * @Author   RAOYN
 * @DateTime 2019-09-08
 * @param    {object}   layout [初始滑参数 父组件this]
 */
var initCube = function (global) {
    let thm = this;
    //add group
    let layout = new THREE.Group();
    //魔方配置
    const config = {
        width: 150,
        color: 'rgba(18,115,182,1)'
    }
    //生成魔方
    thm.init = function () {
        // let box = addBasic(config.width);
        createPlaneCube();
        return layout;
    }
    function createPlaneCube() {
        //理由planne创建立方体
        let count = 6;//立方体面
        let material = new THREE.MeshBasicMaterial({
            color: 0x02ffc0,
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            opacity: 0.5
        });
        let c_m = new THREE.MeshBasicMaterial({
            color: 0x0ff000,
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            opacity: 0.7
        });
        const width = config.width;
        const radius = width / 2 + 8;
        const position = [
            [radius, 0, 0],
            [0, radius, 0],
            [0, 0, radius],
            [-radius, 0, 0],
            [0, -radius, 0],
            [0, 0, -radius]
        ]
        const conut = 3;
        const row = 3;
        for (let i = 0; i < position.length; i++) {
            let geometry = new THREE.PlaneBufferGeometry(width - 4, width - 4, 2);
            let plane = new THREE.Mesh(geometry, material);
            layout.add(plane);
            let p = position[i];
            plane.position.set(p[0], p[1], p[2]);
            plane.lookAt(new THREE.Vector3(0, 0, 0));
            const voidSize = 6;
            const gap = 4;
            let w = width / 3 - voidSize;
            for (let j = 0; j < row; j++) {
                for (let c = 0; c < conut; c++) {
                    let child = addChild(w)
                    plane.add(child);
                    child.position.set(j % 3 * w + j * gap - w - gap, c % 3 * w + c * gap - w - gap, 10);
                }
            }
        }
        function addChild(width) {
            let c_geo = new THREE.PlaneBufferGeometry(width, width, 2);
            let c_mesh = new THREE.Mesh(c_geo, c_m);
            return c_mesh;
        }
        
    }
    function createPlaneMap(){
        //创建平面贴图
        let canvas = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
        canvas.width = getPowNumber(width);
        canvas.height = getPowNumber(height);
        let ctx = canvas.getContext("2d");
        
    }
    //生成立方体
    function addBasic(size) {
        var geometry = new THREE.BoxBufferGeometry(size, size, size);
        var material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            opacity: 0.6
        });
        var cube = new THREE.Mesh(geometry, material);
        layout.add(cube);
        return cube
    }


}