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
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let clickedPosition;
let cubeSound = new Audio();
let rotType;
const axisy = new THREE.Vector3(0, 1, 0);//y
const axisz = new THREE.Vector3(0, 0, 1);//z
const axisx = new THREE.Vector3(1, 0, 0);//x
const axis_y = new THREE.Vector3(0, -1, 0);//-y
const axis_z = new THREE.Vector3(0, 0, -1);//-z
const axis_x = new THREE.Vector3(-1, 0, 0);//-x
let moves = new Array();
let move = {};

function generateRubikCube(size) {
    let stardCord = -(size * 0.5 - 0.5);
    let maxCoordinate = size + stardCord;
    for (let i = stardCord; i < maxCoordinate; i++) {
        for (let j = stardCord; j < maxCoordinate; j++) {
            for (let k = stardCord; k < maxCoordinate; k++) {
                const cube = new THREE.Mesh(geometry, materialArray);
                cube.position.set(i, j, k);
                scene.add(cube);
                cubes.push(cube);
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

    let cubeSoundSrc = document.createElement("source");
    cubeSoundSrc.type = "audio/mpeg";
    cubeSoundSrc.src = "audio/kostka.mp3";
    cubeSound.appendChild(cubeSoundSrc);
}

function xRotate() {
    setTimeout(() => {
        if(rotType === '+x'){
            group1.rotation.x += Math.PI / 16;
        }
        if(rotType === '-x'){
            group1.rotation.x -= Math.PI / 16;
        }
        renderer.render(scene, camera);
        count++;
        if (count == 4) {
            cubeSound.play();
        }
        if (count < 8) {
            window.requestAnimationFrame(xRotate);
        } else {
            refreshPositions("x");
        }
    }, 30);
}

function yRotate() {
    setTimeout(() => {
        if(rotType === '+y'){
            group1.rotation.y += Math.PI / 16;
        }
        if(rotType === '-y'){
            group1.rotation.y -= Math.PI / 16;
        }
        renderer.render(scene, camera);
        count++;
        if (count == 4) {
            cubeSound.play();
        }
        if (count < 8) {
            window.requestAnimationFrame(yRotate);
        } else {
            refreshPositions("y");
        }
    }, 30);
}

function zRotate() {
    setTimeout(() => {
        if( rotType === '+z'){
            group1.rotation.z += Math.PI / 16;
        }
        if(rotType === '-z'){
            group1.rotation.z -= Math.PI / 16;
        }
        renderer.render(scene, camera);
        count++;
        if (count == 4) {
            cubeSound.play();
        }
        if (count < 8) {
            window.requestAnimationFrame(zRotate);
        } else {
            refreshPositions("z");
        }
    }, 30);
}

function refreshPositions(type){
    let newx;
    let newy;
    let newz;
    cubes.forEach((cube) => {
        switch (type) {
            case "y":
                if(Math.round(cube.position.y)=== Math.round(group1.children[0].position.y)){
                    let x = cube.position.x;
                    let z = cube.position.z;
                    if(rotType === '+y'){
                        newx = z === 0? 0 : z;
                        newz = -x === 0? 0 : -x;
                    } else {
                        newx = -z === 0? 0 : -z;
                        newz = x === 0? 0 : x;
                    }
                    cube.position.set(newx, cube.position.y, newz);
                }
            break;
            case "z":
                if(Math.round(cube.position.z)=== Math.round(group1.children[0].position.z)){
                    let x = cube.position.x;
                    let y = cube.position.y;
                    if(rotType === '+z'){
                        newx = -y === 0? 0 : -y;
                        newy = x === 0? 0 : x;
                    } else {
                        newx = y === 0? 0 : y;
                        newy = -x === 0? 0 : -x;
                    }
                    cube.position.set(newx, newy, cube.position.z);
                }
                break;
            case "x":
                if(Math.round(cube.position.x)=== Math.round(group1.children[0].position.x)){
                    let y = cube.position.y;
                    let z = cube.position.z;
                    if(rotType === '+x'){
                        newy = -z === 0? 0 : -z;
                        newz = y === 0? 0 : y;
                    } else {
                        newy = z === 0? 0 : z;
                        newz = -y === 0? 0 : -y;
                    }
                    cube.position.set(cube.position.x, newy, newz);
                }
                break;
        }
    });
    count++;
    rerenderCube();
}

function addWallToGroup(type, position) {
    let x;
    let y;
    let z;
    let group = new THREE.Group();
    cubes.forEach((cube) => {
        x = cube.position.x;
        y = cube.position.y;
        z = cube.position.z;
        switch (type) {
            case "y":
                if(cube.position.y === position.y){
                    group.add(cube);
                }
                break;
            case "z":
                if(cube.position.z === position.z){
                    group.add(cube);
                }
                break;
            case "x":
                if(cube.position.x === position.x){
                    group.add(cube);
                }
                break;
        }
        cube.position.set(x, y, z);
    });
    return group;
}

function rerenderCube(){
    if(count === 9){
        cubes.forEach((cube) => {
            scene.remove(cube);
        });
        count = 0;
        cubes.forEach((cube) => {
            if(group1.children.includes(cube)){
                switch (rotType) {
                    case "+y":
                        cube.rotateOnWorldAxis(axisy, Math.PI / 2);
                        break;
                    case "+z":
                        cube.rotateOnWorldAxis(axisz, Math.PI / 2);
                        break;
                    case "+x":
                        cube.rotateOnWorldAxis(axisx, Math.PI / 2);
                        break;
                    case "-y":
                        cube.rotateOnWorldAxis(axis_y, Math.PI / 2);
                        break;
                    case "-z":
                        cube.rotateOnWorldAxis(axis_z, Math.PI / 2);
                        break;
                    case "-x":
                        cube.rotateOnWorldAxis(axis_x, Math.PI / 2);
                        break;
                }
            }
            scene.add(cube);
        });
        scene.remove(group1);
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

function solveCube() {
    moves.forEach(() => {
        // console.log("Solve step");
        move = moves.pop();
        clickedPosition = move.pos;
        // group1 = move.gru; 
        rotType = move.rot;
        console.log(clickedPosition, rotType); //DEBUG zmienne po przypisaniu ze stacka; Wywala Uncaught TypeError: group1.children[0] is undefined, ale nie na każdym kroku
        switch (rotType) {                      //Ma problem z refreshPositions() na tych linijkach if(Math.round(cube.position.y)=== Math.round(group1.children[0].position.y))
            case "-x":
                group1 = addWallToGroup("x",clickedPosition);
                rotType = "+x";
                scene.add(group1);
                count = 0;
                window.requestAnimationFrame(xRotate);
                break;
            case "+x":
                group1 = addWallToGroup("x",clickedPosition);
                rotType = "-x";
                scene.add(group1);
                count = 0;
                window.requestAnimationFrame(xRotate);
                break;
            case "-y":
                group1 = addWallToGroup("y",clickedPosition);
                rotType = "+y";
                scene.add(group1);
                count = 0;
                window.requestAnimationFrame(yRotate);
                break;
            case "+y":
                group1 = addWallToGroup("y",clickedPosition);
                rotType = "-y";
                scene.add(group1);
                count = 0;
                window.requestAnimationFrame(yRotate);
                break;
            case "-z":
                group1 = addWallToGroup("z",clickedPosition);
                rotType = "+z";
                scene.add(group1);
                count = 0;
                window.requestAnimationFrame(zRotate);
                break;
            case "+z":
                group1 = addWallToGroup("z",clickedPosition);
                rotType = "-z";
                scene.add(group1);
                count = 0;
                window.requestAnimationFrame(zRotate);
                break;
        }
    });
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
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix;
});

window.addEventListener("click", (event) => {
    clickedPosition = null;
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( scene.children );
    if(intersects.length > 0){
        clickedPosition = intersects[0].object.position;
    }
});

window.addEventListener("keydown", (event) => {
    if(clickedPosition!=null){
        switch (event.key) {
            case "x":
                group1 = addWallToGroup("x",clickedPosition);
                rotType = "+x";
                scene.add(group1);
                count = 0;
                window.requestAnimationFrame(xRotate);
                break;
            case "X":
                group1 = addWallToGroup("x",clickedPosition);
                rotType = "-x";
                scene.add(group1);
                count = 0;
                window.requestAnimationFrame(xRotate);
                break;
            case "c":
                group1 = addWallToGroup("y",clickedPosition);
                rotType = "+y";
                scene.add(group1);
                count = 0;
                window.requestAnimationFrame(yRotate);
                break;
            case "C":
                group1 = addWallToGroup("y",clickedPosition);
                rotType = "-y";
                scene.add(group1);
                count = 0;
                window.requestAnimationFrame(yRotate);
                break;
            case "z":
                group1 = addWallToGroup("z",clickedPosition);
                rotType = "+z";
                scene.add(group1);
                count = 0;
                window.requestAnimationFrame(zRotate);
                break;
            case "Z":
                group1 = addWallToGroup("z",clickedPosition);
                rotType = "-z";
                scene.add(group1);
                count = 0;
                window.requestAnimationFrame(zRotate);
                break;
        }
        console.log(group1); //DEBUG group1 po każdym ruchu
        moves.push({
            pos: clickedPosition,
            rot: rotType
        });
    }
    clickedPosition = null; 
        //DEBUG keypress a loguje mi cały array moves
        if (event.key == "a")  {
            moves.forEach(function(entry) {
            console.log(entry);
        });
        } else if (event.key == "s"){
            solveCube();
        }
});

export { init }
export { setStartCameraPosition }
