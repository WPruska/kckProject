import { init, setStartCameraPosition } from './cube.js';

function start() {
    init();
    let initButton = document.getElementById("initButton");
    initButton.classList.add("hidden");
}
function resetView() {
    setStartCameraPosition();
}
document.getElementById("initButton").addEventListener('click', start);
document.getElementById("restView").addEventListener('click', resetView);