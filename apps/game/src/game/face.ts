import { cx, H } from './constants';

// 本人に寄せた似顔絵(面長・頭頂無毛・サイドは上黒下白・細い金属メガネ・日焼け肌・赤い柄シャツ・縞リボンのメダル)。
// ox/oy 省略時は画面下中央に等身大で描く。トークン内では translate+scale 済みの状態で呼ぶ。
export function drawSonotchiVector(ctx: CanvasRenderingContext2D, ox?: number, oy?: number): void {
    const x = ox === undefined ? cx : ox;
    const y = oy === undefined ? H - 30 : oy;
    ctx.save();
    ctx.translate(x, y);

    // 肩・赤い柄シャツ(かりゆし風)
    ctx.fillStyle = '#a83228';
    ctx.beginPath();
    ctx.moveTo(-40, 44);
    ctx.quadraticCurveTo(-38, 8, -14, 3);
    ctx.lineTo(14, 3);
    ctx.quadraticCurveTo(38, 8, 40, 44);
    ctx.lineTo(40, 50);
    ctx.lineTo(-40, 50);
    ctx.closePath();
    ctx.fill();
    // シャツの柄
    ctx.fillStyle = 'rgba(255,200,150,.18)';
    for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.arc(-30 + i * 10, 20 + (i % 2) * 10, 3, 0, 7);
        ctx.fill();
    }
    // 襟
    ctx.fillStyle = '#7d251d';
    ctx.beginPath();
    ctx.moveTo(-14, 3);
    ctx.lineTo(-3, 16);
    ctx.lineTo(-9, 5);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(14, 3);
    ctx.lineTo(3, 16);
    ctx.lineTo(9, 5);
    ctx.closePath();
    ctx.fill();

    // メダル(赤青の縞リボン+金)
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#c0392b';
    ctx.beginPath();
    ctx.moveTo(-7, 8);
    ctx.lineTo(-2, 28);
    ctx.stroke();
    ctx.strokeStyle = '#2e6fd6';
    ctx.beginPath();
    ctx.moveTo(7, 8);
    ctx.lineTo(2, 28);
    ctx.stroke();
    const mg = ctx.createRadialGradient(-2, 30, 1, 0, 32, 9);
    mg.addColorStop(0, '#fff3b0');
    mg.addColorStop(0.5, '#ffcd3c');
    mg.addColorStop(1, '#d99a00');
    ctx.fillStyle = mg;
    ctx.beginPath();
    ctx.arc(0, 32, 9, 0, 7);
    ctx.fill();
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#b8860b';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('1', 0, 35.5);

    // 首
    ctx.fillStyle = '#cf9d6d';
    ctx.beginPath();
    ctx.moveTo(-9, -4);
    ctx.lineTo(9, -4);
    ctx.lineTo(7, 8);
    ctx.lineTo(-7, 8);
    ctx.closePath();
    ctx.fill();

    // 耳
    ctx.fillStyle = '#d9a877';
    ctx.beginPath();
    ctx.ellipse(-23, -22, 5, 7, 0, 0, 7);
    ctx.ellipse(23, -22, 5, 7, 0, 0, 7);
    ctx.fill();

    // 顔(面長・血色のよい日焼け肌)
    const fg = ctx.createLinearGradient(0, -48, 0, -2);
    fg.addColorStop(0, '#e6b98a');
    fg.addColorStop(1, '#d7a06f');
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.moveTo(0, -50);
    ctx.bezierCurveTo(20, -50, 24, -30, 22, -18);
    ctx.bezierCurveTo(20, -2, 10, 6, 0, 6);
    ctx.bezierCurveTo(-10, 6, -20, -2, -22, -18);
    ctx.bezierCurveTo(-24, -30, -20, -50, 0, -50);
    ctx.closePath();
    ctx.fill();
    // ほお骨の赤み
    ctx.fillStyle = 'rgba(200,90,60,.18)';
    ctx.beginPath();
    ctx.arc(-12, -14, 6, 0, 7);
    ctx.arc(12, -14, 6, 0, 7);
    ctx.fill();

    // 頭頂のテカり(地肌)
    ctx.fillStyle = 'rgba(255,240,220,.25)';
    ctx.beginPath();
    ctx.ellipse(-2, -42, 10, 6, -0.2, 0, 7);
    ctx.fill();

    // サイド毛(上=黒 / 下=白)
    const sideHair = (sgn: number): void => {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(sgn * 20, -36);
        ctx.quadraticCurveTo(sgn * 30, -36, sgn * 29, -24);
        ctx.quadraticCurveTo(sgn * 28, -14, sgn * 22, -11);
        ctx.quadraticCurveTo(sgn * 20, -16, sgn * 19, -24);
        ctx.quadraticCurveTo(sgn * 18, -31, sgn * 20, -36);
        ctx.closePath();
        ctx.clip();
        const bg = ctx.createLinearGradient(0, -36, 0, -23);
        bg.addColorStop(0, '#2c2a27');
        bg.addColorStop(1, '#3a3733');
        ctx.fillStyle = bg;
        ctx.fillRect(sgn * 16, -38, sgn * 16, 16);
        const wg = ctx.createLinearGradient(0, -23, 0, -10);
        wg.addColorStop(0, '#d7dadb');
        wg.addColorStop(1, '#f3f5f5');
        ctx.fillStyle = wg;
        ctx.fillRect(sgn * 16, -23, sgn * 16, 14);
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        for (let i = 0; i < 5; i++) {
            const bx = sgn * (20 + i * 1.8);
            ctx.strokeStyle = 'rgba(20,18,16,.5)';
            ctx.beginPath();
            ctx.moveTo(bx, -35);
            ctx.lineTo(bx - sgn * 0.5, -24);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(255,255,255,.6)';
            ctx.beginPath();
            ctx.moveTo(bx - sgn * 0.5, -23);
            ctx.lineTo(bx - sgn, -12);
            ctx.stroke();
        }
        ctx.restore();
        ctx.strokeStyle = 'rgba(30,28,25,.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sgn * 19, -23);
        ctx.lineTo(sgn * 29, -23);
        ctx.stroke();
    };
    sideHair(-1);
    sideHair(1);

    // 眉(白)
    ctx.strokeStyle = '#dfe2e2';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-16, -28);
    ctx.quadraticCurveTo(-10, -31, -4, -29);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(4, -29);
    ctx.quadraticCurveTo(10, -31, 16, -28);
    ctx.stroke();

    // メガネ(細い金属フレーム)
    ctx.strokeStyle = '#6b6b6b';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect(-18, -26, 14, 11, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(4, -26, 14, 11, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-4, -22);
    ctx.lineTo(4, -22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-18, -23);
    ctx.lineTo(-23, -22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(18, -23);
    ctx.lineTo(23, -22);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.12)';
    ctx.beginPath();
    ctx.roundRect(-17, -25, 12, 9, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(5, -25, 12, 9, 3);
    ctx.fill();

    // 目(笑って細い)
    ctx.strokeStyle = '#4a3320';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, -20);
    ctx.quadraticCurveTo(-11, -23.5, -6, -20.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, -20.5);
    ctx.quadraticCurveTo(11, -23.5, 16, -20);
    ctx.stroke();
    // 目尻のシワ
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(90,60,40,.5)';
    ctx.beginPath();
    ctx.moveTo(-17, -20);
    ctx.lineTo(-21, -22);
    ctx.moveTo(-17, -19);
    ctx.lineTo(-21, -19);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(17, -20);
    ctx.lineTo(21, -22);
    ctx.moveTo(17, -19);
    ctx.lineTo(21, -19);
    ctx.stroke();

    // 鼻
    ctx.strokeStyle = '#a8714a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-1, -19);
    ctx.lineTo(-3, -10);
    ctx.quadraticCurveTo(0, -8, 3, -10);
    ctx.lineTo(1, -19);
    ctx.stroke();
    // ほうれい線
    ctx.strokeStyle = 'rgba(150,100,70,.4)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-6, -9);
    ctx.quadraticCurveTo(-9, -4, -7, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(6, -9);
    ctx.quadraticCurveTo(9, -4, 7, 0);
    ctx.stroke();

    // 笑顔の口
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(-9, -3);
    ctx.quadraticCurveTo(0, 0, 9, -3);
    ctx.quadraticCurveTo(0, 3, -9, -3);
    ctx.fill();
    ctx.strokeStyle = '#7a4a2a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, -3.5);
    ctx.quadraticCurveTo(0, 4, 10, -3.5);
    ctx.stroke();

    ctx.restore();
}
