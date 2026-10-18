import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createStorage, createMemoryBackend } from '../src/storage.js';

test('保存したデータを読み出せる', async () => {
  const s = createStorage(createMemoryBackend());
  assert.equal(await s.save('stats', { taps: 3 }), true);
  assert.deepEqual(await s.load('stats', null), { taps: 3 });
});

test('未保存のキーはフォールバック値を返す', async () => {
  const s = createStorage(createMemoryBackend());
  assert.deepEqual(await s.load('missing', { a: 1 }), { a: 1 });
});

test('壊れたデータやバージョン違いはフォールバック値を返す', async () => {
  const backend = createMemoryBackend();
  const s = createStorage(backend);
  await backend.set('claudegame004:broken', '{not json');
  await backend.set('claudegame004:old', JSON.stringify({ v: 0, data: 1 }));
  assert.equal(await s.load('broken', 'fb'), 'fb');
  assert.equal(await s.load('old', 'fb'), 'fb');
});

test('削除できる', async () => {
  const s = createStorage(createMemoryBackend());
  await s.save('k', 1);
  await s.remove('k');
  assert.equal(await s.load('k', null), null);
});

test('localStorage が無い環境（Node）でも例外を投げない', async () => {
  const s = createStorage();
  assert.equal(await s.save('k', 1), true);
  assert.equal(await s.load('k', null), 1);
});
