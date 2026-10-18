// エントリーポイント。
// ゲーム本体は未実装のため、現在は動作確認用のプレースホルダー画面
// （画面サイズ追従・タッチ入力・保存・一時停止の確認）のみを表示する。

import { storage } from './storage.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const state = {
  width: 0,
  height: 0,
  paused: false,
  taps: 0,
  ripples: [],
};

let last = performance.now();

// 論理サイズ（CSS px）で描画し、devicePixelRatio 分だけ解像度を上げる
function resize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  state.width = rect.width;
  state.height = rect.height;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

// マウス・タッチ・ペンを Pointer Events で統一して扱う
canvas.addEventListener('pointerdown', (e) => {
  const rect = canvas.getBoundingClientRect();
  state.ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, t: 0 });
  state.taps += 1;
  storage.save('stats', { taps: state.taps });
});

// バックグラウンド移行時（タブ切替・アプリ切替・将来の広告表示）に一時停止する
document.addEventListener('visibilitychange', () => {
  state.paused = document.hidden;
  last = performance.now();
});

window.addEventListener('resize', resize);

function update(dt) {
  for (const r of state.ripples) r.t += dt;
  state.ripples = state.ripples.filter((r) => r.t < 0.8);
}

function draw() {
  const { width: w, height: h } = state;
  ctx.fillStyle = '#0b2a3a';
  ctx.fillRect(0, 0, w, h);

  for (const r of state.ripples) {
    const p = r.t / 0.8;
    ctx.strokeStyle = `rgba(160, 230, 255, ${1 - p})`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(r.x, r.y, 10 + p * 60, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = '#e8f6ff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const size = Math.max(24, Math.min(w, h) * 0.1);
  ctx.font = `bold ${size}px system-ui, sans-serif`;
  ctx.fillText('ウミウシ', w / 2, h / 2 - size);
  ctx.font = `${size * 0.4}px system-ui, sans-serif`;
  ctx.fillText('準備中 — タップで入力テスト', w / 2, h / 2 + size * 0.2);
  ctx.fillText(`タップ回数: ${state.taps}`, w / 2, h / 2 + size * 0.9);
}

function frame(now) {
  // タブ復帰直後などの巨大な dt でゲームが飛ばないよう上限を設ける
  const dt = Math.min((now - last) / 1000, 0.1);
  last = now;
  if (!state.paused) update(dt);
  draw();
  requestAnimationFrame(frame);
}

async function start() {
  const stats = await storage.load('stats', { taps: 0 });
  state.taps = stats.taps ?? 0;
  resize();
  requestAnimationFrame(frame);
}

start();
