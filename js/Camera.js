import * as THREE from "../node_modules/three/build/three.module.js";

class Camera {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(
            80,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
    }

    setStartCameraPosition(cubeSize) {
        let basePosition = cubeSize + 1;
        this.camera.position.set(basePosition, basePosition, basePosition);
        this.camera.lookAt(0, 0, 0);
    }

    getCamera(){
        return this.camera;
    }
}

export { Camera }