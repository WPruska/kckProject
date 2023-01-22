const width = 10;
const height = width *(window.innerHeight/window.innerWidth);

const scene = new THREE.Scene();

let loader = new THREE.TextureLoader();

const geometry = new THREE.BoxGeometry(1, 1, 1);
let materialArray = [
    new THREE.MeshStandardMaterial( { map: loader.load("img/red.png") } ),
    new THREE.MeshStandardMaterial( { map: loader.load("img/green.png") } ),
    new THREE.MeshStandardMaterial( { map: loader.load("img/yellow.png") } ),
    new THREE.MeshStandardMaterial( { map: loader.load("img/blue.png") } ),
    new THREE.MeshStandardMaterial( { map: loader.load("img/white.png") } ),
    new THREE.MeshStandardMaterial( { map: loader.load("img/orange.png") } ),
];

let cubes = new Array();

for(let i = 0; i<= 2; i++){
    cubes[i] = new Array();
    for(let j = 0; j<= 2; j++){
        cubes[i][j] = new Array();
    }
}

for(let i = -1; i<= 1; i++){
    for(let j = -1; j<= 1; j++){
        for(let k = -1; k<= 1; k++){
            const cube = new THREE.Mesh(geometry, materialArray);
            cube.position.set(i,j,k);
            scene.add(cube);
            cubes[i+1][j+1][k+1] = cube;
        }
    }
}

const light = new THREE.AmbientLight( 0xffffff, 0.6); 
light.position.set(10,20,0);
scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set(10,20,0);
scene.add( directionalLight );


var group = new THREE.Group();
group.attach(cubes[0][0][0]);
group.attach(cubes[0][0][1]); 
group.attach(cubes[0][0][2]);
group.attach(cubes[0][1][1]);
group.attach(cubes[0][1][0]);
group.attach(cubes[0][1][2]);
group.attach(cubes[0][2][0]);
group.attach(cubes[0][2][1]);
group.attach(cubes[0][2][2]);
group.position.set(0,0,0);
scene.add(group);

const camera = new THREE.OrthographicCamera(
    width/-2,
    width/2,
    height/2,
    height/-2,
    1,
    100
);
 
camera.position.set(4,4,4);
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.render(scene, camera);
let count = 0;

function animate() {
    setTimeout(()=>{
        group.rotation.x += Math.PI/16;
        renderer.render(scene, camera);
        count++;
        if (count<8) {
            window.requestAnimationFrame(animate);
        }
    },100);
}

window.addEventListener("click", ()=>{
    count = 0
    window.requestAnimationFrame(animate);
});
