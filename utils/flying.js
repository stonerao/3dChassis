var flying = function (option, lines) {
    let scene = option.scene;
    const LOAD_TIME = 1000;//每条线完成的时间
    const shader = {
        vertexshader: `
            void main(){
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_Position = projectionMatrix * mvPosition; 
            }
        `,
        fragmentshader: `
            void main(){
                gl_FragColor = vec4(0.5,0.5,0.5,1);
            }
        `
    }
    createFlying(lines[0].src, lines[0].dst, LOAD_TIME);
    function createFlying(src, dst, time) {
        let lineWidth = 10;
        var geometry = new THREE.BufferGeometry();
        let material = new THREE.ShaderMaterial({
            uniforms: {
                time: {
                    type: "f",
                    value: 0.0
                }
            },
            transparent: true,
            depthTest: false,
            side: THREE.DoubleSide,
            blending: THREE.NormalBlending,
            vertexShader: shader.vertexshader,
            fragmentShader: shader.fragmentshader,
        }) 
        geometry.addAttribute('position', new THREE.Float32BufferAttribute([], 3));
        var mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        this.add = function (vec3) {

        }
    }
}