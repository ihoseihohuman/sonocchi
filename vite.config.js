import { resolve } from 'node:path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/sonocchi/',
    root: 'src', // プロジェクトのルートを指定
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // `@` を `src` フォルダに解決
        },
    },
    json: {
        namedExports: true,
    },
    publicDir: resolve(__dirname, 'public'), // publicディレクトリのパス
    build: {
        outDir: resolve(__dirname, 'dist'), // ビルド成果物をdistに出力
        emptyOutDir: true, // ビルド前にdistディレクトリを空にする
        copyPublicDir: true, // publicディレクトリの内容をコピー
        rollupOptions: {
            // inputを削除して、Viteのデフォルト設定に任せる
            // Viteは自動的にsrc/index.htmlをエントリーポイントとして使用します
            // outputの設定を変更したい場合のみ記述
            output: {
                entryFileNames: 'assets/bundle.js', // 出力するJavaScriptのファイル名
            },
        },
    },
});
