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

## 初期整備で行ったこと

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
- [x] favicon の 404 を抑止
- [ ] Pages の有効化（所有者作業：Settings → Pages → main / root）
- [ ] Pages は HTTPS 配信のため、将来の外部リソースも HTTPS 必須
- [ ] Pages は全リポジトリファイルを公開する点に注意（秘密情報を置かない）。`docs/` や `tests/` も公開されるが実害はない

## 今後の推奨タスク（優先度順）

1. **ゲーム仕様の決定**：「ウミウシ」をテーマにしたゲーム内容・操作・勝敗条件を決める
2. **ゲーム本体の実装**：`src/main.js` のプレースホルダーを置き換え、シーン（タイトル/プレイ/リザルト）単位でモジュール分割
3. **サウンド**：Web Audio はユーザー操作後に開始する必要がある（最初のタップで `AudioContext.resume()`）
4. **PWA 化（オフライン対応の第一段階）**：`manifest.webmanifest`・アイコン・Service Worker を追加（詳細は [OFFLINE_AND_ADS.md](OFFLINE_AND_ADS.md)）
5. **CI**：GitHub Actions で `npm test` を実行（必要になった段階で）
6. **Capacitor 化**：[CAPACITOR.md](CAPACITOR.md) の手順に沿って実施（指示があった段階で）
7. **広告導入**：アプリ化後、[OFFLINE_AND_ADS.md](OFFLINE_AND_ADS.md) の方針に沿って実施（指示があった段階で）
