// =====================================================
// LOCAL DB — IndexedDB para Modo Offline
// =====================================================

const DB_NAME = 'LinguistOfflineDB';
const DB_VERSION = 1;
let db = null;

/** Inicializa la base de datos local */
export function initLocalDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const d = e.target.result;
      // Textos de reading offline
      if (!d.objectStoreNames.contains('reading')) {
        d.createObjectStore('reading', { keyPath: 'id' });
      }
      // Vocabulario offline
      if (!d.objectStoreNames.contains('vocabulary')) {
        d.createObjectStore('vocabulary', { keyPath: 'id' });
      }
      // Palabras del ahorcado offline
      if (!d.objectStoreNames.contains('hangman')) {
        d.createObjectStore('hangman', { keyPath: 'id' });
      }
      // Cola de sincronización (palabras guardadas sin conexión)
      if (!d.objectStoreNames.contains('syncQueue')) {
        d.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      }
    };

    req.onsuccess = (e) => { db = e.target.result; resolve(db); };
    req.onerror = () => reject(req.error);
  });
}

/** Guardar array de items en un store */
export function cacheItems(storeName, items) {
  return new Promise((resolve, reject) => {
    if (!db) return resolve();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    items.forEach(item => store.put(item));
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

/** Obtener todos los items de un store */
export function getLocalItems(storeName) {
  return new Promise((resolve, reject) => {
    if (!db) return resolve([]);
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Encolar una palabra para sincronizar cuando haya conexión */
export function queueSync(word, translation, profileId) {
  return new Promise((resolve, reject) => {
    if (!db) return resolve();
    const tx = db.transaction('syncQueue', 'readwrite');
    tx.objectStore('syncQueue').add({ word, translation, profileId, ts: Date.now() });
    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
  });
}

/** Obtener y limpiar la cola de sincronización */
export function flushSyncQueue() {
  return new Promise((resolve, reject) => {
    if (!db) return resolve([]);
    const tx = db.transaction('syncQueue', 'readwrite');
    const store = tx.objectStore('syncQueue');
    const req = store.getAll();
    req.onsuccess = () => {
      const items = req.result;
      store.clear();
      tx.oncomplete = () => resolve(items);
    };
    req.onerror = () => reject(req.error);
  });
}
