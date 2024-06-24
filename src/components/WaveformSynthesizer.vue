<template>
    <div class="waveform-synthesizer">
        <!-- タイトル -->
        <h3>波形合成するやつ</h3>
        <!-- 音律選択のラジオボタン -->
        <div>
            <input type="radio" id="meanTones" value="MeanTone" v-model="toneSystemNameRef">
            <label for="meanTones">Mean Tone</label>
            <input type="radio" id="JustIntonation" value="JustIntonation" v-model="toneSystemNameRef">
            <label for="JustIntonation">Just Intonation</label>
            <input type="radio" id="NaturalHarmonics" value="NaturalHarmonics" v-model="toneSystemNameRef">
            <label for="NaturalHarmonics">Natural Harmonics</label>
        </div>
        <!-- 音名のトグルボタン -->
        <div class="keyboard">
            <button v-for="note in availableNotesRef" :key="note" @click="handleNoteToggleButtons(note)"
                :class="['key', { 'white-key': isWhiteKey(note), 'black-key': !isWhiteKey(note), 'selected': selectedNotesRef[note] }]">
                {{ note }}
            </button>
        </div>
        <!-- 再生ボタンとリセットボタン -->
        <div>
            <button @click="handlePlayButton">Play Chord</button>
            <button @click="handleResetButton">Reset Chord</button>
        </div>
        <!-- 波形グラフ -->
        <div>
            <canvas ref="canvasRef" width="600" height="300"></canvas>
        </div>
        <!-- サンプル数調整用のスライドバー -->
        <div>
            <input v-model.number="sampleCountRef" type="range" min="100" max="10000" step="100" placeholder="サンプル数を入力" class="slider"/>
        </div>
        <!-- サンプル数表示と入力欄 -->
        <div>グラフに表示するサンプル数:
            <input v-model.number="sampleCountRef" type="number" min="100" max="10000" step="100" />
        </div>
        <!-- 付帯情報 -->
        <div>
            <p>構成音の周波数: {{ chordFrequenciesRef.join(' Hz, ') }} Hz</p>
            <p>構成音の周期: {{ chordPeriodsRef.map((it, _) => it.toFixed(2)).join(' ms, ') }} ms</p>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import { Chord } from '../composable/Chord'
import { ToneSystem } from '../composable/toneSystems/ToneSystem'
import { MeanToneSystem } from '../composable/toneSystems/MeanToneSystem'
import { NaturalHarmonicsSystem } from '../composable/toneSystems/NaturalHarmonicsSystem'
import { JustIntonationSystem } from '../composable/toneSystems/JustIntonationToneSystem'
import { ChartManager } from '../composable/ChartManager'
import { ChordManager } from '../composable/ChordManager'
import { AudioContextManager } from '../composable/AudioContextManager'
import { SelectedNotes } from '../interfaces/SelectedNotes'

export default defineComponent({
    name: 'WaveformSynthesizer',
    setup() {
        /* 変数宣言 */
        // 定数
        const toneSystemList: ToneSystem[] = 
        [new MeanToneSystem(), new JustIntonationSystem(), new NaturalHarmonicsSystem()]
        const chordManager: ChordManager = new ChordManager(new Chord([], 1)) // 初期値は適当

        // リファレンス
        const canvasRef = ref<HTMLCanvasElement | null>(null) // キャンバス要素のref
        const sampleCountRef = ref<number>(1000) // サンプル数のref
        const chordFrequenciesRef = ref<number[]>([]) // コード構成音の周波数リストのref
        const chordPeriodsRef = ref<number[]>([]) // コード構成音の周期リストのref
        const selectedNotesRef = ref<SelectedNotes>({}) // 選択された音名のフラグ列を管理するオブジェクトのref
        const toneSystemNameRef = ref<string>('MeanTone') // 選択された音律のref
        const availableNotesRef = ref<string[]>(toneSystemList[0].getToneNameList()) // 選択可能な音名のリストのref

        /* watch */
        // sampleCountの変更を監視
        watch(sampleCountRef, (newValue, _oldValue) => {
            // sampleCountはスライドバーおよび入力欄で変更される。
            // サンプル数が変更されたときにグラフを再描画する
            ChartManager.drawChart(canvasRef.value, chordManager.getSoundDataForChart(newValue))
        })

        // toneSystemNameRefの変更を監視
        watch(toneSystemNameRef, (_newValue, _oldValue) => {
            // 音律が変更されたときに選択可能な音名を更新
            const selectedToneSystem = getCurrentToneSystem()
            availableNotesRef.value = selectedToneSystem.getToneNameList()

            // 音律が変わったらリセット
            handleResetButton()
        })

        /* onMounted */
        onMounted(() => {
            // グラフの初期表示
            // canvasがレンダリングされた後にグラフを描画するためマウント時に実行
            ChartManager.drawChart(canvasRef.value, chordManager.getSoundDataForChart(sampleCountRef.value))
        })

        /* 画面操作時に呼び出されるメソッド */
        // 音名のトグルボタンをクリックしたときに実行される関数
        const handleNoteToggleButtons = (note: string) => {
            // 選択された音名をトグル
            selectedNotesRef.value[note] = !selectedNotesRef.value[note]
            // アップデート
            updateChordFrequencies()
        }

        // リセットボタンをクリックしたときに実行される関数
        // 音律の切り替え時にも呼び出されるので注意すること
        const handleResetButton = () => {
            // 選択された音名をリセット
            Object.keys(selectedNotesRef.value).forEach(note => {
                selectedNotesRef.value[note] = false
            })

            // アップデート
            updateChordFrequencies()
        }

        // 再生ボタンをクリックしたときに実行される関数
        const handlePlayButton = () => {
            AudioContextManager.playChord(chordManager.getSoundDataForPlay())
            ChartManager.drawChart(canvasRef.value, chordManager.getSoundDataForChart(sampleCountRef.value))
        }

        /* ヘルパ関数 */
        // 白鍵判定
        const isWhiteKey = (note: string) => {
            // #が含まれていない音名は白鍵
            return !note.includes('#')
        }

        // 現在の音律を取得
        const getCurrentToneSystem = () => {
            return toneSystemList.find(toneSystem => toneSystem.name === toneSystemNameRef.value) || toneSystemList[0]
        }

        // 選択された音名に対応する周波数を設定
        const updateChordFrequencies = () => {
            // 選択された音名を取得
            const selectedNotesArray = Object.keys(selectedNotesRef.value).filter(note => selectedNotesRef.value[note])
            // 選択された音名に対応する周波数を取得
            chordFrequenciesRef.value = selectedNotesArray.map(note => getCurrentToneSystem().getFrequencyByToneName(note))
            // 新しい Chord インスタンスを作成して初期化
            const newChord = new Chord(chordFrequenciesRef.value, 1)
            // 選択された音名に対応する周期を表示用に取得
            chordPeriodsRef.value = newChord.periods
            chordManager.updateAudioBuffer(newChord)
            // グラフを再描画
            ChartManager.drawChart(canvasRef.value, chordManager.getSoundDataForChart(sampleCountRef.value))
        }

        return {
            // UI関連のメソッド
            handleNoteToggleButtons,
            handlePlayButton,
            handleResetButton,
            // リファレンス
            canvasRef,
            sampleCountRef,
            chordFrequenciesRef,
            chordPeriodsRef,
            selectedNotesRef,
            toneSystemNameRef,
            availableNotesRef,
            // 画面の修飾用メソッド
            isWhiteKey,
        }
    }
})
</script>

<style>
.waveform-synthesizer {
    width: 600px;
}

.slider {
  width: 60%
}

.keyboard {
    display: flex;
    flex-wrap: wrap;
}
.key {
    margin: 2px;
    padding: 10px 20px;
    border: 1px solid #ccc;
    cursor: pointer;
    font-size: 0.8em
}
.white-key {
    background-color: white;
    color: black;
    width: 20%;
}
.black-key {
    background-color: black;
    color: white;
    width: 16%;
}
.selected {
    background-color: darkcyan;
}
</style>