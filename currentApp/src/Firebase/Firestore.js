// Firestore.js
import { db } from "./Firebase";
import { collection, addDoc, getDocs, query, orderBy, where, deleteDoc, doc } from "firebase/firestore";

// Save a note in Firestore
export async function addNote(userId, title, content) {
  await addDoc(collection(db, "notes"), {
    userId,
    title,
    content,
    timestamp: new Date(),
  });
}

// Fetch all notes from Firestore
export async function fetchNotes() {
  const querySnapshot = await getDocs(collection(db, "notes"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}


// Fetch notes only by current user, sorted by timestamp
export async function fetchUserNotes(userId) {
  const q = query(
    collection(db, "notes"),
    where("userId", "==", userId),
    orderBy("timestamp", "desc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Delete note by ID
export async function deleteNote(noteId) {
  await deleteDoc(doc(db, "notes", noteId));
}
