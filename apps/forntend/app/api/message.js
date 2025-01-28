const dbName = 'MessageDB';
const storeName = 'Messages';
import axios from "axios";


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
export const addMessage = async (db, message) => {
    console.log(message)
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


export const fetchMessages=async(userId, friendId, db)=> {
    try {
        if (!db) {
            throw new Error('Database is not initialized');
          }
      // Make the API call to fetch messages
      console.log("Fetching messages...");
      const response = await fetch(`http://localhost:5000/api/messages/${userId}/${friendId}`);
      
      // Check if the response is successful
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
  
      const messages = await response.json();
      console.log('Fetched messages:', messages);
  
      for (const message of messages) {
        console.log('Adding message:', message);
        await addMessage(db, message); // Make sure db is passed correctly
      }
      console.log("All messages added successfully.");
  
    } catch (error) {
      console.error('Error fetching and storing messages:', error);
    }
  }
 



