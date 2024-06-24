/**
 * AudioContextを管理する
 * AudioContextは一つのアプリケーション内で一つなのでシングルトンとする
 * ついでに、コードの再生も行う
 */
export class AudioContextManager  {
    private static instance: AudioContext;

    static getAudioContext(): AudioContext {
        if (!this.instance) {
            this.instance = new AudioContext();
        }
        return this.instance;
    }

    static playChord(audioBuffer: AudioBuffer) {
        const audioContext = AudioContextManager.getAudioContext()
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer
        source.connect(audioContext.destination);
        source.start();
    }
}
