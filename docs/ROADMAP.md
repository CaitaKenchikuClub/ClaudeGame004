# 現状と今後のタスク

## 初期調査結果（2026-10-18）

| 項目 | 状況 |
| --- | --- |
| ファイル構成 | `README.md`（「ウミウシ」の一行）のみ。コミットは Initial commit の 1 件 |
| 言語・フレームワーク | なし（ゲームコードが存在しない） |
| エントリーポイント・起動方法 | なし |
| 既存のゲーム機能 | なし。README からテーマは「ウミウシ」と推測されるが、仕様は未定 |
| ビルド・テスト | なし |

既存実装が無いため、技術スタックは「ビルド不要の素の HTML/CSS/JS（ES Modules）+ Canvas」を選択しました。理由：

- GitHub Pages にそのまま置ける（ビルド工程・Actions 不要）
- Capacitor は Web 資産をそのまま WebView で動かすため相性が良い
- 依存が無いのでオフライン化（全ファイルのキャッシュ）が容易

将来ゲームが大きくなりバンドラ（Vite 等）が必要になった場合は、その時点で導入を検討します（`base: './'` 設定が必要）。

## 2026-10-18 追記：ゲーム本体の取り込み

初期調査時点ではリポジトリにゲームが無かったが、ゲーム「ぼくのウミウシ」は claude.ai のアーティファクトとして作成済みだった。これを無改変で `index.html` として取り込み、プレースホルダー画面（`src/main.js`・`src/style.css`）は削除した。

取り込み時の確認結果：

- 1 ファイル約 4.4MB。画像（スプライト・背景・マップ）は data URI で埋め込み
- セーブは localStorage（`bokuno-umiushi-save`）。claude.ai のクラウド保存は `window.claude` がある時のみ動作し、Pages では自動で無効
- 外部依存は Google Fonts のみ（ブロックしても動作することを確認）
- Pages のサブパス（`/ClaudeGame004/`）・スマホ画面で、開始・チュートリアル・えさやり・セーブ・つづきからを確認

## 初期整備で行ったこと（取り込み前）

- エントリーポイント `index.html` と動作確認用プレースホルダー画面（`src/main.js`）
  - devicePixelRatio 対応の全画面 Canvas、リサイズ追従
  - Pointer Events によるタッチ/マウス入力
  - バックグラウンド移行時の一時停止（`visibilitychange`）と、復帰時の dt 上限
- 保存層 `src/storage.js`（Promise ベース、スキーマバージョン付き、localStorage 不可時はメモリにフォールバック）
- 広告スタブ `src/ads.js`
- `.nojekyll`、`.gitignore`、`.editorconfig`、`package.json`（依存なし）
- ローカルサーバー `scripts/serve.mjs`（`BASE` 指定で Pages のサブパスを再現）
- テスト（保存層・相対パス検査）

## GitHub Pages 公開時の注意点

- [x] リソースを相対パスで参照（テストで検査）
- [x] `.nojekyll` を配置
- [ ] favicon の用意（現在はブラウザが `/favicon.ico` を探して 404 になるが動作に影響なし）
- [ ] Pages の有効化（所有者作業：Settings → Pages → main / root）
- [ ] Pages は HTTPS 配信のため、将来の外部リソースも HTTPS 必須
- [ ] Pages は全リポジトリファイルを公開する点に注意（秘密情報を置かない）。`docs/` や `tests/` も公開されるが実害はない

## 今後の推奨タスク（優先度順）

1. **ゲームの機能追加・改善**（今後の指示に応じて）
2. **テスト用 UI の扱い**：画面下の「テスト用の時間の速さ ×1/×10/×60」ボタン、コード内の「テスト用に追加」データを、公開前に整理する
3. **フォントの同梱**：Google Fonts（Zen Maru Gothic / Klee One）をリポジトリに同梱し、オフラインでも同じ見た目にする（ライセンスは SIL OFL で同梱可）
4. **ファイル分割の検討**：4.4MB の 1 ファイルは編集・差分確認がしにくい。画像を `assets/`、CSS/JS を `src/` へ分ける（動作を変えずに段階的に）
5. **セーブ処理の整理**：ゲームの `save()`/`load()` を `src/storage.js` 経由にし、Capacitor Preferences へ差し替え可能にする
6. **サウンド**：Web Audio はユーザー操作後に開始する必要がある（最初のタップで `AudioContext.resume()`）
7. **PWA 化（オフライン対応の第一段階）**：`manifest.webmanifest`・アイコン・Service Worker を追加（詳細は [OFFLINE_AND_ADS.md](OFFLINE_AND_ADS.md)）
8. **CI**：GitHub Actions で `npm test` を実行（必要になった段階で）
9. **Capacitor 化**：[CAPACITOR.md](CAPACITOR.md) の手順に沿って実施（指示があった段階で）
10. **広告導入**：アプリ化後、[OFFLINE_AND_ADS.md](OFFLINE_AND_ADS.md) の方針に沿って実施（指示があった段階で）
