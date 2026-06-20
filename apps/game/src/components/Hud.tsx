import { useGameStore } from '../store/gameStore';

export function Hud() {
    const frame = useGameStore((s) => s.frame);
    const roll = useGameStore((s) => s.roll);
    const score = useGameStore((s) => s.score);
    return (
        <div className="hud">
            <div className="box">
                <b>{score}</b>
                <span>SCORE</span>
            </div>
            <div className="box">
                <b>{Math.min(frame, 10)}</b>
                <span>FRAME</span>
            </div>
            <div className="box">
                <b>{roll}</b>
                <span>ROLL</span>
            </div>
        </div>
    );
}
