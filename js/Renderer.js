/**
 * @description Klasa która tworzy renderer
 */
import * as THREE from "../node_modules/three/build/three.module.js";

class Renderer {
    /**
     * @description Konstruktor tworzący bazową strukturę Renderera
     */
    constructor() {
        this.view = new THREE.WebGLRenderer(); //Przypisanie typu rendera i konfiguracja jego parametrów
        this.view.setPixelRatio(window.devicePixelRatio);
        this.view.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.view.domElement);
        this.domElement = this.view.domElement; //Miejsce, na którym renderer dodaje swoje dane wyjściowe
    }

    /**
     * @description Funkcja wyświetlająca scenę
     * 
     * @param scene Scena, którą wyświetlamy
     * @param camera Kamera, której używamy do zobaczenia sceny
     */
    render(scene, camera) {
        this.view.render(scene, camera);
    }
}

export { Renderer }