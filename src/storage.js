// セーブデータ・設定の保存層。
// ゲームコードは localStorage を直接触らず、必ずこのモジュール経由で保存する。
// 将来 Capacitor 化する際は、ここのバックエンドを @capacitor/preferences 等に
// 差し替えるだけで済むよう、API は Promise ベースにしている。

const PREFIX = 'claudegame004:';
const SCHEMA_VERSION = 1;

function createMemoryBackend() {
  const map = new Map();
  return {
    async get(key) { return map.has(key) ? map.get(key) : null; },
    async set(key, value) { map.set(key, value); },
    async remove(key) { map.delete(key); },
  };
}

function createLocalStorageBackend() {
  try {
    const ls = globalThis.localStorage;
    const probe = `${PREFIX}__probe__`;
    ls.setItem(probe, '1');
    ls.removeItem(probe);
    return {
      async get(key) { return ls.getItem(key); },
      async set(key, value) { ls.setItem(key, value); },
      async remove(key) { ls.removeItem(key); },
    };
  } catch {
    // プライベートモード等で使えない場合はメモリ保存にフォールバック
    return null;
  }
}

export function createStorage(backend = createLocalStorageBackend() ?? createMemoryBackend()) {
  return {
    async load(key, fallback) {
      try {
        const raw = await backend.get(PREFIX + key);
        if (raw == null) return fallback;
        const parsed = JSON.parse(raw);
        if (parsed?.v !== SCHEMA_VERSION) return fallback;
        return parsed.data;
      } catch {
        return fallback;
      }
    },
    async save(key, data) {
      try {
        await backend.set(PREFIX + key, JSON.stringify({ v: SCHEMA_VERSION, data }));
        return true;
      } catch {
        return false;
      }
    },
    async remove(key) {
      try {
        await backend.remove(PREFIX + key);
      } catch {
        // 削除失敗は致命的ではないので無視
      }
    },
  };
}

export { createMemoryBackend };

export const storage = createStorage();
