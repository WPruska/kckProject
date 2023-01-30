/**
 * @description Klasa do konfiguracji światła
 */
import * as THREE from "../node_modules/three/build/three.module.js";

class Light {
    /**
     * @description Konstruktor tworzący źródło światła
     * 
     * @param isAmbientLight Zmienna określająca czy chemy wygenerować AmbientLight
     * @param lightColor Zmienna określająca color światła
     * @param lightPower Zmienna określająca moc oświetlenia
     */
    constructor(isAmbientLight, lightColor, lightPower) {
        if (isAmbientLight) {
            this.light = new THREE.AmbientLight(lightColor, lightPower);
        } else {
            this.light = new THREE.DirectionalLight(lightColor, lightPower);
        }
    }

    /**
     * @description Funkcja określająca źródła światła
     * 
     * @param xCord Współrzędna X pozycji światła
     * @param yCord Współrzędna Y pozycji światła
     * @param zCord Współrzędna Z pozycji światła
     */
    setPosiotion(xCord, yCord, zCord){
        this.light.position.set(xCord, yCord, zCord);
    }

    /**
     * @description Funkcja dodająca światło do sceny
     * 
     * @param scene Scena na której chcemy wyświetlić światło
     */
    addToScene(scene) {
        scene.add(this.light);
    }
}

export { Light }