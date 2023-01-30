import * as THREE from "../node_modules/three/build/three.module.js";
import { Cube } from './Cube.js';
import { Music } from "./Music.js";
import { Camera } from "./Camera.js";
import { Renderer } from "./Renderer.js";
import { Light } from "./Light.js";

let cube;
let scene = new THREE.Scene();
let cubeSound = new Music("audio/mpeg", "audio/kostka.mp3", false);
let camera = new Camera();
let renderer = new Renderer();
const ambientLight = new Light(true);
const directionalLight = new Light(false);

function start() {
    let size = Number(document.getElementById("howBig").value);
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
        let mainSound = new Music("audio/mpeg", "audio/audio.mp3", true);
        mainSound.play();
    }
    
}
function resetView() {
    camera.setStartCameraPosition(cube.cubeSize);
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