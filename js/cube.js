import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import * as THREE from "../node_modules/three/build/three.module.js";
import { Renderer } from "./Renderer.js";

const delay = async (ms = 1000) =>
    new Promise(resolve => setTimeout(resolve, ms))
class Cube {
    constructor(size, cubeSound, camera, ambientLight, directionalLight) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x19d7f8);
        this.loader = new THREE.TextureLoader();
        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.materialArray = [
            new THREE.MeshStandardMaterial({ map: this.loader.load("img/red.png") }),
            new THREE.MeshStandardMaterial({ map: this.loader.load("img/orange.png") }),
            new THREE.MeshStandardMaterial({ map: this.loader.load("img/white.png") }),
            new THREE.MeshStandardMaterial({ map: this.loader.load("img/yellow.png") }),
            new THREE.MeshStandardMaterial({ map: this.loader.load("img/blue.png") }),
            new THREE.MeshStandardMaterial({ map: this.loader.load("img/green.png") }),
        ];
        this.cubes = new Array();
        this.group1;
        this.ambientLight = ambientLight;
        this.directionalLight = directionalLight;
        this.mainCamera = camera;
        this.renderer = new Renderer();
        this.count = 0;
        this.controls;
        this.pointer = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.clickedPosition;
        this.cubeSound = cubeSound;
        this.rotType;
        this.rotTypeArr = ["+x", "-x", "+y", "-y", "+z", "-z"];
        this.axisy = new THREE.Vector3(0, 1, 0);//y
        this.axisz = new THREE.Vector3(0, 0, 1);//z
        this.axisx = new THREE.Vector3(1, 0, 0);//x
        this.axis_y = new THREE.Vector3(0, -1, 0);//-y
        this.axis_z = new THREE.Vector3(0, 0, -1);//-z
        this.axis_x = new THREE.Vector3(-1, 0, 0);//-x
        this.moves = new Array();
        this.move = {};
        this.cubeSize = 3; //Wymiar kostki
        this.shuffleIterations = 10; //Ilość przetasowań
        this.delayTime = 150 * this.cubeSize; //delay między ruchami w shuffle i solve w [ms] (lepiej nie ustawiać mniej niż 500, zwłaszcza dla większych kostek)
        this.init(size);

        window.addEventListener('resize', function () {
            let width = window.innerWidth;
            let height = window.innerHeight;
            this.renderer.setSize(width, height);
            this.mainCamera.getCamera().aspect = width / height;
            this.mainCamera.getCamera().updateProjectionMatrix;
        });

        window.addEventListener("click", (event) => {
            this.clickedPosition = null;
            this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.pointer, this.mainCamera.getCamera());
            const intersects = this.raycaster.intersectObjects(this.scene.children);
            if (intersects.length > 0) {
                this.clickedPosition = intersects[0].object.position;
            }
        });

        window.addEventListener("keydown", (event) => {
            if (event.key == "a") {
                this.moves.forEach(function (entry) {
                    console.log(entry); // pod klawiszem "a" printuję sobie listę ruchów na konsoli
                });
            } else if (event.key == "s") {
                this.solveCube();
            } else if (event.key == "d") {
                this.shuffleCube(this.shuffleIterations);
            }
            if (this.clickedPosition != null) {
                switch (event.key) {
                    case "x":
                        this.group1 = this.addWallToGroup("x", this.clickedPosition);
                        this.rotType = "+x";
                        this.scene.add(this.group1);
                        this.count = 0;
                        window.requestAnimationFrame(() => this.xRotate());
                        break;
                    case "X":
                        this.group1 = this.addWallToGroup("x", this.clickedPosition);
                        this.rotType = "-x";
                        this.scene.add(this.group1);
                        this.count = 0;
                        window.requestAnimationFrame(() => this.xRotate());
                        break;
                    case "c":
                        this.group1 = this.addWallToGroup("y", this.clickedPosition);
                        this.rotType = "+y";
                        this.scene.add(this.group1);
                        this.count = 0;
                        window.requestAnimationFrame(() => this.yRotate());
                        break;
                    case "C":
                        this.group1 = this.addWallToGroup("y", this.clickedPosition);
                        this.rotType = "-y";
                        this.scene.add(this.group1);
                        this.count = 0;
                        window.requestAnimationFrame(() => this.yRotate());
                        break;
                    case "z":
                        this.group1 = this.addWallToGroup("z", this.clickedPosition);
                        this.rotType = "+z";
                        this.scene.add(this.group1);
                        this.count = 0;
                        window.requestAnimationFrame(() => this.zRotate());
                        break;
                    case "Z":
                        this.group1 = this.addWallToGroup("z", this.clickedPosition);
                        this.rotType = "-z";
                        this.scene.add(this.group1);
                        this.count = 0;
                        window.requestAnimationFrame(() => this.zRotate());
                        break;
                }
                let posClone = new THREE.Vector3(this.clickedPosition.x, this.clickedPosition.y, this.clickedPosition.z);
                let rotClone = this.rotType;
                this.moves.push({
                    pos: posClone,
                    rot: rotClone
                });
                posClone = null;
                rotClone = null;
            }
            this.clickedPosition = null;
        });
    }

    generateRubikCube(size) {
        let stardCord = -(size * 0.5 - 0.5);
        let maxCoordinate = size + stardCord;
        for (let i = stardCord; i < maxCoordinate; i++) {
            for (let j = stardCord; j < maxCoordinate; j++) {
                for (let k = stardCord; k < maxCoordinate; k++) {
                    const cube = new THREE.Mesh(this.geometry, this.materialArray);
                    cube.position.set(i, j, k);
                    this.scene.add(cube);
                    this.cubes.push(cube);
                }
            }
        }
    }

    xRotate() {
        setTimeout(() => {
            if (this.rotType === '+x') {
                this.group1.rotation.x += Math.PI / 16;
            }
            if (this.rotType === '-x') {
                this.group1.rotation.x -= Math.PI / 16;
            }
            this.renderer.render(this.scene, this.mainCamera.getCamera());
            this.count++;
            if (this.count == 4) {
                this.cubeSound.play();
            }
            if (this.count < 8) {
                window.requestAnimationFrame(() => this.xRotate());
            } else {
                this.refreshPositions("x");
            }
        }, 30);
    }

    yRotate() {
        setTimeout(() => {
            if (this.rotType === '+y') {
                this.group1.rotation.y += Math.PI / 16;
            }
            if (this.rotType === '-y') {
                this.group1.rotation.y -= Math.PI / 16;
            }
            this.renderer.render(this.scene, this.mainCamera.getCamera());
            this.count++;
            if (this.count == 4) {
                this.cubeSound.play();
            }
            if (this.count < 8) {
                window.requestAnimationFrame(() => this.yRotate());
            } else {
                this.refreshPositions("y");
            }
        }, 30);
    }

    zRotate() {
        setTimeout(() => {
            if (this.rotType === '+z') {
                this.group1.rotation.z += Math.PI / 16;
            }
            if (this.rotType === '-z') {
                this.group1.rotation.z -= Math.PI / 16;
            }
            this.renderer.render(this.scene, this.mainCamera.getCamera());
            this.count++;
            if (this.count == 4) {
                this.cubeSound.play();
            }
            if (this.count < 8) {
                window.requestAnimationFrame(() => this.zRotate());
            } else {
                this.refreshPositions("z");
            }
        }, 30);
    }

    refreshPositions(type) {
        let newx;
        let newy;
        let newz;
        this.cubes.forEach((cube) => {
            switch (type) {
                case "y":
                    if (Math.round(cube.position.y) === Math.round(this.group1.children[0].position.y)) {
                        let x = cube.position.x;
                        let z = cube.position.z;
                        if (this.rotType === '+y') {
                            newx = z === 0 ? 0 : z;
                            newz = -x === 0 ? 0 : -x;
                        } else {
                            newx = -z === 0 ? 0 : -z;
                            newz = x === 0 ? 0 : x;
                        }
                        cube.position.set(newx, cube.position.y, newz);
                    }
                    break;
                case "z":
                    if (Math.round(cube.position.z) === Math.round(this.group1.children[0].position.z)) {
                        let x = cube.position.x;
                        let y = cube.position.y;
                        if (this.rotType === '+z') {
                            newx = -y === 0 ? 0 : -y;
                            newy = x === 0 ? 0 : x;
                        } else {
                            newx = y === 0 ? 0 : y;
                            newy = -x === 0 ? 0 : -x;
                        }
                        cube.position.set(newx, newy, cube.position.z);
                    }
                    break;
                case "x":
                    if (Math.round(cube.position.x) === Math.round(this.group1.children[0].position.x)) {
                        let y = cube.position.y;
                        let z = cube.position.z;
                        if (this.rotType === '+x') {
                            newy = -z === 0 ? 0 : -z;
                            newz = y === 0 ? 0 : y;
                        } else {
                            newy = z === 0 ? 0 : z;
                            newz = -y === 0 ? 0 : -y;
                        }
                        cube.position.set(cube.position.x, newy, newz);
                    }
                    break;
            }
        });
        this.count++;
        this.rerenderCube();
    }

    addWallToGroup(type, position) {
        let x;
        let y;
        let z;
        let group = new THREE.Group();
        this.cubes.forEach((cube) => {
            x = cube.position.x;
            y = cube.position.y;
            z = cube.position.z;
            switch (type) {
                case "y":
                    if (cube.position.y === position.y) {
                        group.add(cube);
                    }
                    break;
                case "z":
                    if (cube.position.z === position.z) {
                        group.add(cube);
                    }
                    break;
                case "x":
                    if (cube.position.x === position.x) {
                        group.add(cube);
                    }
                    break;
            }
            cube.position.set(x, y, z);
        });
        return group;
    }

    rerenderCube() {
        if (this.count === 9) {
            this.cubes.forEach((cube) => {
                this.scene.remove(cube);
            });
            this.count = 0;
            this.cubes.forEach((cube) => {
                if (this.group1.children.includes(cube)) {
                    switch (this.rotType) {
                        case "+y":
                            cube.rotateOnWorldAxis(this.axisy, Math.PI / 2);
                            break;
                        case "+z":
                            cube.rotateOnWorldAxis(this.axisz, Math.PI / 2);
                            break;
                        case "+x":
                            cube.rotateOnWorldAxis(this.axisx, Math.PI / 2);
                            break;
                        case "-y":
                            cube.rotateOnWorldAxis(this.axis_y, Math.PI / 2);
                            break;
                        case "-z":
                            cube.rotateOnWorldAxis(this.axis_z, Math.PI / 2);
                            break;
                        case "-x":
                            cube.rotateOnWorldAxis(this.axis_x, Math.PI / 2);
                            break;
                    }
                }
                this.scene.add(cube);
            });
            this.scene.remove(this.group1);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.mainCamera.getCamera());
        this.controls.update();
    }

    getRandomSym(size) {
        let random = Math.floor((Math.random() * size) - Math.floor(size / 2));
        if (size % 2 != 0) {
            return random
        } else {
            return random + 0.5;
        }
    }

    async solveCube() {
        while (this.moves.length > 0) {
            this.move = this.moves.pop();
            this.rotType = this.move.rot;
            switch (this.rotType) {
                case "-x":
                    this.group1 = this.addWallToGroup("x", this.move.pos);
                    this.rotType = "+x";
                    this.scene.add(this.group1);
                    this.count = 0;
                    window.requestAnimationFrame(() => this.xRotate());
                    break;
                case "+x":
                    this.group1 = this.addWallToGroup("x", this.move.pos);
                    this.rotType = "-x";
                    this.scene.add(this.group1);
                    this.count = 0;
                    window.requestAnimationFrame(() => this.xRotate());
                    break;
                case "-y":
                    this.group1 = this.addWallToGroup("y", this.move.pos);
                    this.rotType = "+y";
                    this.scene.add(this.group1);
                    this.count = 0;
                    window.requestAnimationFrame(() => this.yRotate());
                    break;
                case "+y":
                    this.group1 = this.addWallToGroup("y", this.move.pos);
                    this.rotType = "-y";
                    this.scene.add(this.group1);
                    this.count = 0;
                    window.requestAnimationFrame(() => this.yRotate());
                    break;
                case "-z":
                    this.group1 = this.addWallToGroup("z", this.move.pos);
                    this.rotType = "+z";
                    this.scene.add(this.group1);
                    this.count = 0;
                    window.requestAnimationFrame(() => this.zRotate());
                    break;
                case "+z":
                    this.group1 = this.addWallToGroup("z", this.move.pos);
                    this.rotType = "-z";
                    this.scene.add(this.group1);
                    this.count = 0;
                    window.requestAnimationFrame(() => this.zRotate());
                    break;
            }
            await delay(this.delayTime);
        }
    }

    async shuffleCube(iterations) {
        let randRot = new String;
        for (let i = 0; i < iterations; i++) {
            let randPos = new THREE.Vector3(this.getRandomSym(this.cubeSize), this.getRandomSym(this.cubeSize), this.getRandomSym(this.cubeSize));
            randRot = this.rotTypeArr[Math.floor(Math.random() * 5)];
            this.group1 = this.addWallToGroup(randRot.substring(1, 2), randPos);
            this.rotType = randRot;
            this.scene.add(this.group1);
            this.count = 0;
            switch (randRot) {
                case "+x":
                case "-x":
                    window.requestAnimationFrame(() => this.xRotate());
                    break;
                case "+y":
                case "-y":
                    window.requestAnimationFrame(() => this.yRotate());
                    break;
                case "+z":
                case "-z":
                    window.requestAnimationFrame(() => this.zRotate());
                    break;
            }
            let posClone = new THREE.Vector3(randPos.x, randPos.y, randPos.z);
            let rotClone = this.rotType;
            this.moves.push({
                pos: posClone,
                rot: rotClone
            });
            posClone = null;
            rotClone = null;
            await delay(this.delayTime);
        }
    }

    init(size) {
        this.cubeSize = size;
        this.generateRubikCube(this.cubeSize);
        this.ambientLight.addToScene(this.scene);
        this.directionalLight.addToScene(this.scene);
        this.mainCamera.setStartCameraPosition(this.cubeSize);
        this.controls = new OrbitControls(this.mainCamera.getCamera(), this.renderer.domElement);
        this.controls.update();
        this.renderer.render(this.scene, this.mainCamera.getCamera());
        this.animate();
    }
}

export { Cube }
