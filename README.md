# ClaudeGame004

ウミウシ

ブラウザで遊べるカジュアルゲームの開発リポジトリです。GitHub Pages での公開を想定し、将来は Capacitor で Android などのスマートフォンアプリ化（オフライン対応・広告による収益化）を予定しています。

> 現状：ゲーム本体は未実装です。`index.html` を開くと、画面サイズ追従・タッチ入力・保存・一時停止の動作確認用プレースホルダー画面が表示されます。

## 技術スタック

- 素の HTML / CSS / JavaScript（ES Modules）、Canvas 2D
- ビルド不要・実行時の依存ライブラリなし
- Node.js（18 以上）はローカルサーバーとテストにのみ使用（npm パッケージのインストール不要）

## ローカルで動かす

ES Modules を使うため、`index.html` をファイルとして直接開くのではなく HTTP サーバー経由で開いてください。

```sh
npm start                              # http://localhost:8000/
BASE=/ClaudeGame004/ npm start         # GitHub Pages のサブパス配信を再現
```

Node.js が無い場合は `python3 -m http.server 8000` でも動きます。

## テスト

```sh
npm test
```

- `tests/storage.test.mjs`：保存層の動作
- `tests/paths.test.mjs`：リソース参照が相対パスであること（Pages サブパス・Capacitor 対策）と、参照先ファイルの存在

## ファイル構成

```
index.html          エントリーポイント（Pages はリポジトリ直下を配信）
.nojekyll           Pages で Jekyll 処理を無効化（_ で始まるファイル等を正しく配信するため）
src/
  main.js           ゲームループ・入力・描画（現在はプレースホルダー）
  storage.js        セーブデータ・設定の保存層（localStorage → 将来 Capacitor Preferences へ差し替え可能）
  ads.js            広告の差し込み口（現在は何もしないスタブ）
  style.css         全画面・safe-area・タッチ操作向けのスタイル
assets/             画像・音声などの素材置き場
scripts/serve.mjs   依存なしのローカル確認用サーバー
tests/              node:test によるテスト
docs/               設計メモ・今後の課題
```

## 開発ルール（要点）

- リソースは必ず相対パス（`./src/...`）で参照する。`/src/...` のようなルート絶対パスは Pages のサブパス配信で壊れる
- 保存は `src/storage.js` 経由で行い、`localStorage` を直接使わない
- 広告は `src/ads.js` 経由で呼ぶ。SDK・広告 ID はまだ導入しない
- 外部 CDN への依存を増やさない（オフライン化の妨げになる）。素材やライブラリはリポジトリ内に置く
- 入力は Pointer Events で扱い、マウス・タッチ両対応にする
- APIキーなどの秘密情報をコミットしない

## GitHub Pages での公開（リポジトリ所有者の作業）

Settings → Pages → Source を「Deploy from a branch」、Branch を `main` / `/ (root)` に設定してください。公開 URL は `https://<owner>.github.io/ClaudeGame004/` になります。追加のビルド手順はありません。

## ドキュメント

- [docs/ROADMAP.md](docs/ROADMAP.md)：現状調査と今後の推奨タスク
- [docs/CAPACITOR.md](docs/CAPACITOR.md)：Capacitor によるアプリ化の課題と方針
- [docs/OFFLINE_AND_ADS.md](docs/OFFLINE_AND_ADS.md)：オフライン対応・広告導入の課題と設計上の注意点
