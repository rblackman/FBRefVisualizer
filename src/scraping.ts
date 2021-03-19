import PlayerInfo from "./types/playerInfo";
import PlayerPosition from "./types/playerPosition";
import Stat from "./types/stat";

function loadName(): string {
    return document
        .querySelector('h1[itemprop=name]')?.textContent?.trim() ?? 'Unknown';
}

function loadPosition(): PlayerPosition {
    const switcher = document.getElementById('all_scout');
    const element = switcher?.querySelector('.current .sr_preset') as HTMLAnchorElement;
    if (element) {
        switch (element.innerText) {
            case 'vs. Fullbacks':
                return 'fullback';
            case 'vs. Forwards':
                return 'forward';
            case 'vs. Midfielders':
                return 'midfield';
            case 'vs. Att Mid / Wingers':
                return 'attacking mid';
            case 'vs. Center Backs':
                return 'center back';
        }
    }
    return null;
}

function getPlayerInfo(): PlayerInfo {
    const name = loadName();
    const position = loadPosition();
    return {
        name,
        position
    };
}

function getCsvId(type: PlayerPosition): string {
    const base = 'csv_scout_summary_';
    switch (type) {
        case 'center back':
            return `${base}CB`;
        case 'forward':
            return `${base}FW`;
        case 'fullback':
            return `${base}FB`;
        case 'midfield':
            return `${base}MF`;
        case 'attacking mid':
            return `${base}AM`;
        default: return base;
    }
}

function loadSummaryData(type: PlayerPosition): string | null {
    const csvId = getCsvId(type);
    const summary = document.getElementById(csvId);
    if (summary) {
        return summary.innerText;
    }
    clickCsvButton();
    return document.getElementById(csvId)?.innerText || null;
}

function clickCsvButton(): void {
    const container = document.getElementById('all_scout');
    if (container) {
        container
        document
            .querySelectorAll('button')
            .forEach(item => {
                if (item.innerText === 'Get table as CSV (for Excel)') {
                    item.click();
                    return;
                }
            });
    }
}

function splitLines(summary: string): string[] {
    return summary
        .split(/\r?\n/)
        .slice(5);// skip first few lines of garbage
}

function parseSummary(splits: string[]): Stat[] {
    return splits
        .filter(line => line !== ',,')
        .map(line => line.split(','))
        .map(line => ({ name: line[0], per90: parseFloat(line[1]), percentile: parseFloat(line[2]) }));
}

function getSplitIndexes(lines: string[]): number[] {
    return lines.reduce(
        (accumulator, line, index) => (line === ',,' && accumulator.push(index - accumulator.length), accumulator),
        new Array<number>());
}

export function canScrape(): boolean {
    return document.getElementById('all_scout') !== null;
}

export default function scrape(): [PlayerInfo, Stat[], number[]] | null {
    const info = getPlayerInfo();
    const summary = loadSummaryData(info.position);
    if (summary) {
        const lines = splitLines(summary);
        const stats = parseSummary(lines);
        const splitIndexes = getSplitIndexes(lines);
        return [info, stats, splitIndexes];
    }
    console.warn('Couldn\'t load data');
    return null;
}