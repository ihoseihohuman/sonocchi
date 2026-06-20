import { useRef } from 'react';
import { GameEngine } from './game/engine';
import { GameCanvas } from './components/GameCanvas';
import { ScoreBoard } from './components/ScoreBoard';
import { Hud } from './components/Hud';
import { Controls } from './components/Controls';
import { MessageOverlay } from './components/MessageOverlay';

export default function App() {
    // エンジンはセッションを通して1つだけ生成する
    const engineRef = useRef<GameEngine | null>(null);
    if (!engineRef.current) engineRef.current = new GameEngine();
    const engine = engineRef.current;

    return (
        <div className="app">
            <h1>そのっちボウル</h1>
            <div className="sub">🎳 引っ張って発射！そのっちが跳ねてピンを倒す！</div>
            <ScoreBoard />
            <div className="game-wrap">
                <GameCanvas engine={engine} />
                <MessageOverlay />
            </div>
            <Hud />
            <Controls engine={engine} />
        </div>
    );
}
