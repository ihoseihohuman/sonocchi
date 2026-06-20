export interface Pin {
    bx: number; // 中心からの基準xオフセット
    by: number; // 基準y
    x: number;
    y: number;
    r: number;
    down: boolean;
    vx: number;
    vy: number;
    fall: number; // 0=立っている, 0<fall<1=倒れ中, 1=倒れた
    persp: number;
}

export interface Ball {
    x: number;
    y: number;
    r: number;
    vx: number;
    vy: number;
    moving: boolean;
}

export interface Bumper {
    x: number;
    y: number;
    r: number;
    flash: number;
}

export interface Guard {
    x: number;
    y: number;
    w: number;
    h: number;
    vx: number;
    rangeHW: number;
}

export type GameStatus =
    | 'idle'
    | 'ready'
    | 'aiming'
    | 'rolling'
    | 'settling'
    | 'counting'
    | 'over';

export interface Vec {
    x: number;
    y: number;
}
