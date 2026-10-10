/**
 * IndexedDB storage engine for HUE OUTSIDE.
 * Safely persists high-resolution user photos locally without localStorage quota limits.
 * All user photos remain 100% strictly on device.
 */

const DB_NAME = 'HueOutsidePhotoDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

interface StoredPhotoRecord {
  id: string; // `${date}_${type}` e.g. "2026-10-11_nature"
  date: string;
  type: 'nature' | 'everyday';
  dataUrl: string;
  createdAt: string;
}

let dbInstance: IDBDatabase | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('type', 'type', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Save or replace a photo record
 */
export async function savePhotoToDB(
  date: string,
  type: 'nature' | 'everyday',
  dataUrl: string
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const record: StoredPhotoRecord = {
      id: `${date}_${type}`,
      date,
      type,
      dataUrl,
      createdAt: new Date().toISOString()
    };
    const req = store.put(record);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Retrieve a photo by date and type
 */
export async function getPhotoFromDB(
  date: string,
  type: 'nature' | 'everyday'
): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(`${date}_${type}`);
      req.onsuccess = () => {
        const result = req.result as StoredPhotoRecord | undefined;
        resolve(result ? result.dataUrl : null);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error fetching photo from IndexedDB:', err);
    return null;
  }
}

/**
 * Delete a specific photo
 */
export async function deletePhotoFromDB(
  date: string,
  type: 'nature' | 'everyday'
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(`${date}_${type}`);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

/**
 * Delete both photos for a specific date
 */
export async function deleteDayPhotosFromDB(date: string): Promise<void> {
  await Promise.all([
    deletePhotoFromDB(date, 'nature'),
    deletePhotoFromDB(date, 'everyday')
  ]);
}

/**
 * Fetch all photos currently stored in IndexedDB as a map: { [id]: dataUrl }
 */
export async function getAllPhotosFromDB(): Promise<Record<string, string>> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const records = (req.result || []) as StoredPhotoRecord[];
        const map: Record<string, string> = {};
        for (const rec of records) {
          map[rec.id] = rec.dataUrl;
        }
        resolve(map);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error retrieving all photos from IndexedDB:', err);
    return {};
  }
}

/**
 * Compute approximate local photo storage usage
 */
export async function getStorageStats(): Promise<{ count: number; estimatedBytes: number }> {
  try {
    const photos = await getAllPhotosFromDB();
    let bytes = 0;
    const count = Object.keys(photos).length;
    for (const key in photos) {
      bytes += photos[key].length;
    }
    return { count, estimatedBytes: bytes };
  } catch {
    return { count: 0, estimatedBytes: 0 };
  }
}

/**
 * Wipe all photo records from IndexedDB
 */
export async function clearAllPhotosFromDB(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
