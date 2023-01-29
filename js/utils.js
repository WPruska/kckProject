import { init, setStartCameraPosition, shuffleCube, solveCube } from './cube.js';

function start() {
    let size = Number(document.getElementById("howBig").value);
    if(size === null || size === '' || size <= 0){
        let error = document.getElementsByClassName("error");
        error[0].classList.remove("hidden");
    } else{
        init(size);
        let initForm = document.getElementById("initForm");
        initForm.classList.add("hidden");
        let initButton = document.getElementById("initButton");
        initButton.classList.add("hidden");
    }
    
}
function resetView() {
    setStartCameraPosition();
}
document.getElementById("initButton").addEventListener('click', start);
document.getElementById("restView").addEventListener('click', resetView);
document.getElementById("shuffleCube").addEventListener('click', () =>{
    shuffleCube(10);
});
document.getElementById("solveCube").addEventListener('click', solveCube);