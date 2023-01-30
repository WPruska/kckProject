/**
 * @description Klasa do obsługi kamery
 */
import * as THREE from "../node_modules/three/build/three.module.js";

class Camera {
    /**
     * @description Konstruktor tworzący bazową strukturę kamery
     */
    constructor() {
        this.camera = new THREE.PerspectiveCamera(
            80,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
    }

    /**
     * @description Funkcja ustawiająca bazową pozycje kamery
     * 
     * @param cubeSize Wielkość kostki
     */
    setStartCameraPosition(cubeSize) {
        let basePosition = cubeSize + 1;
        this.camera.position.set(basePosition, basePosition, basePosition);
        this.camera.lookAt(0, 0, 0);
    }

    /**
     * @description Funkcja zwracająca kamerę
     * 
     * @returns Strukturę kamery
     */
    getCamera(){
        return this.camera;
    }
}

export { Camera }