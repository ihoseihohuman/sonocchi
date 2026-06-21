import { useRef, useState } from 'react';
import { sfx } from '../game/audio';
import { useGameStore } from '../store/gameStore';
import type { GameEngine } from '../game/engine';

export function Controls({ engine }: { engine: GameEngine }) {
    const started = useGameStore((s) => s.started);
    const gameOver = useGameStore((s) => s.gameOver);
    const hint = useGameStore((s) => s.hint);
    const finalComment = useGameStore((s) => s.finalComment);
    const soundOn = useGameStore((s) => s.soundOn);

    const fileRef = useRef<HTMLInputElement>(null);
    const [customFace, setCustomFace] = useState(false);

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
    const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            engine.setFaceImage(reader.result as string);
            setCustomFace(true);
            sfx.unlock();
            sfx.click();
        };
        reader.readAsDataURL(file);
        e.target.value = ''; // 同じファイルを連続で選んでも発火するように
    };
    const onResetFace = () => {
        engine.setFaceImage(null);
        setCustomFace(false);
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

            {/* スタート画面: そのっちの顔アイコンに使う画像をアップロード */}
            {showButton && (
                <div className="upload-row">
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={onPickFile}
                    />
                    <button className="upload" onClick={() => fileRef.current?.click()}>
                        🖼️ 画像をアップロード
                    </button>
                    {customFace && (
                        <button className="reset-face" onClick={onResetFace}>
                            似顔絵に戻す
                        </button>
                    )}
                </div>
            )}
            {showButton && (
                <div className="upload-note">
                    {customFace ? '✅ アップロード画像を顔アイコンに使用中' : '弾の顔アイコンを好きな画像に変えられます'}
                </div>
            )}
        </>
    );
}
