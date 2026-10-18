// 広告の差し込み口（現在は何もしないスタブ）。
// ゲームコードは広告 SDK を直接呼ばず、このインターフェースだけを使う。
// 将来 Capacitor + AdMob 等を導入する際は、この実装を差し替える。
// ※広告 ID・SDK はまだ導入しない（docs/OFFLINE_AND_ADS.md 参照）。

export const ads = {
  enabled: false,

  async init() {},

  async showBanner() {},

  async hideBanner() {},

  // インタースティシャル表示中はゲームを一時停止すること
  async showInterstitial() {
    return { shown: false };
  },

  // リワード広告。報酬付与は granted が true の時のみ行う
  async showRewarded() {
    return { shown: false, granted: false };
  },
};
