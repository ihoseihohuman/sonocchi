// ボウリングのスコア計算(標準ルール)。元の totalScore / buildFrames / symbolFor を純関数化。

export function totalScore(frameRolls: number[][]): number {
    let total = 0;
    const flat: number[] = [];
    for (let f = 0; f < 10; f++) frameRolls[f].forEach((v) => flat.push(v));
    let idx = 0;
    for (let f = 0; f < 10; f++) {
        if (frameRolls[f].length === 0) break;
        if (frameRolls[f][0] === 10 && f < 9) {
            total += 10 + (flat[idx + 1] || 0) + (flat[idx + 2] || 0);
            idx += 1;
        } else if (f < 9 && frameRolls[f].length >= 2 && frameRolls[f][0] + frameRolls[f][1] === 10) {
            total += 10 + (flat[idx + 2] || 0);
            idx += 2;
        } else {
            total += frameRolls[f].reduce((a, b) => a + b, 0);
            idx += frameRolls[f].length;
        }
    }
    return total;
}

// 各フレームの累積スコア(確定していなければ null)
export function cumulativeScores(frameRolls: number[][]): (number | null)[] {
    const cum: (number | null)[] = [];
    let run = 0;
    const flat: number[] = [];
    frameRolls.forEach((fr) => fr.forEach((v) => flat.push(v)));
    let idx = 0;
    for (let f = 0; f < 10; f++) {
        if (frameRolls[f].length === 0) {
            cum.push(null);
            continue;
        }
        let add = 0;
        let counted = true;
        if (frameRolls[f][0] === 10 && f < 9) {
            if (flat[idx + 1] !== undefined && flat[idx + 2] !== undefined) add = 10 + flat[idx + 1] + flat[idx + 2];
            else counted = false;
            idx += 1;
        } else if (f < 9 && frameRolls[f].length >= 2 && frameRolls[f][0] + frameRolls[f][1] === 10) {
            if (flat[idx + 2] !== undefined) add = 10 + flat[idx + 2];
            else counted = false;
            idx += 2;
        } else {
            add = frameRolls[f].reduce((a, b) => a + b, 0);
            if (f < 9 && frameRolls[f].length < 2) counted = false;
            idx += frameRolls[f].length;
        }
        if (counted) {
            run += add;
            cum.push(run);
        } else cum.push(null);
    }
    return cum;
}

// スコア表のマスに出す記号(X / / / 数字 / -)
export function frameSymbol(frameRolls: number[][], f: number, ri: number): string {
    const r = frameRolls[f];
    if (r[ri] === undefined) return '';
    const v = r[ri];
    if (f < 9) {
        if (ri === 0 && v === 10) return 'X';
        if (ri === 1 && r[0] + v === 10) return '/';
    } else {
        if (v === 10) return 'X';
        if (ri > 0 && r[ri - 1] !== 10 && r[ri - 1] + v === 10) return '/';
        if (ri === 2 && r[1] === 10) return v === 10 ? 'X' : String(v);
    }
    return v === 0 ? '-' : String(v);
}
