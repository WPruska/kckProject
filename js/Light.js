import * as THREE from "../node_modules/three/build/three.module.js";

class Light {
    constructor(isAmbientLight) {
        if (isAmbientLight) {
            this.light = new THREE.AmbientLight(0xffffff, 0.6);
        } else {
            this.light = new THREE.DirectionalLight(0xffffff, 0.4);
        }
        this.light.position.set(10, 20, 0);
    }

    addToScene(scene) {
        scene.add(this.light);
    }
}

export { Light }