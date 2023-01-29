import { Cube } from './Cube.js';

let cube;

function start() {
    let size = Number(document.getElementById("howBig").value);
    if(size === null || size === '' || size <= 0){
        let error = document.getElementsByClassName("error");
        error[0].classList.remove("hidden");
    } else{
        cube = new Cube(size);
        let initForm = document.getElementById("initForm");
        initForm.classList.add("hidden");
        let initButton = document.getElementById("initButton");
        initButton.classList.add("hidden");
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