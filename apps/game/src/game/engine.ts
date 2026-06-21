import {
    W, H, cx, laneTop, laneBot, topHW, botHW, PIN_Y, pinSpread,
    START_X, START_Y, BALL_R, FRICTION, MIN_SPEED, MAX_SPEED, MAX_PULL, STOP_SPEED,
    laneEdge, HINT_PLAY, HINT_NEXT, HINT_BONUS, HINT_GO,
} from './constants';
import type { Ball, Bumper, Guard, Pin, GameStatus, Vec } from './types';
import { sfx } from './audio';
import { totalScore } from './scoring';
import { drawSonotchiVector } from './face';
import { useGameStore, type GameStore } from '../store/gameStore';

// ゲーム本体。キャンバスに対して描画ループ・物理・入力・進行を司り、
// React に見せたい状態は zustand store に push する。
export class GameEngine {
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private rafId = 0;

    private pins: Pin[] = [];
    private bumpers: Bumper[] = [];
    private guard: Guard | null = null;
    private ball: Ball = { x: START_X, y: START_Y, r: BALL_R, vx: 0, vy: 0, moving: false };

    private frame = 1;
    private roll = 1;
    private before = 10;
    private tick = 0;
    private state: GameStatus = 'ready';
    private started = false;
    private gameOver = false;
    private frameRolls: number[][] = Array.from({ length: 10 }, () => [] as number[]);

    private dragging = false;
    private dragStart: Vec = { x: 0, y: 0 };
    private dragNow: Vec = { x: 0, y: 0 };

    private sonImg: HTMLImageElement | null = null;
    private sonImgReady = false;

    constructor() {
        this.setupPins();
    }

    // ---- React への状態反映 ----
    private push(extra: Partial<GameStore> = {}): void {
        useGameStore.getState().patch({
            frame: this.frame,
            roll: this.roll,
            score: totalScore(this.frameRolls),
            frameRolls: this.frameRolls.map((r) => r.slice()),
            started: this.started,
            gameOver: this.gameOver,
            status: this.state,
            ...extra,
        });
    }
    private flash(text: string, dim = false): void {
        useGameStore.getState().showFlash(text, dim);
    }

    // ---- ライフサイクル ----
    attach(canvas: HTMLCanvasElement): void {
        this.detach();
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.loadPhoto();
        canvas.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
        this.push();
        this.loop();
    }
    detach(): void {
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = 0;
        if (this.canvas) this.canvas.removeEventListener('pointerdown', this.onPointerDown);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);
    }

    start(): void {
        this.started = true;
        // BGM(30秒クリップをループ再生)。start はボタン操作から呼ばれるので自動再生制限を回避できる。
        sfx.startBgm(`${import.meta.env.BASE_URL || '/'}Perfect_Game_Professor.mp3`);
        this.resetGame();
    }

    // ---- 写真読み込み(無ければ似顔絵) ----
    private loadPhoto(): void {
        const base = import.meta.env.BASE_URL || '/';
        const names = ['sonotchi.jpg', 'sonotchi.jpeg', 'sonotchi.png', 'sonotchi.webp'];
        let i = 0;
        const tryNext = (): void => {
            if (i >= names.length) return;
            const im = new Image();
            im.onload = () => {
                this.sonImg = im;
                this.sonImgReady = true;
            };
            im.onerror = () => {
                i++;
                tryNext();
            };
            im.src = base + names[i];
        };
        tryNext();
    }

    // ---- セットアップ ----
    private setupPins(): void {
        this.pins = [];
        const rows = [[0], [-1, 1], [-2, 0, 2], [-3, -1, 1, 3]];
        rows.forEach((row, r) => {
            const y = PIN_Y - r * 22;
            row.forEach((col) => {
                const persp = laneEdge(y) / botHW;
                this.pins.push({
                    bx: col * pinSpread * persp * 0.9,
                    by: y,
                    x: cx + col * pinSpread * persp * 0.9,
                    y,
                    r: 9 * persp + 4,
                    down: false,
                    vx: 0,
                    vy: 0,
                    fall: 0,
                    persp,
                });
            });
        });
        this.setupObstacles();
    }
    private setupObstacles(): void {
        this.bumpers = [];
        this.guard = null;
        const lvl = this.frame;
        const n = Math.min(1 + Math.floor((lvl - 1) / 3), 4);
        for (let i = 0; i < n; i++) {
            const y = laneTop + 255 + i * 42;
            const side = i % 2 === 0 ? -1 : 1;
            const x = cx + side * (26 + i * 10);
            this.bumpers.push({ x, y: Math.min(y, laneBot - 80), r: 13, flash: 0 });
        }
        if (lvl >= 2) {
            const y = PIN_Y + 34;
            const e = laneEdge(y);
            const w = Math.max(54, 72 - lvl * 2);
            this.guard = { x: cx, y, w, h: 12, vx: (1.1 + lvl * 0.28) * (Math.random() < 0.5 ? 1 : -1), rangeHW: e - w / 2 - 6 };
        }
    }
    private resetGame(): void {
        this.frame = 1;
        this.roll = 1;
        this.gameOver = false;
        this.frameRolls = Array.from({ length: 10 }, () => [] as number[]);
        this.before = 10;
        this.setupPins();
        this.resetBall();
        this.state = 'ready';
        this.push({ hint: HINT_PLAY, finalComment: '' });
    }
    private resetBall(): void {
        this.ball.x = START_X;
        this.ball.y = START_Y;
        this.ball.vx = 0;
        this.ball.vy = 0;
        this.ball.moving = false;
    }

    // ---- 入力(ドラッグ発射) ----
    private canvasPos(e: PointerEvent): Vec {
        const rect = this.canvas!.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (W / rect.width),
            y: (e.clientY - rect.top) * (H / rect.height),
        };
    }
    private onPointerDown = (e: PointerEvent): void => {
        sfx.unlock();
        if (this.started) sfx.ensureBgm(); // 自動再生がブロックされていた場合の再試行
        if (!this.started || this.gameOver || this.state !== 'ready') return;
        const p = this.canvasPos(e);
        if (Math.hypot(p.x - this.ball.x, p.y - this.ball.y) < this.ball.r * 2.6) {
            this.dragging = true;
            this.state = 'aiming';
            this.dragStart = { x: p.x, y: p.y };
            this.dragNow = { x: p.x, y: p.y };
            e.preventDefault();
        }
    };
    private onPointerMove = (e: PointerEvent): void => {
        if (!this.dragging) return;
        this.dragNow = this.canvasPos(e);
        e.preventDefault();
    };
    private onPointerUp = (e: PointerEvent): void => {
        if (!this.dragging) return;
        this.dragging = false;
        const dx = this.dragNow.x - this.dragStart.x;
        const dy = this.dragNow.y - this.dragStart.y;
        const len = Math.hypot(dx, dy);
        if (len < 10) {
            this.state = 'ready';
            return;
        }
        const pw = Math.min(len, MAX_PULL) / MAX_PULL;
        const sp = MIN_SPEED + pw * (MAX_SPEED - MIN_SPEED);
        this.ball.vx = (-dx / len) * sp;
        this.ball.vy = (-dy / len) * sp;
        this.ball.moving = true;
        this.state = 'rolling';
        this.push({ hint: HINT_GO });
        sfx.startRoll();
        e.preventDefault();
    };

    // ---- 物理更新 ----
    private update(): void {
        this.tick++;
        const ball = this.ball;

        if (this.guard) {
            const g = this.guard;
            g.x += g.vx;
            if (g.x > cx + g.rangeHW) {
                g.x = cx + g.rangeHW;
                g.vx = -Math.abs(g.vx);
            }
            if (g.x < cx - g.rangeHW) {
                g.x = cx - g.rangeHW;
                g.vx = Math.abs(g.vx);
            }
        }
        this.bumpers.forEach((b) => {
            if (b.flash > 0) b.flash--;
        });

        if (ball.moving) {
            ball.x += ball.vx;
            ball.y += ball.vy;
            ball.vx *= FRICTION;
            ball.vy *= FRICTION;

            // バンパー(勢いよく弾く)
            this.bumpers.forEach((b) => {
                const dx = ball.x - b.x;
                const dy = ball.y - b.y;
                const d = Math.hypot(dx, dy);
                const minD = b.r + ball.r;
                if (d < minD) {
                    const nx = dx / (d || 1);
                    const ny = dy / (d || 1);
                    ball.x = b.x + nx * minD;
                    ball.y = b.y + ny * minD;
                    const dot = ball.vx * nx + ball.vy * ny;
                    ball.vx = (ball.vx - 2 * dot * nx) * 1.05 + nx * 1.8;
                    ball.vy = (ball.vy - 2 * dot * ny) * 1.05 + ny * 1.8;
                    b.flash = 10;
                    sfx.bumper();
                }
            });
            // 妨害バー(AABB反射)
            if (this.guard) {
                const g = this.guard;
                const hw = g.w / 2;
                const hh = g.h / 2;
                const nx2 = Math.max(g.x - hw, Math.min(ball.x, g.x + hw));
                const ny2 = Math.max(g.y - hh, Math.min(ball.y, g.y + hh));
                const dx = ball.x - nx2;
                const dy = ball.y - ny2;
                const d = Math.hypot(dx, dy);
                if (d < ball.r) {
                    if (d > 0.001) {
                        const ux = dx / d;
                        const uy = dy / d;
                        ball.x = nx2 + ux * ball.r;
                        ball.y = ny2 + uy * ball.r;
                        const dot = ball.vx * ux + ball.vy * uy;
                        ball.vx = (ball.vx - 2 * dot * ux) * 0.96;
                        ball.vy = (ball.vy - 2 * dot * uy) * 0.96;
                    } else {
                        ball.vy = -ball.vy;
                    }
                    sfx.wall();
                }
            }
            // 速度上限
            const sp = Math.hypot(ball.vx, ball.vy);
            const CAP = MAX_SPEED * 1.4;
            if (sp > CAP) {
                ball.vx = (ball.vx / sp) * CAP;
                ball.vy = (ball.vy / sp) * CAP;
            }
            // 壁反射
            const edge = laneEdge(ball.y);
            if (ball.x < cx - edge + ball.r) {
                ball.x = cx - edge + ball.r;
                ball.vx = Math.abs(ball.vx);
                sfx.wall();
            }
            if (ball.x > cx + edge - ball.r) {
                ball.x = cx + edge - ball.r;
                ball.vx = -Math.abs(ball.vx);
                sfx.wall();
            }
            if (ball.y < laneTop + ball.r) {
                ball.y = laneTop + ball.r;
                ball.vy = Math.abs(ball.vy);
                sfx.wall();
            }
            if (ball.y > laneBot - ball.r) {
                ball.y = laneBot - ball.r;
                ball.vy = -Math.abs(ball.vy);
                sfx.wall();
            }
            // ピン衝突
            this.pins.forEach((p) => {
                if (p.down || p.fall > 0) return;
                const ddx = ball.x - p.x;
                const ddy = ball.y - p.y;
                const d = Math.hypot(ddx, ddy);
                const minD = p.r + ball.r;
                if (d < minD) {
                    const nx = ddx / (d || 1);
                    const ny = ddy / (d || 1);
                    ball.x = p.x + nx * minD;
                    ball.y = p.y + ny * minD;
                    const dot = ball.vx * nx + ball.vy * ny;
                    ball.vx = (ball.vx - 2 * dot * nx) * 0.92;
                    ball.vy = (ball.vy - 2 * dot * ny) * 0.92;
                    this.knock(p, -nx * 2, -ny * 2);
                }
            });
            if (Math.hypot(ball.vx, ball.vy) < STOP_SPEED) {
                ball.moving = false;
                this.settle();
            }
        }

        // 倒れたピンの飛散＋連鎖
        let anyMoving = false;
        this.pins.forEach((p) => {
            if (p.fall > 0 && p.fall < 1) {
                p.x += p.vx;
                p.y += p.vy;
                p.fall += 0.06;
                p.vx *= 0.92;
                p.vy *= 0.92;
                anyMoving = true;
                this.pins.forEach((q) => {
                    if (q === p || q.down) return;
                    const d = Math.hypot(q.x - p.x, q.y - p.y);
                    if (d < q.r + p.r) this.knock(q, (q.x - p.x) * 0.2, (q.y - p.y) * 0.2);
                });
                if (p.fall >= 1) {
                    p.fall = 1;
                    p.down = true;
                }
            }
        });
        if (this.state === 'settling' && !ball.moving && !anyMoving) this.finishRoll();
    }

    private knock(p: Pin, vx: number, vy: number): void {
        if (p.down || p.fall > 0) return;
        p.fall = 0.01;
        p.vx = vx + (Math.random() - 0.5) * 1.5;
        p.vy = vy - Math.random() * 1.5;
        sfx.pinHit();
    }
    private settle(): void {
        this.state = 'settling';
        sfx.stopRoll();
    }

    // ---- 進行 ----
    private finishRoll(): void {
        if (this.state !== 'settling') return;
        this.state = 'counting';
        const standing = this.pins.filter((p) => !p.down).length;
        const down = this.before - standing;
        this.frameRolls[this.frame - 1].push(down);
        this.before = standing;

        const isStrike = this.roll === 1 && down === 10 && this.frame < 10;
        const isSpare = this.roll === 2 && standing === 0 && this.frame < 10;

        if (isStrike) {
            this.flash('STRIKE!');
            sfx.strike();
        } else if (isSpare) {
            this.flash('SPARE!');
            sfx.spare();
        } else if (down === 0) {
            this.flash('ガター…', true);
            sfx.gutter();
        } else if (down >= 7) {
            this.flash('ナイス！');
            sfx.nice();
        }

        this.push();
        setTimeout(() => this.advance(standing, isStrike, isSpare), 900);
    }

    private advance(standing: number, isStrike: boolean, isSpare: boolean): void {
        void isSpare;
        if (this.frame === 10) {
            const r = this.frameRolls[9];
            const done = r.length === 3 || (r.length === 2 && r[0] !== 10 && r[0] + r[1] < 10);
            if (done) {
                this.endGame();
                return;
            }
            if (standing === 0) {
                this.setupPins();
                this.before = 10;
            }
            this.roll = r.length + 1;
            this.state = 'ready';
            this.resetBall();
            this.push({ hint: HINT_BONUS });
            return;
        }

        if (isStrike || this.roll === 2) {
            this.frame++;
            this.roll = 1;
            this.before = 10;
            this.setupPins();
            if (this.frame > 10) {
                this.endGame();
                return;
            }
        } else {
            this.roll = 2;
        }
        this.state = 'ready';
        this.resetBall();
        this.push({ hint: HINT_NEXT });
    }

    private endGame(): void {
        this.gameOver = true;
        this.state = 'over';
        const total = totalScore(this.frameRolls);
        let comment = 'おつかれさま！';
        if (total >= 200) comment = '神プレイ！🏆';
        else if (total >= 150) comment = 'さすがメダリスト！🥇';
        else if (total >= 100) comment = 'ナイスゲーム！👏';
        this.flash(`${total}点！`);
        sfx.gameOver();
        this.push({ hint: `最終スコア: ${total}点`, finalComment: comment });
    }

    // ---- 描画 ----
    private loop = (): void => {
        this.update();
        this.drawScene();
        this.rafId = requestAnimationFrame(this.loop);
    };

    private drawScene(): void {
        const ctx = this.ctx;
        if (!ctx) return;
        ctx.clearRect(0, 0, W, H);

        // 背景
        const g = ctx.createLinearGradient(0, 0, 0, laneTop);
        g.addColorStop(0, '#3a2566');
        g.addColorStop(1, '#241147');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, laneTop + 5);
        ctx.fillStyle = 'rgba(0,0,0,.35)';
        ctx.fillRect(cx - topHW, 8, topHW * 2, 28);
        ctx.fillStyle = '#ffcd3c';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎳 SONOTCHI LANES 🎳', cx, 26);

        // レーン
        ctx.beginPath();
        ctx.moveTo(cx - topHW, laneTop);
        ctx.lineTo(cx + topHW, laneTop);
        ctx.lineTo(cx + botHW, laneBot);
        ctx.lineTo(cx - botHW, laneBot);
        ctx.closePath();
        const lg = ctx.createLinearGradient(0, laneTop, 0, laneBot);
        lg.addColorStop(0, '#c98b3d');
        lg.addColorStop(1, '#e7a94e');
        ctx.fillStyle = lg;
        ctx.fill();

        // 板目
        ctx.strokeStyle = 'rgba(120,70,20,.35)';
        ctx.lineWidth = 1;
        for (let i = -3; i <= 3; i++) {
            ctx.beginPath();
            ctx.moveTo(cx + i * (topHW / 3.5), laneTop);
            ctx.lineTo(cx + i * (botHW / 3.5), laneBot);
            ctx.stroke();
        }
        // スパット
        ctx.fillStyle = 'rgba(80,45,10,.6)';
        for (let i = -2; i <= 2; i++) {
            const yy = laneBot - 150;
            const e = laneEdge(yy);
            ctx.save();
            ctx.translate(cx + i * (e / 3), yy);
            ctx.beginPath();
            ctx.moveTo(0, -6);
            ctx.lineTo(4, 4);
            ctx.lineTo(-4, 4);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        // ガター
        ctx.fillStyle = '#23232b';
        ctx.beginPath();
        ctx.moveTo(cx - topHW, laneTop);
        ctx.lineTo(cx - topHW - 10, laneTop);
        ctx.lineTo(cx - botHW - 18, laneBot);
        ctx.lineTo(cx - botHW, laneBot);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(cx + topHW, laneTop);
        ctx.lineTo(cx + topHW + 10, laneTop);
        ctx.lineTo(cx + botHW + 18, laneBot);
        ctx.lineTo(cx + botHW, laneBot);
        ctx.closePath();
        ctx.fill();

        this.pins.forEach((p) => this.drawPin(p));
        this.drawObstacles();
        if (this.state === 'aiming' && this.dragging) this.drawAimGuide();
        this.drawSonotchiToken(this.ball.x, this.ball.y, this.ball.r);

        if (this.state === 'ready' && this.started && !this.gameOver) {
            const pulse = 0.5 + 0.5 * Math.sin(this.tick * 0.12);
            ctx.save();
            ctx.globalAlpha = 0.5 + 0.4 * pulse;
            ctx.strokeStyle = '#ffcd3c';
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.arc(this.ball.x, this.ball.y, this.ball.r + 8 + pulse * 4, 0, 7);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(255,255,255,.9)';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('ひっぱって発射！', this.ball.x, this.ball.y + this.ball.r + 24);
            ctx.restore();
        }
    }

    private drawAimGuide(): void {
        const ctx = this.ctx!;
        const dx = this.dragNow.x - this.dragStart.x;
        const dy = this.dragNow.y - this.dragStart.y;
        const len = Math.hypot(dx, dy);
        if (len < 4) return;
        const pw = Math.min(len, MAX_PULL) / MAX_PULL;
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(this.ball.x, this.ball.y);
        ctx.lineTo(this.ball.x + dx, this.ball.y + dy);
        ctx.stroke();
        ctx.setLineDash([]);
        const sp = MIN_SPEED + pw * (MAX_SPEED - MIN_SPEED);
        let sx = this.ball.x;
        let sy = this.ball.y;
        let svx = (-dx / len) * sp;
        let svy = (-dy / len) * sp;
        ctx.fillStyle = 'rgba(255,205,60,.85)';
        for (let i = 0; i < 26; i++) {
            sx += svx;
            sy += svy;
            svx *= FRICTION;
            svy *= FRICTION;
            const edge = laneEdge(sy);
            if (sx < cx - edge + this.ball.r) {
                sx = cx - edge + this.ball.r;
                svx = -svx;
            }
            if (sx > cx + edge - this.ball.r) {
                sx = cx + edge - this.ball.r;
                svx = -svx;
            }
            if (sy < laneTop + this.ball.r) {
                sy = laneTop + this.ball.r;
                svy = -svy;
            }
            if (sy > laneBot - this.ball.r) {
                sy = laneBot - this.ball.r;
                svy = -svy;
            }
            if (i % 2 === 0) {
                ctx.beginPath();
                ctx.arc(sx, sy, 2.4 - i * 0.05, 0, 7);
                ctx.fill();
            }
        }
        const bx = 18;
        const by = laneBot - 130;
        const bw = 12;
        const bh = 130;
        ctx.fillStyle = 'rgba(0,0,0,.4)';
        ctx.fillRect(bx, by, bw, bh);
        const pg = ctx.createLinearGradient(0, by + bh, 0, by);
        pg.addColorStop(0, '#3cff6e');
        pg.addColorStop(0.6, '#ffcd3c');
        pg.addColorStop(1, '#ff5a5f');
        ctx.fillStyle = pg;
        ctx.fillRect(bx, by + bh - bh * pw, bw, bh * pw);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(bx, by, bw, bh);
        ctx.restore();
    }

    private drawSonotchiToken(x: number, y: number, r: number): void {
        const ctx = this.ctx!;
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,.25)';
        ctx.beginPath();
        ctx.ellipse(x, y + r * 0.85, r * 0.9, r * 0.35, 0, 0, 7);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, r + 3, 0, 7);
        ctx.fillStyle = '#ffcd3c';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, r + 1.5, 0, 7);
        ctx.fillStyle = '#e0a800';
        ctx.fill();
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 7);
        ctx.clip();
        const bgr = ctx.createLinearGradient(0, y - r, 0, y + r);
        bgr.addColorStop(0, '#cfe8ff');
        bgr.addColorStop(1, '#9ec4ee');
        ctx.fillStyle = bgr;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
        if (this.sonImgReady && this.sonImg) {
            const im = this.sonImg;
            const iw = im.naturalWidth || im.width;
            const ih = im.naturalHeight || im.height;
            const side = Math.min(iw, ih);
            const sxp = (iw - side) / 2;
            const syp = Math.max(0, (ih - side) / 2 - side * 0.05);
            ctx.drawImage(im, sxp, syp, side, side, x - r, y - r, r * 2, r * 2);
        } else {
            const s = r / 30;
            ctx.translate(x, y);
            ctx.scale(s, s);
            drawSonotchiVector(ctx, 0, 22);
        }
        ctx.restore();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255,255,255,.85)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 7);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,.25)';
        ctx.beginPath();
        ctx.ellipse(x - r * 0.35, y - r * 0.4, r * 0.3, r * 0.18, -0.6, 0, 7);
        ctx.fill();
        ctx.restore();
    }

    private drawObstacles(): void {
        const ctx = this.ctx!;
        this.bumpers.forEach((b) => {
            ctx.save();
            if (b.flash > 0) {
                ctx.shadowColor = '#ffe27a';
                ctx.shadowBlur = 14;
            }
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, 7);
            ctx.fillStyle = b.flash > 0 ? '#ff8a3c' : '#e23b3b';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r * 0.62, 0, 7);
            ctx.fillStyle = '#fff';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r * 0.3, 0, 7);
            ctx.fillStyle = b.flash > 0 ? '#ffcd3c' : '#e23b3b';
            ctx.fill();
            ctx.restore();
        });
        if (this.guard) {
            const g = this.guard;
            const x = g.x - g.w / 2;
            const y = g.y - g.h / 2;
            ctx.save();
            ctx.fillStyle = '#222';
            ctx.fillRect(x, y, g.w, g.h);
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, g.w, g.h);
            ctx.clip();
            ctx.fillStyle = '#ffcd3c';
            for (let sxv = -g.h; sxv < g.w + g.h; sxv += 12) {
                ctx.beginPath();
                ctx.moveTo(x + sxv, y);
                ctx.lineTo(x + sxv + 6, y);
                ctx.lineTo(x + sxv + 6 - g.h, y + g.h);
                ctx.lineTo(x + sxv - g.h, y + g.h);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x, y, g.w, g.h);
            ctx.restore();
        }
    }

    private drawPin(p: Pin): void {
        const ctx = this.ctx!;
        ctx.save();
        if (p.down) {
            ctx.globalAlpha = 0.5;
            ctx.translate(p.x, p.y);
            ctx.rotate(Math.PI / 2.2);
        } else {
            ctx.translate(p.x, p.y - p.fall * 8);
            if (p.fall > 0) ctx.rotate(p.fall * 1.4 * (p.vx >= 0 ? 1 : -1));
        }
        const r = p.r;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(0, -r * 1.8);
        ctx.quadraticCurveTo(r * 0.9, -r * 0.9, r * 0.55, r * 0.2);
        ctx.quadraticCurveTo(r * 0.9, r * 1.3, 0, r * 1.5);
        ctx.quadraticCurveTo(-r * 0.9, r * 1.3, -r * 0.55, r * 0.2);
        ctx.quadraticCurveTo(-r * 0.9, -r * 0.9, 0, -r * 1.8);
        ctx.fill();
        ctx.fillStyle = '#ff3b3b';
        ctx.fillRect(-r * 0.5, -r * 0.7, r, r * 0.28);
        ctx.restore();
    }
}
