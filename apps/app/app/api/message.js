const dbName = 'MessageDB';
const storeName = 'Messages';

// Initialize the database
export const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName, { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
};

// Add a message to the database
export const addMessage = (db, message) => {
    return new Promise((resolve, reject) => {
        // Ensure the message has an id before adding
        if (!message.id) {
            message.id = new Date().getTime(); // Generate a unique id based on timestamp
        }
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.add(message);

        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event.target.error);
    });
};

// Get all messages
export const getAllMessages = (db) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = (event) => reject(event.target.error);
    });
};
