/**
 * cartPersistence.ts
 * 
 * Backend-first cart persistence with IndexedDB as silent fallback.
 * - On every mutation: update backend, fallback to IndexedDB on error
 * - On load: fetch from backend, fallback to IndexedDB if unreachable
 */

const BACKEND_URL = 'http://localhost:4002/api/cart';
const IDB_NAME = 'talview-cart-db';
const IDB_STORE = 'cart';
const IDB_VERSION = 1;

export interface CartItemData {
    id: number;
    title: string;
    price: number;
    quantity: number;
    thumbnail: string;
}

// ============================================
// IndexedDB Helpers (silent fallback)
// ============================================

function openIDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(IDB_NAME, IDB_VERSION);
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(IDB_STORE)) {
                db.createObjectStore(IDB_STORE, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function saveCartToIndexedDB(items: CartItemData[]): Promise<void> {
    try {
        const db = await openIDB();
        const tx = db.transaction(IDB_STORE, 'readwrite');
        const store = tx.objectStore(IDB_STORE);
        store.clear();
        items.forEach(item => store.put(item));
        await new Promise<void>((resolve, reject) => {
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    } catch (err) {
        console.warn('IndexedDB save failed (non-critical):', err);
    }
}

export async function loadCartFromIndexedDB(): Promise<CartItemData[]> {
    try {
        const db = await openIDB();
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const request = store.getAll();
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result || []);
            request.onerror = () => reject(request.error);
        });
    } catch (err) {
        console.warn('IndexedDB load failed (non-critical):', err);
        return [];
    }
}

// ============================================
// Backend API Helpers
// ============================================

function getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('jwt_token');
    const headers: Record<string, string> = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

export async function fetchCartFromBackend(): Promise<CartItemData[]> {
    const response = await fetch(BACKEND_URL, {
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Backend cart fetch failed: ${response.status}`);
    return response.json();
}

export async function syncAddToBackend(item: CartItemData): Promise<void> {
    await fetch(BACKEND_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify(item),
    });
}

export async function syncUpdateToBackend(productId: number, quantity: number): Promise<void> {
    await fetch(`${BACKEND_URL}/${productId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
        },
        body: JSON.stringify({ quantity }),
    });
}

export async function syncRemoveFromBackend(productId: number): Promise<void> {
    await fetch(`${BACKEND_URL}/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
}

export async function syncClearBackend(): Promise<void> {
    await fetch(BACKEND_URL, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
}

// ============================================
// Unified Load: backend-first, IndexedDB fallback
// ============================================

export async function loadCart(): Promise<CartItemData[]> {
    try {
        const items = await fetchCartFromBackend();
        // Mirror to IndexedDB for offline access
        await saveCartToIndexedDB(items);
        return items;
    } catch (err) {
        console.warn('Backend unreachable, falling back to IndexedDB:', err);
        return loadCartFromIndexedDB();
    }
}
