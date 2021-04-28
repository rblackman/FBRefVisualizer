import { Chart, ChartConfiguration, ChartData, ChartDataset, DefaultDataPoint } from 'chart.js';
import * as React from "react";
import { FC, useCallback } from 'react';
import Stat from '../../types/stat';
import './chart.scss';

const colorCount = 3;

interface Color {
    r: number;
    g: number;
    b: number;
}

interface Props {
    stats: Stat[];
    splitIndexes: number[];
}

function loadColorsFromCssVars(): [Color[], number, Color, Color] {
    const parseColor = (c: string) => ({
        r: parseInt(c.slice(2, 4), 16),
        g: parseInt(c.slice(4, 6), 16),
        b: parseInt(c.slice(6, 8), 16)
    });

    const colors: Color[] = [];
    const styles = getComputedStyle(document.body);
    for (let i = 1; i <= colorCount; i++) {
        const color = styles.getPropertyValue(`--color${i}`);
        colors.push(parseColor(color));
    }
    const alpha: number = parseFloat(styles.getPropertyValue('--alpha'));
    const bg: Color = parseColor(styles.getPropertyValue('--bg'));
    const fg: Color = parseColor(styles.getPropertyValue('--fg'));

    return [colors, alpha, bg, fg];
}

const RadarChart: FC<Props> = (props: Props) => {
    let chart: Chart | null = null;
    const {
        stats,
        splitIndexes,
    } = props;
    const [colors, alpha, bg, fg] = loadColorsFromCssVars();

    function color(index: number, a: number | null = null): string {
        a = a ?? alpha;
        if (colors.length > 0) {
            const idx = index % colors.length;
            const { r, g, b } = colors[idx];
            return `rgba(${r}, ${g}, ${b}, ${a})`;
        }
        return `rgba(0, 255, 255, ${a})`;
    }

    function convertToChartData(): ChartData<'radar', number[], string> {
        const data: ChartData<'radar', number[], string> = {
            labels: transformLabels(),
            datasets: transformValues()
        };
        return data;
    }

    function sectionLabel(index: number): string {
        switch (index) {
            case 0: return 'Attacking';
            case 1: return 'Possession';
            case 2: return 'Defensive';
            default: return 'Unknown';
        }
    }

    function transformLabels(): string[] {
        return stats.map(s => s.name);
    }

    function transformValues(): ChartDataset<'radar', number[]>[] {
        const dataSets: ChartDataset<'radar', number[]>[] = [];
        const startingPoints = [0, ...splitIndexes];

        for (let i = 0; i < startingPoints.length; i++) {
            const last = i == startingPoints.length - 1;
            const start = i == 0 ? 0 : startingPoints[i];
            const end = last ? stats.length : startingPoints[i + 1];

            const data: number[] = [];
            for (let statIndex = 0; statIndex < stats.length; statIndex++) {
                if ((statIndex >= start && statIndex <= end) || (statIndex === 0 && last)) {
                    data.push(stats[statIndex].percentile);
                } else {
                    data.push(0);
                }
            }
            dataSets.push({
                data,
                backgroundColor: color(i),
                label: sectionLabel(i)
            });
        }
        return dataSets;
    }

    const canvasRef = useCallback((node: HTMLCanvasElement) => {
        if (node) {
            if (chart === null && stats.length > 0) {
                const backdropColor = `rgb(${bg.r}, ${bg.g}, ${bg.b})`;
                const color = `rgb(${fg.r}, ${fg.g}, ${fg.b})`;
                const size = 20;

                const config: ChartConfiguration<'radar', DefaultDataPoint<'radar'>, string> = {
                    type: 'radar',
                    data: convertToChartData(),
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                labels: {
                                    color,
                                    font: {
                                        size
                                    }
                                },
                                position: 'right',
                                align: 'start'
                            }
                        },
                        scales: {
                            r: {
                                animate: true,
                                min: 0,
                                max: 100,
                                suggestedMin: 0,
                                suggestedMax: 100,
                                angleLines: {
                                    color
                                },
                                grid: {
                                    color
                                },
                                ticks: {
                                    stepSize: 20,
                                    color,
                                    backdropColor,
                                    font: {
                                        size
                                    }
                                },
                                pointLabels: {
                                    color,
                                    font: {
                                        size
                                    }
                                }
                            }
                        }
                    }
                };
                chart = new Chart(node, config);
            }
        }
    }, [chart, status, splitIndexes]);

    return (
        <canvas ref={canvasRef} className="canvas"></canvas>
    );
};

export default RadarChart;