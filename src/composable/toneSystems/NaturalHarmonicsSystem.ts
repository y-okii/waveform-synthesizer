import { ToneSystem } from './ToneSystem';
export class NaturalHarmonicsSystem implements ToneSystem  {
    name = 'NaturalHarmonics'
    tonesList = [
        { toneName: 'Do4', frequency: 261.63 },
        { toneName: 'Do5', frequency: 523.26 },
        { toneName: 'Sol5', frequency: 784.89 },
        { toneName: 'Do6', frequency: 1046.52 },
        { toneName: 'Mi6', frequency: 1308.15 },
        { toneName: 'Sol6', frequency: 1569.78 },
        { toneName: 'La6#', frequency: 1831.41 },
        { toneName: 'Do7', frequency: 2093.04 },
        { toneName: 'Re7', frequency: 2354.67 },
        { toneName: 'Mi7', frequency: 2616.30 },
        { toneName: 'Fa7#', frequency: 2877.93 },
        { toneName: 'Sol7', frequency: 3139.56 },
        { toneName: 'Sol7#', frequency: 3401.19 },
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