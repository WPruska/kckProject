class Music {
    constructor(type, src, isLoop) {
        this.sound = new Audio();
        this.soundSrc = document.createElement("source");
        this.soundSrc.type = type;
        this.soundSrc.src = src;
        this.sound.appendChild(this.soundSrc);
        this.sound.loop = isLoop;
    }
    
    play() {
        this.sound.play();
    }
}

export { Music }