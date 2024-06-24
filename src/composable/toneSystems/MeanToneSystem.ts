import { ToneSystem } from './ToneSystem'
export class MeanToneSystem implements ToneSystem  {
    name = 'MeanTone'
    tonesList = [
        { toneName: 'Do4', frequency: 261.63 },
        { toneName: 'Do4#', frequency: 277.18 },
        { toneName: 'Re4', frequency: 293.66 },
        { toneName: 'Re4#', frequency: 311.13 },
        { toneName: 'Mi4', frequency: 329.63 },
        { toneName: 'Fa4', frequency: 349.23 },
        { toneName: 'Fa4#', frequency: 369.99 },
        { toneName: 'Sol4', frequency: 392.00 },
        { toneName: 'Sol4#', frequency: 415.30 },
        { toneName: 'La4', frequency: 440.00 },
        { toneName: 'La4#', frequency: 466.16 },
        { toneName: 'Ti4', frequency: 493.88 },
        { toneName: 'Do5', frequency: 523.25 }
    ]

    getToneNameList(): string[] {
        return this.tonesList.map(tone => tone.toneName)
    }

    // 音名から周波数を取得
    getFrequencyByToneName(toneName: string): number {
        const tone = this.tonesList.find(tone => tone.toneName === toneName)
        if (tone) {
            return tone.frequency
        } else {
            throw new Error('Tone not found')
        }
    }
}