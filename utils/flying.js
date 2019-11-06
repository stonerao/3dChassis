var flying = function() {
    var shader = {
        vertexshader: `
            uniform float time; 
            uniform float size;
            uniform float u_len;
            attribute float uindex;
            varying float u_index;
            varying float u_time;
            void main(){
                u_index = uindex;
                u_time = time;
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                gl_Position = projectionMatrix * mvPosition; 
                gl_PointSize = size * 300.0/(-mvPosition.z );
            }
        `,
        fragmentshader: `
            uniform sampler2D texture; 
            uniform vec3 color; 
            uniform float u_opacity; 
            uniform float u_len;
            varying float u_index;
            varying float u_time;
            void main(){
                if(u_time>u_index&&u_index>u_time-u_len){
                    float opacity = (1.0 - (u_time - u_index)/u_len)*u_opacity;
                    vec4 vcolor = vec4(color,opacity);
                    gl_FragColor = vcolor * texture2D( texture,vec2(gl_PointCoord.x,1.0-gl_PointCoord.y) );
                }
            }
        `
    }


    let clock = new THREE.Clock()

    function getLength(p1, p2) {
        let i = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) +
            (p1.y - p2.y) * (p1.y - p2.y) +
            (p1.z - p2.z) * (p1.z - p2.z));
        return i;
    }

    function getPoints(src, dst, dpi = 1, len) {
        if (!len) {
            len = src.distanceTo(dst);
        }
        len = len * dpi;
        let items = [];
        for (let i = 0; i < len; i++) {
            items.push(src.clone().lerp(dst, i / len))
        }
        items.push(dst)
        return items
    }

    function getColorArr(str) {
        if (Array.isArray(str)) return str; //error
        var _arr = [];
        str = str + '';
        str = str.toLowerCase().replace(/\s/g, "");
        if (/^((?:rgba)?)\(\s*([^\)]*)/.test(str)) {
            var arr = str.replace(/rgba\(|\)/gi, '').split(',');
            var hex = [
                pad2(Math.round(arr[0] * 1 || 0).toString(16)),
                pad2(Math.round(arr[1] * 1 || 0).toString(16)),
                pad2(Math.round(arr[2] * 1 || 0).toString(16))
            ];
            _arr[0] = new THREE.Color('#' + hex.join(""));
            _arr[1] = Math.max(0, Math.min(1, (arr[3] * 1 || 0)));
        } else if ('transparent' === str) {
            _arr[0] = new THREE.Color();
            _arr[1] = 0;
        } else {
            _arr[0] = new THREE.Color(str);
            _arr[1] = 1;
        }

        function pad2(c) {
            return c.length == 1 ? '0' + c : '' + c;
        }
        return _arr;
    }
    let goup = new THREE.Group();
    let len;
    let speed;
    this.initFly = function(lines, config) { 
        len = config.length || 120;
        let szie = config.szie || 5;
        let dpi = config.dpi || 1;
        speed = config.speed || 1;
        let texture = config.img;
        let colorArr = getColorArr(config.color);
        const addFly = (src, dst, dpi) => {
            let points = getPoints(src, dst, dpi);
            let position = [];
            let u_index = [];
            points.forEach((elem, index) => {
                position.push(elem.x, elem.y, elem.z);
                u_index.push(index)
            })
            let buffer = new THREE.BufferGeometry();
            let material = new THREE.ShaderMaterial({
                uniforms: {
                    color: {
                        value: colorArr[0]
                    },
                    time: {
                        value: 0.0,
                        type: "f"
                    },
                    size: {
                        value: szie,
                        type: "f"
                    },
                    texture: {
                        value: texture,
                        type: "t2"
                    },
                    u_len: {
                        value: len,
                        type: "f"
                    },
                    u_opacity: {
                        value: colorArr[1],
                        type: "f"
                    }
                },
                transparent: true,
                depthTest: false,
                // blending: THREE.AdditiveBlending,
                vertexShader: shader.vertexshader,
                fragmentShader: shader.fragmentshader
            });
            buffer.addAttribute("position", new THREE.Float32BufferAttribute(position, 3))
            buffer.addAttribute("uindex", new THREE.Float32BufferAttribute(u_index, 1))
            let point = new THREE.Points(buffer, material);
            point.userData = {
                len: u_index.length
            }
            goup.add(point);

        }
        lines.forEach(elem => {
            addFly(new THREE.Vector3(...elem.src), new THREE.Vector3(...elem.dst), dpi)
        })
        return goup
    }
    this.animation = (delta, callback) => {
        goup.children.forEach(elem => {
            if (elem.material.uniforms.time.value - len > elem.userData.len) {
                elem.material.uniforms.time.value = 0;
                if (typeof callback === 'function') {
                    callback(elem)
                }
            }
            elem.material.uniforms.time.value += delta * 50 * speed;
        })
    }
}
var initPoint = function() {
    var shader = {
        vertexshader: `
            uniform float time; 
            uniform float size;   
            uniform float height;   
            varying float cy;
            varying float u_size;
            void main(){ 
                cy = position.y ; 
                if(height > position.y){
                    u_size = size + position.y;
                    vec4 mvPosition = modelViewMatrix * vec4( position.x,position.y,position.z, 1.0 );
                    gl_Position = projectionMatrix * mvPosition; 
                    gl_PointSize = u_size * 300.0/(-mvPosition.z ) ;
                } 
            }
        `,
        fragmentshader: `
            uniform sampler2D texture; 
            uniform vec3 color;  
            uniform float time;
            uniform float height;   
            varying float cy;
            void main(){  
                float alphas = 1.0 - cy/height -0.1;
                vec4 vcolor = vec4(color,alphas);
                gl_FragColor = vcolor * texture2D( texture,vec2(gl_PointCoord.x,1.0-gl_PointCoord.y) );
            }
        `
    }
    let point = null;
    let pos = [];
    let height = 100;
    let number = 10;
    this.initPoint = function(opt) {
        const position = [];
        const color = new THREE.Color("#ffffff");
        const szie = opt.size || 5;
        const texture = opt.img;
        number = opt.number;
        height = opt.height;
        let material = new THREE.ShaderMaterial({
            uniforms: {
                color: {
                    value: color,
                    type: "f"
                },
                time: {
                    value: 0.0,
                    type: "f"
                },
                size: {
                    value: szie,
                    type: "f"
                },
                texture: {
                    value: texture,
                    type: "t2"
                },
                height: {
                    value: height,
                    type: "f"
                }
            },
            transparent: true,
            depthTest: false,
            // blending: THREE.AdditiveBlending,
            vertexShader: shader.vertexshader,
            fragmentShader: shader.fragmentshader
        });
        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute("position", new THREE.Float32BufferAttribute(position, 3))
        point = new THREE.Points(geometry, material);
        return point
    }
    this.addPoint = function(vec3) { 
        pos.push(vec3);
        let position = [];
        pos.forEach(elem => {
            position.push(elem.x, elem.y, elem.z);
        })
        point.geometry.addAttribute("position", new THREE.Float32BufferAttribute(position, 3))
    }
    this.animation = function(delta) {
        if (point) {
            point.material.uniforms.time.value += delta * 10;
            let position = [];
            if(pos.length>number){
                pos.splice(0,1);
            }
            pos.forEach(elem => {
                elem.y += delta * 10; 
                position.push(elem.x, elem.y, elem.z);
            })
            point.geometry.addAttribute("position", new THREE.Float32BufferAttribute(position, 3))
        }
    }

}