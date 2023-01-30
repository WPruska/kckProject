/**
 * @description głowny plik js, który inicjalizuje aplikacje po określeniu rozmiaru kostki.
 */
import * as THREE from "../node_modules/three/build/three.module.js";
import { Cube } from './Cube.js';
import { Sound } from "./Sound.js";
import { Camera } from "./Camera.js";
import { Renderer } from "./Renderer.js";
import { Light } from "./Light.js";

let cube; // zmienna która przechowuje dane o kostce Rubika.
let scene = new THREE.Scene(); // scena która wyświetla kostę wraz z kamerę, światłem i pozostałymi danymi.
let cubeSound = new Sound("audio/mpeg", "audio/kostka.mp3", false); // dźwięk obrotu kostki.
let mainSound = new Sound("audio/mpeg", "audio/audio.mp3", true); // dźwięk głównej muzyki z tła, ustawiony na zapętlenie zapętlony.
let camera = new Camera(); // kamera którą obracamy.
let renderer = new Renderer(); // zmienna która określa co ma być wyświetlone na scenie.
const ambientLight = new Light(true); // jeden z rodzajów oświetlenia sceny.
const directionalLight = new Light(false); // drugi tym światła używany na scenie.

/**
 * @description funkcja która jest uruchamiana po wciśnięciu przycisku "start" na scenie inicjalizującej, po wprowadzeniu prawidłowych danych. 
 * Generuje scene z kostką do układania.
 */
function start() {
    let size = Number(document.getElementById("howBig").value);
    //weryfikacja poprawnego wypełnienia pola jeżeli złe wyświetl błąd
    if(size === null || size === '' || size <= 0){
        let error = document.getElementsByClassName("error");
        error[0].classList.remove("hidden");
    } else{
        scene.background = new THREE.Color(0x19d7f8);
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
 * @description funkcja która resetuje układ kamery do pozycji początkowej
 */
function resetView() {
    camera.setStartCameraPosition(cube.cubeSize);
}

/**
 * @description funcja która powoduje wykonanie 10 ruchów mieszania kostki 
 */
function shuffleCube() {
    cube.shuffleCube(10);
}

/**
 * @description funkcja wywołuje algorytm układania kostki
 */
function solveCube() {
    cube.solveCube();
}

//przypisanie funkcji do przycisków
document.getElementById("initButton").addEventListener('click', start);
document.getElementById("restView").addEventListener('click', resetView);
document.getElementById("shuffleCube").addEventListener('click', shuffleCube);
document.getElementById("solveCube").addEventListener('click', solveCube);