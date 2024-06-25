import { ToneSystem } from './ToneSystem';
export class PureIntonationSystem implements ToneSystem  {
    name = 'PureIntonation'
    tonesList = [
        { toneName: 'Do4', frequency: 261.63 },
        { toneName: 'Re4', frequency: 294.33 },
        { toneName: 'Mi4', frequency: 327.04 },
        { toneName: 'Fa4', frequency: 348.84 },
        { toneName: 'Sol4', frequency: 392.44 },
        { toneName: 'La4', frequency: 436.05 },
        { toneName: 'Ti4', frequency: 490.89 },
        { toneName: 'Do5', frequency: 523.26 }
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