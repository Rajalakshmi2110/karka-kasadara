import { useEffect, useState } from "react";
import { auth } from "../Firebase/Firebase";
import {
  addActiveUser,
  listenForActiveUsers,
} from "../Firebase/rtdb";
import {
  fetchUserNotes,
  addNote,
  deleteNote,
} from "../Firebase/Firestore";
import defaultProfilePic from "../assets/Default.png";
import "../styles/Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activeUsers, setActiveUsers] = useState({});
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      addActiveUser(currentUser.uid, currentUser.displayName);
      fetchUserNotes(currentUser.uid).then(setNotes);
    }

    listenForActiveUsers(setActiveUsers);
  }, []);

  const handleAddNote = async () => {
    if (noteTitle.trim() && noteContent.trim()) {
      await addNote(user.uid, noteTitle, noteContent);
      const updatedNotes = await fetchUserNotes(user.uid);
      setNotes(updatedNotes);
      setNoteTitle("");
      setNoteContent("");
    }
  };

  const handleDeleteNote = async (noteId) => {
    await deleteNote(noteId);
    const updatedNotes = await fetchUserNotes(user.uid);
    setNotes(updatedNotes);
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile</h1>

      {user ? (
        <div className="profile-info">
          <img src={defaultProfilePic} alt="Profile" className="profile-pic-large" />
          <p><strong>Name:</strong> {user.displayName}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p className="not-logged-in">Please log in.</p>
      )}
       <h2 className="section-title">Your Notes</h2>
      {user && (
        <div className="add-note-form">
          <input
            type="text"
            placeholder="Note Title"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
          />
          <textarea
            placeholder="Note Content"
            rows="4"
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          />
          <button onClick={handleAddNote}>Add Note</button>
        </div>
      )}

      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{note.title}</strong>: {note.content}
            <button
              className="delete-note-btn"
              onClick={() => handleDeleteNote(note.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <h2 className="section-title">Active Users</h2>
      <ul className="users-list">
        {Object.values(activeUsers).map((user, index) => (
          <li key={index}>{user.username} is online</li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;
