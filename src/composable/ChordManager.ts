import { SoundGeneratorUtil } from '../utils/SoundGeneratorUtil'
import { Chord } from '../composable/Chord'

/**
 * ChordManagerクラス
 * 今どのコードを解析しているかを保持する
 * また、コードの波形を生成する
 * 
 */
export class ChordManager {
    chord: Chord
    audioBuffer: AudioBuffer
    
    constructor(chord: Chord) {
      // 初期化
      this.chord = chord
      // 波形を生成
      this.audioBuffer = SoundGeneratorUtil.calcCombinedSineWave(this.chord.frequencies, this.chord.duration)
    }
    
    getSoundDataForPlay(): AudioBuffer {
        return this.audioBuffer
    }

    getSoundDataForChart(sampleNum: number = 1000): number[] {
        // 1000サンプル分のデータを返す
        // audioBufferの仕様より、-1～+1の間で正規化されていることを前提としている
        // sampleNumがaudioBufferの長さを超える場合は、audioBufferの長さまでのデータを返す
        if (sampleNum > this.audioBuffer.length) {
            sampleNum = this.audioBuffer.length
            }
        return Array.from(
            this.audioBuffer.getChannelData(0).slice(0, sampleNum)
        )
    }
    
    updateAudioBuffer(chord: Chord) {
        this.audioBuffer = SoundGeneratorUtil.calcCombinedSineWave(chord.frequencies, chord.duration)
    }
}