/**
 * @description Głowny plik js, który inicjalizuje aplikacje po określeniu rozmiaru kostki.
 */
import * as THREE from "../node_modules/three/build/three.module.js";
import { Cube } from './Cube.js';
import { Sound } from "./Sound.js";
import { Camera } from "./Camera.js";
import { Renderer } from "./Renderer.js";
import { Light } from "./Light.js";

let cube; // Zmienna która przechowuje dane o kostce Rubika.
let scene = new THREE.Scene(); // Scena która wyświetla kostę wraz z kamerę, światłem i pozostałymi danymi.
let cubeSound = new Sound("audio/mpeg", "audio/kostka.mp3", false); // Dźwięk obrotu kostki.
let mainSound = new Sound("audio/mpeg", "audio/audio.mp3", true); // Dźwięk głównej muzyki z tła, ustawiony na zapętlenie zapętlony.
let camera = new Camera(); // Kamera którą obracamy.
let renderer = new Renderer(); // Render który wyświetla scenę
const ambientLight = new Light(true, 0xffffff, 0.6); // Jeden z rodzajów oświetlenia sceny.
const directionalLight = new Light(false, 0xffffff, 0.4); // Drugi tym światła używany na scenie.

/**
 * @description Funkcja która jest uruchamiana po wciśnięciu przycisku "start" na scenie inicjalizującej, po wprowadzeniu prawidłowych danych. 
 * Generuje scene z kostką do układania.
 */
function start() {
    let size = Number(document.getElementById("howBig").value);
    //Weryfikacja poprawnego wypełnienia pola jeżeli złe wyświetl błąd
    if (size === null || size === '' || size <= 0) {
        let error = document.getElementsByClassName("error");
        error[0].classList.remove("hidden");
    } else {
        scene.background = new THREE.Color(0x414141);
        ambientLight.setPosiotion(10, 20, 0);
        directionalLight.setPosiotion(10, 20, 0);
        ambientLight.addToScene(scene);
        directionalLight.addToScene(scene);
        cube = new Cube(scene, size, cubeSound, camera, renderer);
        let initForm = document.getElementById("initForm");
        initForm.classList.add("hidden");
        let initButton = document.getElementById("initButton");
        initButton.classList.add("hidden");
        let functionalitiesDiv = document.getElementById("functionalitiesDiv");
        functionalitiesDiv.classList.remove("hidden");
        mainSound.play();
    }

}

/**
 * @description Funkcja która resetuje układ kamery do pozycji początkowej
 */
function resetView() {
    camera.setStartCameraPosition(cube.cubeSize);
}

/**
 * @description Funcja która powoduje wykonanie 10 ruchów mieszania kostki 
 */
function shuffleCube() {
    cube.shuffleCube(10);
}

/**
 * @description Funkcja wywołuje algorytm układania kostki
 */
function solveCube() {
    cube.solveCube();
}

//Przypisanie funkcji do przycisków
document.getElementById("initButton").addEventListener('click', start);
document.getElementById("restView").addEventListener('click', resetView);
document.getElementById("shuffleCube").addEventListener('click', shuffleCube);
document.getElementById("solveCube").addEventListener('click', solveCube);

/**
 * @description Event umożliwający przybliżanie i oddalanie się kamery
 */
window.addEventListener('resize', function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.getCamera().aspect = width / height;
    camera.getCamera().updateProjectionMatrix;
});