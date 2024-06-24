export class Chord {
    frequencies: number[] // 和音を構成する周波数の配列（Hz）
    duration: number // 和音の長さ
    periods: number[] // 和音を構成する周期の配列（ms）
    
    constructor(frequencies: number[], duration: number) {
      // 初期化
      this.frequencies = frequencies
      this.duration = duration
      this.periods = this.frequencies.map(frequency => 1 / frequency * 1000)
    }
}