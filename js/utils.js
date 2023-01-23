import { init } from './cube.js';

function start()
{
    init();
}
document.querySelector('button').addEventListener('click', start);