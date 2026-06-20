import { useEffect, useRef } from 'react';
import { W, H } from '../game/constants';
import type { GameEngine } from '../game/engine';

export function GameCanvas({ engine }: { engine: GameEngine }) {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const c = ref.current;
        if (!c) return;
        engine.attach(c);
        return () => engine.detach();
    }, [engine]);
    return <canvas ref={ref} width={W} height={H} className="game-canvas" />;
}
