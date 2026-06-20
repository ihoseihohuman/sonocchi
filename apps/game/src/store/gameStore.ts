import { create } from 'zustand';
import type { GameStatus } from '../game/types';
import { HINT_START } from '../game/constants';

export interface FlashMessage {
    id: number;
    text: string;
    dim: boolean;
}

// React に公開する状態(エンジンが patch で更新する)
export interface GameStore {
    frameRolls: number[][];
    frame: number;
    roll: number;
    score: number;
    started: boolean;
    gameOver: boolean;
    status: GameStatus;
    hint: string;
    finalComment: string;
    flash: FlashMessage | null;
    soundOn: boolean;

    patch: (p: Partial<GameStore>) => void;
    showFlash: (text: string, dim?: boolean) => void;
    setSoundOn: (v: boolean) => void;
}

const emptyFrames = (): number[][] => Array.from({ length: 10 }, () => [] as number[]);

export const useGameStore = create<GameStore>((set, get) => ({
    frameRolls: emptyFrames(),
    frame: 1,
    roll: 1,
    score: 0,
    started: false,
    gameOver: false,
    status: 'idle',
    hint: HINT_START,
    finalComment: '',
    flash: null,
    soundOn: true,

    patch: (p) => set(p),
    showFlash: (text, dim = false) => {
        const id = Date.now() + Math.random();
        set({ flash: { id, text, dim } });
        setTimeout(() => {
            if (get().flash?.id === id) set({ flash: null });
        }, 1100);
    },
    setSoundOn: (v) => set({ soundOn: v }),
}));
