# Capacitor によるアプリ化：課題と方針

現段階では Capacitor は導入していません。導入時に困らないよう、以下を前提に設計しています。

## すでに対応済みの点

- **相対パス**：Capacitor は `https://localhost/`（Android）などのオリジンで Web 資産を配信する。相対パスで書いておけば Pages とアプリの両方で動く
- **外部依存はほぼなし**：画像は index.html に埋め込み済み。Google Fonts のみ外部読み込み（オフライン時は端末フォントで動作。アプリ化前に同梱推奨）
- **タッチ・画面サイズ**：ゲームは `viewport-fit=cover` と `env(safe-area-inset-*)` に対応済み、スマホ縦画面向けのレイアウト
- **保存層**：ゲームは現在 localStorage に直接保存している。WebView の localStorage は OS により消去される可能性があるため、アプリ化前にゲームの `save()`/`load()` を `src/storage.js`（Promise ベース）経由に変更し、`@capacitor/preferences` へ差し替える
- **ライフサイクル**：ゲームは実時間で進む（おなかがすく・成長する）。アプリのバックグラウンド移行時に確実にセーブするため、`@capacitor/app` の `pause` で `save()` を呼ぶ

## 導入時の課題

1. **webDir の扱い**
   Pages はリポジトリ直下を配信しているが、Capacitor の `webDir` に直下を指定すると `docs/`・`tests/`・`node_modules/` までアプリに同梱されてしまう。
   → 導入時に `index.html`（と将来分割したファイル）を `www/`（`.gitignore` 済み）へコピーするスクリプトを `package.json` に追加し、`webDir: "www"` とする方針。
2. **devDependencies の追加**：`@capacitor/core`・`@capacitor/cli`・`@capacitor/android` が必要になる（その時点で `package.json` に追加）
3. **ネイティブプロジェクトの管理**：`npx cap add android` で生成される `android/` はリポジトリにコミットするのが一般的。署名鍵（keystore）やパスワードは絶対にコミットしない
4. **戻るボタン（Android）**：ハードウェア戻るボタンで即終了しないよう `@capacitor/app` の `backButton` を処理する
5. **画面向き**：ゲームの向き（縦/横固定）を決め、`AndroidManifest.xml` の `screenOrientation` で固定する
6. **音声**：WebView でも自動再生制限があるため、初回タップで AudioContext を開始する設計にする
7. **ストア要件**：アプリ ID（例 `com.example.umiushi`）、アイコン、スプラッシュ、プライバシーポリシー（広告導入時は必須）

## ブラウザ専用 API で避けるもの

- `alert`/`confirm`/`prompt`（アプリでは見栄えが悪い。ゲーム内 UI で代替）
- `window.open` や外部リンクへの直接遷移（アプリでは `@capacitor/browser` を使う）
- ページ遷移を伴う複数 HTML 構成（単一ページで画面を切り替える）
