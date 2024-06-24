export interface ToneSystem {
    name: string;
    tonesList: {toneName: string, frequency: number}[]

    getToneNameList(): string[]
    getFrequencyByToneName(toneName: string): number
}