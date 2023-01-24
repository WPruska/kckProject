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

function generateRubikCube(size) {
    let maxCoordinate = size - 1;
    for (let i = -1; i < maxCoordinate; i++) {
        for (let j = -1; j < maxCoordinate; j++) {
            for (let k = -1; k < maxCoordinate; k++) {
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
        group1.rotation.x += Math.PI / 16;
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
        group1.rotation.y += Math.PI / 16;
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
        group1.rotation.z += Math.PI / 16;
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
    cubes.forEach((cube) => {
        switch (type) {
            case "y":
                if(Math.round(cube.position.y)=== Math.round(group1.children[0].position.y)){
                    let x = cube.position.x;
                    let z = cube.position.z;
                    let newx = z === 0? 0 : z;
                    let newz = -x === 0? 0 : -x;
                    cube.position.set(newx, cube.position.y, newz);
                }
            break;
            case "z":
                if(Math.round(cube.position.z)=== Math.round(group1.children[0].position.z)){
                    let x = cube.position.x;
                    let y = cube.position.y;
                    let newx = -y === 0? 0 : -y;
                    let newy = x === 0? 0 : x;
                    console.log('gvyiu');
                    console.log(x);
                    console.log(y);
                    console.log(newx);
                    console.log(newy);
                    cube.position.set(newx, newy, cube.position.z);
                }
                break;
            case "x":
                if(Math.round(cube.position.x)=== Math.round(group1.children[0].position.x)){
                    let y = cube.position.y;
                    let z = cube.position.z;
                    let newy = -z === 0? 0 : -z;
                    let newz = y === 0? 0 : y;
                    cube.position.set(cube.position.x, newy, newz);
                }
                break;
        }
    });
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

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

window.addEventListener('resize', function () {
    console.log('dsadsa');
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

    clickedPosition = intersects[0].object.position;
    console.log(clickedPosition);
});

window.addEventListener("keydown", (event) => {
    console.log(event.key);
    if(event.key == 'ArrowLeft' && clickedPosition!=null){
        group1 = addWallToGroup("z",clickedPosition);
        scene.add(group1);
        count = 0;
        window.requestAnimationFrame(zRotate);
    }
    if(event.key == 'ArrowRight' && clickedPosition!=null){
        group1 = addWallToGroup("y",clickedPosition);
        scene.add(group1);
        count = 0;
        window.requestAnimationFrame(yRotate);
    }
    if(event.key == 'ArrowDown' && clickedPosition!=null){
        group1 = addWallToGroup("x",clickedPosition);
        scene.add(group1);
        count = 0;
        window.requestAnimationFrame(xRotate);
    }
    clickedPosition = null;
});

export { init }
export { setStartCameraPosition }



















































// import * as THREE from "../node_modules/three/build/three.module.js";

// const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x19d7f8);

// const camera = new THREE.PerspectiveCamera(
//     60, window.innerWidth / window.innerHeight, 1, 2000
// );

// camera.position.set(4, 4, 4);
// camera.lookAt(0, 0, 0);

// let loader = new THREE.TextureLoader();

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// let materialArray = [
//     new THREE.MeshStandardMaterial({ map: loader.load("img/red.png") }),
//     new THREE.MeshStandardMaterial({ map: loader.load("img/orange.png") }),
//     new THREE.MeshStandardMaterial({ map: loader.load("img/white.png") }),
//     new THREE.MeshStandardMaterial({ map: loader.load("img/yellow.png") }),
//     new THREE.MeshStandardMaterial({ map: loader.load("img/blue.png") }),
//     new THREE.MeshStandardMaterial({ map: loader.load("img/green.png") }),
// ];

// let cubes = new Array();

// for (let i = -1; i <= 1; i++) {
//     for (let j = -1; j <= 1; j++) {
//         for (let k = -1; k <= 1; k++) {
//             const cube = new THREE.Mesh(geometry, materialArray);
//             cube.position.set(i, j, k);
//             scene.add(cube);
//             cubes.push(cube);
//         }
//     }
// }

// const light = new THREE.AmbientLight(0xffffff, 0.6);
// light.position.set(10, 20, 0);
// scene.add(light);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
// directionalLight.position.set(10, 20, 0);
// scene.add(directionalLight);

// let group1;

// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// let mainSound = new Audio();
// let mainSoundSrc = document.createElement("source");
// mainSoundSrc.type = "audio/mpeg";
// mainSoundSrc.src = "audio/audio.mp3";
// mainSound.appendChild(mainSoundSrc);
// mainSound.loop = true;

// let count = 0;
// let cubeSound = new Audio();
// let cubeSoundSrc = document.createElement("source");
// cubeSoundSrc.type = "audio/mpeg";
// cubeSoundSrc.src = "audio/kostka.mp3";
// cubeSound.appendChild(cubeSoundSrc);

// function xRotate() {
//     setTimeout(() => {
//         group1.rotation.x += Math.PI / 16;
//         renderer.render(scene, camera);
//         count++;
//         if (count == 4) {
//             cubeSound.play();
//         }
//         if (count < 8) {
//             window.requestAnimationFrame(xRotate);
//         } else {
//             refreshPositions("x");
//         }
//     }, 30);
// }

// function yRotate() {
//     setTimeout(() => {
//         group1.rotation.y += Math.PI / 16;
//         renderer.render(scene, camera);
//         count++;
//         if (count == 4) {
//             cubeSound.play();
//         }
//         if (count < 8) {
//             window.requestAnimationFrame(yRotate);
//         } else {
//             refreshPositions("y");
//         }
//     }, 30);
// }

// function zRotate() {
//     setTimeout(() => {
//         group1.rotation.z += Math.PI / 16;
//         renderer.render(scene, camera);
//         count++;
//         if (count == 4) {
//             cubeSound.play();
//         }
//         if (count < 8) {
//             window.requestAnimationFrame(zRotate);
//         } else {
//             refreshPositions("z");
//         }
//     }, 30);
// }

// window.addEventListener('resize', () => {
//     console.log('dsadsa');
//     let width = window.innerWidth;
//     let height = window.innerHeight;
//     renderer.setSize(width, height);
//     camera.aspect = width / height;
//     camera.updateProjectionMatrix;
// });

// const pointer = new THREE.Vector2();
// const raycaster = new THREE.Raycaster();
// let clickedPosition;

// window.addEventListener("click", (event) => {
//     clickedPosition = null;
//     pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
// 	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

//     raycaster.setFromCamera( pointer, camera );
//     const intersects = raycaster.intersectObjects( scene.children );

//     clickedPosition = intersects[0].object.position;
//     console.log(clickedPosition);
// });

// window.addEventListener("keydown", (event) => {
//     console.log(event.key);
//     if(event.key == 'ArrowLeft' && clickedPosition!=null){
//         group1 = addWallToGroup("z",clickedPosition);
//         scene.add(group1);
//         count = 0;
//         window.requestAnimationFrame(zRotate);
//     }
//     if(event.key == 'ArrowRight' && clickedPosition!=null){
//         group1 = addWallToGroup("y",clickedPosition);
//         scene.add(group1);
//         count = 0;
//         window.requestAnimationFrame(yRotate);
//     }
//     if(event.key == 'ArrowDown' && clickedPosition!=null){
//         group1 = addWallToGroup("x",clickedPosition);
//         scene.add(group1);
//         count = 0;
//         window.requestAnimationFrame(xRotate);
//     }
//     clickedPosition = null;
// });

// function refreshPositions(type){
//     cubes.forEach((cube) => {
//         switch (type) {
//             case "y":
//                 if(Math.round(cube.position.y)=== Math.round(group1.children[0].position.y)){
//                     let x = cube.position.x;
//                     let z = cube.position.z;
//                     let newx = z === 0? 0 : z;
//                     let newz = -x === 0? 0 : -x;
//                     cube.position.set(newx, cube.position.y, newz);
//                 }
//             break;
//             case "z":
//                 if(Math.round(cube.position.z)=== Math.round(group1.children[0].position.z)){
//                     let x = cube.position.x;
//                     let y = cube.position.y;
//                     let newx = -y === 0? 0 : -y;
//                     let newy = x === 0? 0 : x;
//                     cube.position.set(newx, newy, cube.position.z);
//                 }
//                 break;
//             case "x":
//                 if(Math.round(cube.position.x)=== Math.round(group1.children[0].position.x)){
//                     let y = cube.position.y;
//                     let z = cube.position.z;
//                     let newy = -z === 0? 0 : -z;
//                     let newz = y === 0? 0 : y;
//                     cube.position.set(cube.position.x, newy, newz);
//                 }
//                 break;
//         }
//     });
// }

// function addWallToGroup(type, position) {
//     let x;
//     let y;
//     let z;
//     let group = new THREE.Group();
//     cubes.forEach((cube) => {
//         x = cube.position.x;
//         y = cube.position.y;
//         z = cube.position.z;
//         switch (type) {
//             case "y":
//                 if(cube.position.y === position.y){
//                     group.add(cube);
//                 }
//                 break;
//             case "z":
//                 if(cube.position.z === position.z){
//                     group.add(cube);
//                 }
//                 break;
//             case "x":
//                 if(cube.position.x === position.x){
//                     group.add(cube);
//                 }
//                 break;
//         }
//         cube.position.set(x, y, z);
//         if(cube.position.x === position.x){
//             console.log(cube.position);
//         }
//     });
//     return group;
// }

// function init() {
//     generateRubikCube(3);
//     generateLight();
//     generateCamera();
//     generateRenderer();
//     prepereMusic();
//     controls = new OrbitControls(camera, renderer.domElement);
//     controls.update();
//     renderer.render(scene, camera);
//     mainSound.play();
//     animate();
// }

// export { init }
