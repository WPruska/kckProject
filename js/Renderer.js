import * as THREE from "../node_modules/three/build/three.module.js";

class Renderer {
    constructor() {
        this.view = new THREE.WebGLRenderer();
        this.view.setPixelRatio(window.devicePixelRatio);
        this.view.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.view.domElement);
        this.domElement = this.view.domElement;
    }
    
    render(scene, camera) {
        this.view.render(scene, camera);
    }
}

export { Renderer }