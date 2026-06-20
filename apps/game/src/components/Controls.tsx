import { sfx } from '../game/audio';
import { useGameStore } from '../store/gameStore';
import type { GameEngine } from '../game/engine';

export function Controls({ engine }: { engine: GameEngine }) {
    const started = useGameStore((s) => s.started);
    const gameOver = useGameStore((s) => s.gameOver);
    const hint = useGameStore((s) => s.hint);
    const finalComment = useGameStore((s) => s.finalComment);
    const soundOn = useGameStore((s) => s.soundOn);

    const showButton = !started || gameOver;
    const label = !started ? 'ゲームスタート' : 'もう一度プレイ';

    const onStart = () => {
        sfx.unlock();
        sfx.click();
        engine.start();
    };
    const onToggleSound = () => {
        sfx.unlock();
        const next = !useGameStore.getState().soundOn;
        sfx.setOn(next);
        useGameStore.getState().setSoundOn(next);
        if (next) sfx.click();
    };

    return (
        <>
            <div className="controls">
                {hint}
                {finalComment && (
                    <>
                        <br />
                        {finalComment}
                    </>
                )}
            </div>
            <div className="btn-row">
                {showButton && (
                    <button className="primary" onClick={onStart}>
                        {label}
                    </button>
                )}
                <button className="sound" title="効果音 ON/OFF" onClick={onToggleSound}>
                    {soundOn ? '🔊' : '🔇'}
                </button>
            </div>
        </>
    );
}
