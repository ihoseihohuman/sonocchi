import { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// そのっちボウル (React + TS)。
// 本体サイト(/sonocchi/)のサブパス /sonocchi/game/ で配信。
// viteSingleFile で JS/CSS を1つの index.html に内包 → 配布exe化も簡単。
export default defineConfig({
    base: '/sonocchi/game/',
    plugins: [react(), viteSingleFile()],
    publicDir: resolve(__dirname, 'assets'), // sonotchi.jpg などを置けば一緒に配信
    build: {
        outDir: resolve(__dirname, '../../dist/game'),
        emptyOutDir: true, // dist/game の中だけ消す(dist本体は消さない)
    },
});
