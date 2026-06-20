# sonocchi monorepo

そのっち関連プロジェクトのモノレポ（yarn workspaces）。

## 構成

```
sonocchi/
├── apps/
│   ├── web/    … 既存の紹介サイト (Vite + React)  → 公開URL: /sonocchi/
│   └── game/   … そのっちボウル (Vite + React + TypeScript + zustand) → /sonocchi/game/
├── dist/       … ビルド成果物の集約先 (web を直下に、game を dist/game に出力)
└── package.json … ルート(workspaces / 共通スクリプト)
```

ビルド時、`web` をルート `dist/` に出力し、続けて `game` を `dist/game/` に出力します。
GitHub Pages では `https://ihoseihohuman.github.io/sonocchi/` がサイト、`.../sonocchi/game/` がゲームになります。

## セットアップ

```bash
yarn install   # ルートで実行（全ワークスペースの依存を解決）
```

## よく使うコマンド（すべてルートで実行）

| コマンド | 内容 |
|---|---|
| `yarn dev` / `yarn dev:web` | 紹介サイトを開発起動 |
| `yarn dev:game` | ゲームを開発起動 |
| `yarn build` | web → game の順に `dist/` へまとめてビルド |
| `yarn build:web` / `yarn build:game` | 個別ビルド |
| `yarn build:exe` | ゲームを内蔵した配布用 exe を生成（Windows / .NET Framework 同梱の csc を使用） |
| `yarn deploy` | `yarn build` 後に `dist/` を gh-pages へデプロイ |

## ゲームの作り（apps/game）

Vite + React + TypeScript。状態管理は zustand。
- `src/game/` … エンジン本体（型付きTS）: `engine.ts`(物理・描画・進行) / `audio.ts`(WebAudio効果音) / `face.ts`(似顔絵) / `scoring.ts`(スコア計算) / `constants.ts` / `types.ts`
- `src/store/gameStore.ts` … zustand ストア（エンジンが状態を push、Reactが購読）
- `src/components/` … `GameCanvas` / `ScoreBoard` / `Hud` / `Controls` / `MessageOverlay`
- 描画は HTML5 Canvas、`vite-plugin-singlefile` でビルド時に1ファイルへ内包

## ゲームを友達に配る（exe）

```bash
yarn build:exe   # vite build(単一HTML化) → exe へ内蔵
```

`apps/game/sonotchi-bowl.exe` が生成されます。これ1ファイルを渡すだけで、
ダブルクリックでブラウザのアプリモードでゲームが起動します（追加インストール不要）。
初回は Windows SmartScreen が出ることがあるので「詳細情報 → 実行」で起動できます。

## ゲームに本人写真を使う

`apps/game/assets/` に `sonotchi.jpg`（または .png/.jpeg/.webp）を置くと、
主人公の弾が本人写真になります（無ければ似顔絵で動作）。
