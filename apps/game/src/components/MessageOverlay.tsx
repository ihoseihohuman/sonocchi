import { useGameStore } from '../store/gameStore';

export function MessageOverlay() {
    const flash = useGameStore((s) => s.flash);
    if (!flash) return null;
    // key を id にして、同じ文言でも再アニメーションさせる
    return (
        <div key={flash.id} className={`msg show${flash.dim ? ' dim' : ''}`}>
            {flash.text}
        </div>
    );
}
