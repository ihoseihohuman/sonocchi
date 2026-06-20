// キャンバス・レーン寸法と物理パラメータ。元の単一HTML版の数値をそのまま踏襲。

export const W = 340;
export const H = 520;
export const cx = W / 2;

// レーン(奥が小さい簡易遠近)
export const laneTop = 70;
export const laneBot = 470;
export const topHW = 70; // 上辺のレーン半幅
export const botHW = 130; // 下辺のレーン半幅

// ピン
export const PIN_Y = laneTop + 165; // 1番ピン(手前)
export const pinSpread = 24;

// 弾(そのっち)
export const START_X = cx;
export const START_Y = laneBot - 34;
export const BALL_R = 20;

// モンスト風パラメータ
export const FRICTION = 0.984; // 1フレームの減速
export const MIN_SPEED = 4; // 最弱発射速度
export const MAX_SPEED = 16; // 最強発射速度
export const MAX_PULL = 120; // 引っ張り距離の上限(px)
export const STOP_SPEED = 0.55; // これ未満で停止

// y位置でのレーン半幅
export function laneEdge(y: number): number {
    const t = (y - laneTop) / (laneBot - laneTop);
    return topHW + (botHW - topHW) * t;
}

export const HINT_START = '「ゲームスタート」を押してね！';
export const HINT_PLAY = 'そのっちを引っ張って離すと発射！壁やピンに当たって跳ね返り、ピンを倒そう🎳';
export const HINT_NEXT = 'そのっちを引っ張って離すと発射！';
export const HINT_BONUS = '10フレーム目！ボーナス発射！引っ張って離そう！';
export const HINT_GO = 'いけー！そのっち！🎳';
