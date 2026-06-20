import { useGameStore } from '../store/gameStore';
import { cumulativeScores, frameSymbol } from '../game/scoring';

export function ScoreBoard() {
    const frameRolls = useGameStore((s) => s.frameRolls);
    const frame = useGameStore((s) => s.frame);
    const cum = cumulativeScores(frameRolls);

    return (
        <div className="frames">
            {Array.from({ length: 10 }, (_, f) => {
                const slots = f === 9 ? 3 : 2;
                const active = f === frame - 1;
                return (
                    <div key={f} className={`frame${active ? ' active' : ''}${f === 9 ? ' f10' : ''}`}>
                        <div className="fn">{f + 1}</div>
                        <div className="rolls">
                            {Array.from({ length: slots }, (_, ri) => (
                                <div key={ri}>{frameSymbol(frameRolls, f, ri)}</div>
                            ))}
                        </div>
                        <div className="tot">{cum[f] !== null && cum[f] !== undefined ? cum[f] : ''}</div>
                    </div>
                );
            })}
        </div>
    );
}
