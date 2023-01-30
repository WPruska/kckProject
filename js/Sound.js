/**
 * @description Klasa która inicjalizuje strukturę dźwiękową
 */
class Sound {
    /**
     * @description Konstruktor klasy Sound
     * 
     * @param type Typ pliku audio
     * @param src Ścieżka do pliku audio
     * @param isLoop Określenie czy dźwięk ma być odtwarzana w pętli
     */
    constructor(type, src, isLoop) {
        this.sound = new Audio(); //Bazowa struktura dźwiękowa
        this.soundSrc = document.createElement("source");
        this.soundSrc.type = type;
        this.soundSrc.src = src;
        this.sound.appendChild(this.soundSrc);
        this.sound.loop = isLoop;
    }

    /**
     * @description Funkcja która powoduje włączenie danego dźwięku
     */
    play() {
        this.sound.play();
    }
}

export { Sound }