import { Chart, ChartConfiguration , registerables} from 'chart.js'
import { AudioContextManager } from './AudioContextManager'
export class ChartManager {
    private static registerd = false
    private static chartInstance: Chart | null

    static drawChart(canvas: HTMLCanvasElement | null, soundData: number[]) {
        if (!ChartManager.registerd) {
            Chart.register(...registerables)
        }

        if (ChartManager.chartInstance) {
            ChartManager.chartInstance.destroy() // 既存のグラフを破棄
        }

        const ctx =canvas?.getContext('2d')
        if (!ctx) return

        ChartManager.chartInstance= new Chart(ctx, this.getChartConfig(soundData))
    }
    
    private static getChartConfig(soundData: number[]){
        const labels: string[] = soundData.map(
            (_, i) => (
                (i / AudioContextManager.getAudioContext().sampleRate * 1000).toFixed(2)
            ).toString()
        )

        const chartConfig: ChartConfiguration = {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Sound Data',
                        data: soundData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        tension: 0,
                    },
                ],
            },
            options: {
                animation: false, // アニメーションはしない
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Time (ms)',
                        },
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Amplitude',
                        },
                    }
                },
                plugins: {
                    legend: {
                        display: false, // 凡例を非表示にする
                    },
                },
            },
        }
        return chartConfig
    }
}