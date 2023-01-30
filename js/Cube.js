/**
 * @description Klasa przechowująca strukturę kostki rubika
 */
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import * as THREE from "../node_modules/three/build/three.module.js";

/**
 * 
 * @description Opóźnienie które powoduje powodzenie się animacji w płynny sposób i wykonania sygnałów obrotu przy mieszaniu i rozwiązywaniu kostki
 */
const delay = async (ms = 1000) =>
    new Promise(resolve => setTimeout(resolve, ms))
class Cube {
    /**
     * @description Konstruktor Kostki Rubika
     * 
     * @param scene Scena na które znajduje się kostka
     * @param size Rozmiar kostki
     * @param cubeSound Dźwięk używany przy obrocie kostki
     * @param camera Kamera która jest używa dla kostki
     * @param renderer Renderer który wyświetla kostkę
     */
    constructor(scene, size, cubeSound, camera, renderer) {
        this.scene = scene;//Scena na której znajduje się kostka
        this.geometry = new THREE.BoxGeometry(1, 1, 1); //Wielkość pojedyńczej kostki
        this.materialArray = [
            new THREE.MeshStandardMaterial({ map: Cube.loader.load("img/red.png") }),
            new THREE.MeshStandardMaterial({ map: Cube.loader.load("img/orange.png") }),
            new THREE.MeshStandardMaterial({ map: Cube.loader.load("img/white.png") }),
            new THREE.MeshStandardMaterial({ map: Cube.loader.load("img/yellow.png") }),
            new THREE.MeshStandardMaterial({ map: Cube.loader.load("img/blue.png") }),
            new THREE.MeshStandardMaterial({ map: Cube.loader.load("img/green.png") }),
        ]; //Mapa grafik ścianek kostek
        this.cubes = new Array(); //Lista przechowująca pojedyńcze kostki Kostki Rubika
        this.group1; //Grupa przechowująca strukturę elementów potrzebnych do operacji
        this.mainCamera = camera; //Kamera do której się odwołuje kostka
        this.renderer = renderer; //Renderer który wyświetla kostkę
        this.count = 0; //Zmienna służąca do wykonania poprawnie animacji obrotów
        this.controls; //Kontroler OrbitControls który umożliwa poruszanie kamerą
        this.pointer = new THREE.Vector2(); //Zmienna przechowująca współrzędne klikniętej kostki Kostki Rubika
        this.raycaster = new THREE.Raycaster(); //Zmienna pommocna do określenia która kostka została kliknięta
        this.clickedPosition; //Pozycja klikniętej kostki
        this.cubeSound = cubeSound; //Dźwięk używany w trakcie animacji obrotu
        this.rotType; //Zmienna przechowująca typ wykonywanego obrotu
        this.moves = new Array(); //Lista przechowująca wszystkie wykonane ruchy na kostce
        this.cubeSize = 3; //Wymiar kostki
        this.delayTime = 250 * this.cubeSize; //Delay między ruchami w shuffle i solve w [ms]
        this.init(size);

        /**
         * @description Event który przechowuje informacje o klikniętej kostce Kostki Rubika
         */
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

        /**
         * @description Event, który określa co ma się dziać z kostką przy kliknięciu konkretnego przyciska od rotacji
         */
        window.addEventListener("keydown", (event) => {
            if (this.clickedPosition != null) {
                switch (event.key) {
                    case "x":
                        this.requestMove("x", "+x", this.clickedPosition);
                        break;
                    case "X":
                        this.requestMove("x", "-x", this.clickedPosition);
                        break;
                    case "c":
                        this.requestMove("y", "+y", this.clickedPosition);
                        break;
                    case "C":
                        this.requestMove("y", "-y", this.clickedPosition);
                        break;
                    case "z":
                        this.requestMove("z", "+z", this.clickedPosition);
                        break;
                    case "Z":
                        this.requestMove("z", "-z", this.clickedPosition);
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
    static loader = new THREE.TextureLoader(); //Zmienna służąca do ładowania textur
    static shuffleIterations = 10; //Ilość przetasowań
    static rotTypeArr = ["+x", "-x", "+y", "-y", "+z", "-z"]; //Typy obrotów osi
    static axisy = new THREE.Vector3(0, 1, 0);//Wektor 3D obrotu na osi Y
    static axisz = new THREE.Vector3(0, 0, 1);//Wektor 3D obrotu na osi Z
    static axisx = new THREE.Vector3(1, 0, 0);//Wektor 3D obrotu na osi X
    static axis_y = new THREE.Vector3(0, -1, 0);//Wektor 3D obrotu przeciwnie do osi Y
    static axis_z = new THREE.Vector3(0, 0, -1);//Wektor 3D obrotu przeciwnie do osi Z
    static axis_x = new THREE.Vector3(-1, 0, 0);//Wektor 3D obrotu przeciwnie do osi X

    /**
     * @description Funkcja inicjalizująca kostkę, wraz z Kontrolerem kamery
     * 
     * @param size Rozmiar kostki, która zostanie wygenerowana
     */
    init(size) {
        this.cubeSize = size;
        this.generateRubikCube(this.cubeSize);
        this.mainCamera.setStartCameraPosition(this.cubeSize);
        this.controls = new OrbitControls(this.mainCamera.getCamera(), this.renderer.domElement);
        this.controls.update();
        this.renderer.render(this.scene, this.mainCamera.getCamera());
        this.animate();
    }

    /**
     * @description Funkcja odpowiedzlana za utworzenie kostek Kostki Rubika
     * 
     * @param size Rozmiar kostki, która zostanie wygenerowana
     */
    generateRubikCube(size) {
        let stardCord = -(size * 0.5 - 0.5); //obliczenie skrajnych współrzędnych kostki, aby jej środek znajdował się idealnie w punkcie 0x0x0
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

    /**
     * @description Funkcja wymagana do odświeżenia położenia kamery kostki
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        this.renderer.render(this.scene, this.mainCamera.getCamera());
        this.controls.update();
    }

    /**
     * @description Funkcja ustawiająca nowe współrzędne kostek Kostki Rubika po wykonaniu obrotu, na podstawie obrotu 3D
     * 
     * @param type Oś wookół, której został wykonany obrót
     */
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

    /**
     * @description Funkcja dodająca wszystkie kostki Kostki Rubika, na których wykonywana będzie animacja do grupy
     * 
     * @param type Oś wookół, której został wykonany obrót
     * @param position Pozycja kostki która wywołała animację
     * @returns Grupa wybranych kostek na których będzie wykonywana animacja
     */
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

    /**
     * @description Funkcja która wykonuje animację obrotu kostki
     * 
     * @param type Typ obrotu osi wraz z określeniem storny obrotu wookół tej osi
     */
    rotate(type) {
        setTimeout(() => {
            switch (this.rotType) {
                case '+x':
                    this.group1.rotation.x += Math.PI / 16;
                    break;
                case '-x':
                    this.group1.rotation.x -= Math.PI / 16;
                    break;
                case '+y':
                    this.group1.rotation.y += Math.PI / 16;
                    break;
                case '-y':
                    this.group1.rotation.y -= Math.PI / 16;
                    break;
                case '+z':
                    this.group1.rotation.z += Math.PI / 16;
                    break;
                case '-z':
                    this.group1.rotation.z -= Math.PI / 16;
                    break;
            }
            this.renderer.render(this.scene, this.mainCamera.getCamera());
            this.count++;
            if (this.count == 4) {
                this.cubeSound.play();
            }
            if (this.count < 8) {
                window.requestAnimationFrame(() => this.rotate(type));
            } else {
                this.refreshPositions(type);
            }
        }, 30);
    }

    /**
     * @description Funkcja wywoływana do ponownego wygenerowania kostki na scenie z poprawnymi współrzędnymi po wykonaniu obrotu
     */
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
                            cube.rotateOnWorldAxis(Cube.axisy, Math.PI / 2);
                            break;
                        case "+z":
                            cube.rotateOnWorldAxis(Cube.axisz, Math.PI / 2);
                            break;
                        case "+x":
                            cube.rotateOnWorldAxis(Cube.axisx, Math.PI / 2);
                            break;
                        case "-y":
                            cube.rotateOnWorldAxis(Cube.axis_y, Math.PI / 2);
                            break;
                        case "-z":
                            cube.rotateOnWorldAxis(Cube.axis_z, Math.PI / 2);
                            break;
                        case "-x":
                            cube.rotateOnWorldAxis(Cube.axis_x, Math.PI / 2);
                            break;
                    }
                }
                this.scene.add(cube);
            });
            this.scene.remove(this.group1);
        }
    }

    /**
     * @description Funkcja używana do wygenerowania losowych współrzędnych kostek na których wykonywany bedzie obród przy mieszaniu Kostki Rubika
     * 
     * @param size Wielkość Kostki Rubika
     * @returns 
     */
    getRandomSym(size) {
        let random = Math.floor((Math.random() * size) - Math.floor(size / 2));
        if (size % 2 != 0) {
            return random
        } else {
            return random + 0.5;
        }
    }

    /**
     * @description Funkcja używana do układania Kostki Rubika, która wykonuje wsteczne ruchy które zostały wykonane na Kostce Rubika
     */
    async solveCube() {
        let move = {};
        while (this.moves.length > 0) {
            move = this.moves.pop();
            this.rotType = move.rot;
            switch (this.rotType) {
                case "-x":
                    this.requestMove("x", "+x", move.pos);
                    break;
                case "+x":
                    this.requestMove("x", "-x", move.pos);
                    break;
                case "-y":
                    this.requestMove("y", "+y", move.pos);
                    break;
                case "+y":
                    this.requestMove("y", "-y", move.pos);
                    break;
                case "-z":
                    this.requestMove("z", "+z", move.pos);
                    break;
                case "+z":
                    this.requestMove("z", "-z", move.pos);
                    break;
            }
            await delay(this.delayTime);
        }
    }

    /**
     * @description Funkcja, która określa co ma się dziać w trakcie wykonywania obrotu
     * 
     * @param axis Oś wookół której wykonywany jest ruch
     * @param axisType Określenie typu obrotu czy jest wykonywany w kierunku osi czy w przeciwnym
     * @param requestedPosition Współrzędne punktu który wywołał animację
     */
    requestMove(axis, axisType, requestedPosition) {
        this.group1 = this.addWallToGroup(axis, requestedPosition);
        this.rotType = axisType;
        this.scene.add(this.group1);
        this.count = 0;
        window.requestAnimationFrame(() => this.rotate(axis));
    }

    /**
     * @description Funkcja która wywołuje miszanie się kostki
     * 
     * @param iterations Ilość ruchów do wykonania na kostce
     */
    async shuffleCube(iterations) {
        let randRot = new String;
        for (let i = 0; i < iterations; i++) {
            let randPos = new THREE.Vector3(this.getRandomSym(this.cubeSize), this.getRandomSym(this.cubeSize), this.getRandomSym(this.cubeSize));
            randRot = Cube.rotTypeArr[Math.floor(Math.random() * 5)];
            this.group1 = this.addWallToGroup(randRot.substring(1, 2), randPos);
            this.rotType = randRot;
            this.scene.add(this.group1);
            this.count = 0;
            switch (randRot) {
                case "+x":
                case "-x":
                    window.requestAnimationFrame(() => this.rotate("x"));
                    break;
                case "+y":
                case "-y":
                    window.requestAnimationFrame(() => this.rotate("y"));
                    break;
                case "+z":
                case "-z":
                    window.requestAnimationFrame(() => this.rotate("z"));
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
}

export { Cube }
