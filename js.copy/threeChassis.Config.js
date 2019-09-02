var Basic_Config = {
    controls: {

    },
    background: {
        color: '#ffffff',
        opacity: 0.0,
    },
    camera: {
        fov: 45,
        near: 1,
        far: 20000,
        position: [0, 0, 0]
    },
    controls: {
        enableZoom: true,
        enableRotate: true,
        autoRotate: false,
        autoRotateSpeed: 0.0,

        enableDamping: true,
        dampingFactor: 0.05,
        panSpeed: .1,
        zoomSpeed: .1,
        rotateSpeed: .05,
        distance: [80, 1000],
        polarAngle: [-Math.PI * .5, 3 * Math.PI * .5],
        azimuthAngle: [-Infinity, Infinity]
    }
};
var Chassis_Config = {
    skin: {

    }
};
var _Config = {};
_Config.Basic_Config = Basic_Config;
_Config.Chassis_Config = Chassis_Config;