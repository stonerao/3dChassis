var init = function (option) {
	var camera, controls, scene, renderer;
	const clock = new THREE.Clock();
	const thm = this;
	let config = {
		controls: {
			enableZoom: true,
			enableRotate: true,
			autoRotate: true,
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
	}

	function init() {
		camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.set(0, 200, 400);
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0xeeeeee);
		scene.add(new THREE.GridHelper(400, 10));
		// renderer
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.querySelector(option.id).appendChild(renderer.domElement);
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		setControls(controls, config.controls)
		window.addEventListener('resize', onWindowResize, false);
		// onload 
		if (option.load) {
			option.load({
				camera, controls, scene, renderer
			})
		}
		if (Stats) {
                stats = new Stats(); 
                document.querySelector(option.id).appendChild(stats.dom);
            }
	}
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
	function animate() {
		requestAnimationFrame(animate);
		var delta = clock.getDelta();
		renderer.render(scene, camera);
		if (option.animation) option.animation(delta);
		 if(stats) stats.update();
	}
	function setControls(controls, opts) {
		/*controls.enablePan = false;
		controls.enableKeys = opts.enablePan;
		controls.enableZoom = opts.enableZoom;
		controls.enableRotate = opts.enableRotate;

		controls.autoRotate = opts.autoRotate;
		controls.autoRotateSpeed = parseFloat(opts.autoRotateSpeed);

		controls.enableDamping = opts.enableDamping;
		controls.dampingFactor = opts.dampingFactor;

		controls.panSpeed = opts.panSpeed;
		controls.zoomSpeed = opts.zoomSpeed;
		controls.rotateSpeed = opts.rotateSpeed;

		controls.minDistance = opts.distance[0];
		controls.maxDistance = opts.distance[1];
		controls.minPolarAngle = opts.polarAngle[0];
		controls.maxPolarAngle = opts.polarAngle[1];
		controls.minAzimuthAngle = opts.azimuthAngle[0];
		controls.maxAzimuthAngle = opts.azimuthAngle[1];*/

	}
	init();
	animate();
}