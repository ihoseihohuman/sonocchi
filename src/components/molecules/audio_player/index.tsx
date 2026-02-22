import React from 'react';

const AudioPlayer: React.FC = () => {
    return (
        <div>
            <audio controls>
                <source
                    src="/src/assets/musics/Perfect_Game_Professor.mp3"
                    type="audio/mpeg"
                />
                お使いのブラウザはオーディオ要素をサポートしていません。
            </audio>
        </div>
    );
};

export default AudioPlayer;
