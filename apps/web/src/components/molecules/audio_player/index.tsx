import React, { useEffect, useRef } from 'react';

const BGM_SRC = '/sonocchi/musics/Perfect_Game_Professor.mp3';

const AudioPlayer: React.FC = () => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.loop = true; // 無限ループ
        audio.volume = 0.4;

        // まず音付き自動再生を試みる(多くのブラウザではブロックされる)
        audio.muted = false;
        void audio.play().catch(() => {
            // ブロックされたら、最初のユーザー操作で再生を開始する
            const startOnGesture = () => {
                audio.muted = false;
                void audio
                    .play()
                    .then(cleanup)
                    .catch(() => {
                        /* まだ不可なら次の操作で再試行 */
                    });
            };
            const cleanup = () => {
                window.removeEventListener('pointerdown', startOnGesture);
                window.removeEventListener('keydown', startOnGesture);
                window.removeEventListener('touchstart', startOnGesture);
                window.removeEventListener('scroll', startOnGesture);
            };
            window.addEventListener('pointerdown', startOnGesture);
            window.addEventListener('keydown', startOnGesture);
            window.addEventListener('touchstart', startOnGesture, { passive: true });
            window.addEventListener('scroll', startOnGesture, { passive: true });
        });
    }, []);

    return (
        <div>
            {/* 無限ループ＋自動再生(不可時は最初の操作で開始)。controlsで停止も可能。 */}
            <audio ref={audioRef} src={BGM_SRC} loop autoPlay controls preload="auto">
                お使いのブラウザはオーディオ要素をサポートしていません。
            </audio>
        </div>
    );
};

export default AudioPlayer;
