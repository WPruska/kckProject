import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import * as THREE from "../node_modules/three/build/three.module.js";


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x19d7f8);

let loader = new THREE.TextureLoader();

const geometry = new THREE.BoxGeometry(1, 1, 1);
let materialArray = [
    new THREE.MeshStandardMaterial({ map: loader.load("img/red.png") }),
    new THREE.MeshStandardMaterial({ map: loader.load("img/orange.png") }),
    new THREE.MeshStandardMaterial({ map: loader.load("img/white.png") }),
    new THREE.MeshStandardMaterial({ map: loader.load("img/yellow.png") }),
    new THREE.MeshStandardMaterial({ map: loader.load("img/blue.png") }),
    new THREE.MeshStandardMaterial({ map: loader.load("img/green.png") }),
];

let cubes = new Array();
let group1;
let light;
let directionalLight;
let camera;
let renderer;
let mainSound;
let count = 0;
let controls;

function generateRubikCube(size) {
    for (let i = 0; i < size; i++) {
        cubes[i] = new Array();
        for (let j = 0; j < size; j++) {
            cubes[i][j] = new Array();
        }
    }
    let maxCoordinate = size - 1;
    for (let i = -1; i < maxCoordinate; i++) {
        for (let j = -1; j < maxCoordinate; j++) {
            for (let k = -1; k < maxCoordinate; k++) {
                const cube = new THREE.Mesh(geometry, materialArray);
                cube.position.set(i, j, k);
                scene.add(cube);
                cubes[i + 1][j + 1][k + 1] = cube;
            }
        }
    }
}

function generateLight() {
    light = new THREE.AmbientLight(0xffffff, 0.6);
    light.position.set(10, 20, 0);
    scene.add(light);

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 20, 0);
    scene.add(directionalLight);
    group1 = addWallToGroup("side", 1);
    group1.position.set(0, 0, 0);
    scene.add(group1);
}

function generateCamera() {
    camera = new THREE.PerspectiveCamera(
        80,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    setStartCameraPosition();
}

function setStartCameraPosition() {
    camera.position.set(4, 4, 4);
    camera.lookAt(0, 0, 0);
}

function generateRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function prepereMusic() {
    mainSound = new Audio();
    let mainSoundSrc = document.createElement("source");
    mainSoundSrc.type = "audio/mpeg";
    mainSoundSrc.src = "audio/audio.mp3";
    mainSound.appendChild(mainSoundSrc);
    mainSound.loop = true;
}

function xRotate() {
    setTimeout(() => {
        group1.rotation.x += Math.PI / 16;
        renderer.render(scene, camera);
        count++;
        if (count == 4) {
            let cubeSound = new Audio();
            let cubeSoundSrc = document.createElement("source");
            cubeSoundSrc.type = "audio/mpeg";
            cubeSoundSrc.src = "audio/kostka.mp3";
            cubeSound.appendChild(cubeSoundSrc);
            cubeSound.play();
        }
        if (count < 8) {
            window.requestAnimationFrame(xRotate);
        }
    }, 30);
}

function yRotate() {
    setTimeout(() => {
        group1.rotation.y += Math.PI / 16;
        renderer.render(scene, camera);
        count++;
        if (count < 8) {
            window.requestAnimationFrame(yRotate);
        }
    }, 30);
}

function addWallToGroup(type, layer) {
    let group = new THREE.Group();
    switch (type) {
        case "top":
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                    console.log("cube: " + i + " " + layer + " " + j);
                    group.attach(cubes[i][layer][j]);
                }
            }
            break;
        case "front":
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                    console.log("cube: " + i + " " + j + " " + layer);
                    group.attach(cubes[i][j][layer]);
                }
            }
            break;
        case "side":
            for (let i = 0; i <= 2; i++) {
                for (let j = 0; j <= 2; j++) {
                    console.log("cube: " + layer + " " + i + " " + j);
                    group.attach(cubes[layer][i][j]);
                }
            }
            break;
    }
    return group;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

function init() {
    generateRubikCube(3);
    generateLight();
    generateCamera();
    generateRenderer();
    prepereMusic();
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    renderer.render(scene, camera);
    mainSound.play();
    animate();
}

window.addEventListener('resize', function () {
    console.log('dsadsa');
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix;
});

window.addEventListener("click", () => {
    count = 0;
    window.requestAnimationFrame(xRotate);
});

window.addEventListener("keypress", () => {
    count = 0;
    window.requestAnimationFrame(yRotate);
});

export { init }
export { setStartCameraPosition }
