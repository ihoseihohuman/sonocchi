// 効果音 (Web Audio, 外部ファイル不要)。元の SFX をクラス化したもの。

type RollNodes = { src: AudioBufferSourceNode; g: GainNode };

class Sfx {
    private ac: AudioContext | null = null;
    private master: GainNode | null = null;
    private on = true;
    private rollNodes: RollNodes | null = null;
    private bgm: HTMLAudioElement | null = null;
    private bgmUrl: string | null = null;

    private ctxOK(): boolean {
        if (!this.ac) {
            const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (!AC) return false;
            this.ac = new AC();
            this.master = this.ac.createGain();
            this.master.gain.value = 0.5;
            this.master.connect(this.ac.destination);
        }
        if (this.ac.state === 'suspended') void this.ac.resume();
        return true;
    }

    private tone(
        freq: number,
        dur: number,
        type: OscillatorType = 'sine',
        vol = 0.5,
        glideTo: number | null = null,
        delay = 0,
    ): void {
        if (!this.on || !this.ctxOK()) return;
        const ac = this.ac!;
        const master = this.master!;
        const t0 = ac.currentTime + delay;
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = type;
        o.frequency.setValueAtTime(freq, t0);
        if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g);
        g.connect(master);
        o.start(t0);
        o.stop(t0 + dur + 0.02);
    }

    private noise(dur: number, vol: number, filterFreq: number, delay = 0): void {
        if (!this.on || !this.ctxOK()) return;
        const ac = this.ac!;
        const master = this.master!;
        const t0 = ac.currentTime + delay;
        const n = Math.floor(ac.sampleRate * dur);
        const buf = ac.createBuffer(1, n, ac.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
        const src = ac.createBufferSource();
        src.buffer = buf;
        const f = ac.createBiquadFilter();
        f.type = 'bandpass';
        f.frequency.value = filterFreq;
        f.Q.value = 0.8;
        const g = ac.createGain();
        g.gain.setValueAtTime(vol, t0);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        src.connect(f);
        f.connect(g);
        g.connect(master);
        src.start(t0);
        src.stop(t0 + dur);
    }

    unlock(): void {
        this.ctxOK();
    }
    setOn(v: boolean): void {
        this.on = v;
        if (!v) {
            this.stopRoll();
            this.stopBgm();
        } else if (this.bgmUrl) {
            this.startBgm(this.bgmUrl);
        }
    }
    isOn(): boolean {
        return this.on;
    }
    // ループBGM(HTMLAudioElement)。ユーザー操作後に呼ぶこと(自動再生制限のため)。
    startBgm(url: string): void {
        this.bgmUrl = url;
        if (!this.on) return;
        if (!this.bgm) {
            this.bgm = new Audio(url);
            this.bgm.loop = true;
            this.bgm.volume = 0.35;
        }
        void this.bgm.play().catch(() => {
            /* 自動再生がブロックされた場合は次の操作で再試行される */
        });
    }
    stopBgm(): void {
        if (this.bgm) this.bgm.pause();
    }
    click(): void {
        this.tone(520, 0.07, 'square', 0.25);
        this.tone(780, 0.06, 'square', 0.15, null, 0.02);
    }
    startRoll(): void {
        if (!this.on || !this.ctxOK()) return;
        this.stopRoll();
        const ac = this.ac!;
        const master = this.master!;
        const n = Math.floor(ac.sampleRate * 1.4);
        const buf = ac.createBuffer(1, n, ac.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * 0.6;
        const src = ac.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        const f = ac.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = 320;
        const g = ac.createGain();
        g.gain.setValueAtTime(0.0001, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.22, ac.currentTime + 0.08);
        src.connect(f);
        f.connect(g);
        g.connect(master);
        src.start();
        this.rollNodes = { src, g };
    }
    stopRoll(): void {
        if (this.rollNodes && this.ac) {
            try {
                this.rollNodes.g.gain.cancelScheduledValues(this.ac.currentTime);
                this.rollNodes.g.gain.setTargetAtTime(0.0001, this.ac.currentTime, 0.05);
                this.rollNodes.src.stop(this.ac.currentTime + 0.3);
            } catch {
                /* noop */
            }
            this.rollNodes = null;
        }
    }
    pinHit(): void {
        this.noise(0.09, 0.5, 1600);
        this.tone(220, 0.08, 'triangle', 0.25, 140);
    }
    wall(): void {
        this.tone(160, 0.07, 'sine', 0.18, 90);
    }
    bumper(): void {
        this.tone(880, 0.1, 'square', 0.28, 1400);
        this.noise(0.06, 0.25, 2200);
    }
    crash(): void {
        for (let i = 0; i < 5; i++) this.noise(0.12, 0.35, 900 + Math.random() * 1400, i * 0.04);
    }
    strike(): void {
        const seq: [number, number][] = [[523, 0], [659, 0.1], [784, 0.2], [1046, 0.32]];
        seq.forEach(([f, d]) => this.tone(f, 0.3, 'square', 0.3, null, d));
        this.tone(1318, 0.5, 'sawtooth', 0.18, null, 0.42);
        this.crash();
    }
    spare(): void {
        const seq: [number, number][] = [[523, 0], [784, 0.12], [1046, 0.24]];
        seq.forEach(([f, d]) => this.tone(f, 0.25, 'square', 0.28, null, d));
    }
    gutter(): void {
        this.tone(400, 0.5, 'sine', 0.3, 120);
    }
    nice(): void {
        this.tone(660, 0.12, 'square', 0.25);
        this.tone(880, 0.14, 'square', 0.22, null, 0.1);
    }
    gameOver(): void {
        const seq: [number, number][] = [[523, 0], [523, 0.15], [659, 0.3], [523, 0.45], [698, 0.6], [784, 0.8]];
        seq.forEach(([f, d]) => this.tone(f, 0.3, 'triangle', 0.28, null, d));
    }
}

export const sfx = new Sfx();
