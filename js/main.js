import * as THREE from "../node_modules/three/build/three.module.js";
import { Cube } from './Cube.js';
import { Music } from "./Music.js";
import { Camera } from "./Camera.js";
import { Light } from "./Light.js";

let cube;

function start() {
    let size = Number(document.getElementById("howBig").value);
    if(size === null || size === '' || size <= 0){
        let error = document.getElementsByClassName("error");
        error[0].classList.remove("hidden");
    } else{
        let cubeSound = new Music("audio/mpeg", "audio/kostka.mp3", false);
        let camera = new Camera();
        let ambientLight = new Light(true);
        let directionalLight = new Light(false);
        cube = new Cube(size, cubeSound, camera, ambientLight, directionalLight);
        let initForm = document.getElementById("initForm");
        initForm.classList.add("hidden");
        let initButton = document.getElementById("initButton");
        initButton.classList.add("hidden");
        let mainSound = new Music("audio/mpeg", "audio/audio.mp3", true);
        mainSound.play();
    }
    
}
function resetView() {
    cube.setStartCameraPosition();
}

function shuffleCube() {
    cube.shuffleCube(10);
}

function solveCube() {
    cube.solveCube();
}

document.getElementById("initButton").addEventListener('click', start);
document.getElementById("restView").addEventListener('click', resetView);
document.getElementById("shuffleCube").addEventListener('click', shuffleCube);
document.getElementById("solveCube").addEventListener('click', solveCube);