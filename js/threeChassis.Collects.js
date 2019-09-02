var _Collects = {
    setControls: function (controls, opts) {

        controls.enablePan = false;
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
        controls.maxAzimuthAngle = opts.azimuthAngle[1];

    },
}