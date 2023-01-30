/**
 * @description klasa która inicjalizuje strukturę muzyczną
 */
class Sound {
    /**
     * @description konstruktor klasy Sound
     * 
     * @param type typ pliku audio
     * @param src ścieżka do pliku audio
     * @param isLoop określenie czy dźwięk ma być odtwarzana w pętli
     */
    constructor(type, src, isLoop) {
        this.sound = new Audio();
        this.soundSrc = document.createElement("source");
        this.soundSrc.type = type;
        this.soundSrc.src = src;
        this.sound.appendChild(this.soundSrc);
        this.sound.loop = isLoop;
    }
    
    /**
     * @description funkcja która powoduje włączenie danego dźwięku
     */
    play() {
        this.sound.play();
    }
}

export { Sound }