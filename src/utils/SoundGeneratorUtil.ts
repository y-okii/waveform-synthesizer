import { AudioContextManager } from '../composable/AudioContextManager'
export class SoundGeneratorUtil {

    static calcCombinedSineWave(frequencies: number[], duration: number): AudioBuffer {
        // 説明変数を準備
        const audioContext = AudioContextManager.getAudioContext()
        const sampleRate = audioContext.sampleRate // サンプリングレート
        const length = sampleRate * duration // 時間
        const buffer = audioContext.createBuffer(1, length, sampleRate) // バッファを生成
        const channelData = buffer.getChannelData(0) // モノラルなので0番目のチャンネルを取得

        // Σsin(2πft)を計算
        const combinedWaveData = Array.from({ length }, (_, i) =>
            frequencies.reduce((acc, freq) => acc + Math.sin((2 * Math.PI) * freq * (i / sampleRate)), 0)
        )

        // newDataを正規化する
        const normalizedData = this.normalizeData(combinedWaveData)

        // チャンネルに頭からデータを詰めていく
        normalizedData.forEach((value, index) => {
            channelData[index] = value;
        })

        return buffer;
    }

    // 新しいメソッド: normalizeData
    static normalizeData(data: number[]): number[] {
        const max = Math.max(...data)
        const min = Math.min(...data)
        const absMax = Math.max(Math.abs(max), Math.abs(min))
        return data.map((value) => value / absMax)
    }
}