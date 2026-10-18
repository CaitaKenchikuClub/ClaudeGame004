# ClaudeGame004

ウミウシ

ブラウザで遊べるカジュアルゲームの開発リポジトリです。GitHub Pages での公開を想定し、将来は Capacitor で Android などのスマートフォンアプリ化（オフライン対応・広告による収益化）を予定しています。

ゲーム「ぼくのウミウシ」：水槽でウミウシのこどもを育て、えさや住む場所によっていろいろなウミウシに変身させる育成ゲーム。えさやり・もようがえ・ショップ・海へ（磯あそび／ダイビング）・図鑑・かんしょう（全画面で水槽を眺めるモード）・BGM の機能があります。

> ゲームの制作は claude.ai のアーティファクト「ぼくのウミウシ」で行い、このリポジトリはその最新版を `index.html` として取り込んで（連携して）管理・公開します。
> 連携は「ぼくのウミウシ最新版を連携して」と依頼すると、アーティファクトの最新版を無改変で取り込み、テスト・動作確認のうえ main に反映します。

## 技術スタック

- 素の HTML / CSS / JavaScript、Canvas 2D
- ゲームは `index.html` 1 ファイルに CSS・JS・画像（data URI）まで含む構成。BGM のみ別ファイル `bgm.mp3`（`fetch('bgm.mp3')` で相対パス読み込み、最初のタップ後に再生）
- ビルド不要・実行時の依存ライブラリなし（フォントのみ Google Fonts。読めない場合は端末のフォントで表示）
- Node.js（18 以上）はローカルサーバーとテストにのみ使用（npm パッケージのインストール不要）

## ローカルで動かす

`index.html` は直接開いても動きますが、実際の配信環境に近づけるため HTTP サーバー経由での確認を推奨します。

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

ゲーム自体の自動テストはまだ無いため、変更後はブラウザ（スマホサイズ）での動作確認を行ってください。

## ファイル構成

```
index.html          ゲーム本体「ぼくのウミウシ」（約 4.5MB。CSS・JS・画像をすべて内包）
bgm.mp3             BGM（約 3.1MB。アーティファクトの公開ファイルをそのまま取り込み）
.nojekyll           Pages で Jekyll 処理を無効化（_ で始まるファイル等を正しく配信するため）
src/
  storage.js        保存層（将来ゲームのセーブ処理をここへ移す予定。現在ゲームからは未使用）
  ads.js            広告の差し込み口（現在は何もしないスタブ。ゲームからは未使用）
assets/             画像・音声などの素材置き場（現在は未使用。画像は index.html に埋め込み）
scripts/serve.mjs   依存なしのローカル確認用サーバー
tests/              node:test によるテスト
docs/               設計メモ・今後の課題
```

## 開発ルール（要点）

- リソースは必ず相対パス（`./src/...`）で参照する。`/src/...` のようなルート絶対パスは Pages のサブパス配信で壊れる
- セーブはゲーム内の `save()` / `load()`（localStorage キー `bokuno-umiushi-save`、`migrate()` でバージョン移行）。セーブ形式を変える時は必ず `migrate()` に移行処理を足し、既存プレイヤーのデータを壊さない
- claude.ai 上でのみ動くクラウド保存（`window.claude`）は、それ以外の環境では自動で無効になる
- BGM のオン/オフはメニューから切り替え、localStorage キー `umi-bgm` に保存される
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
