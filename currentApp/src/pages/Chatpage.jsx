import React, { useEffect, useState } from 'react';
import '../styles/ChatPage.css';
import Conversations from '../components/Conversations';
import Message from "../components/Message.jsx";
import Online from "../components/Online.jsx";
import { db } from '../Firebase/Firebase.js';
import { doc, updateDoc, arrayUnion, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { io } from 'socket.io-client';
import { getAuth } from 'firebase/auth';

const socket = io('http://localhost:8080');

const ChatPage = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [activeRoom, setActiveRoom] = useState(null);
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(''); // For the input field of new message

  // Fetch messages whenever activeRoom changes
  useEffect(() => {
    if (!activeRoom) return;

    const q = query(
      collection(db, 'chatRooms', activeRoom.id, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [activeRoom]);

  // Invite user to the room by email
  const handleEmailSubmit = async () => {
    if (!email || !activeRoom) return;

    const roomRef = doc(db, 'chatRooms', activeRoom.id);
    await updateDoc(roomRef, {
      members: arrayUnion(email)
    });

    alert(`Invite sent to ${email}`);
    setEmail('');
    setEmailModalOpen(false);
  };

  // Send a new message to Firestore
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeRoom || !user) return;

    await addDoc(collection(db, 'chatRooms', activeRoom.id, 'messages'), {
      text: newMessage.trim(),
      sender: user.email,
      timestamp: serverTimestamp()
    });

    setNewMessage(''); // Clear the input field
  };

  return (
    <>
      <div className="chatTopbar">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="search for friends" className='ChatMenuInput' />
          </div>
          <Conversations setActiveRoom={setActiveRoom} />
        </div>

        <div className="chatBox">
          <div className="chatBoxWrapper">
            <div className="chatboxTop">
              {messages.length > 0 ? (
                messages.map(msg => (
                  <Message
                    key={msg.id}
                    text={msg.text}
                    sender={msg.sender}
                    own={msg.sender === user?.email} // Highlight own messages
                  />
                ))
              ) : (
                <p className="noMessages">No messages yet in this room.</p>
              )}
              <button className="addEmailButton" onClick={() => setEmailModalOpen(true)}>+</button>
            </div>

            <div className="chatboxBottom">
              <textarea
                placeholder="Write something..."
                className="input"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button className="chatsubmitButton" onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>

        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <Online />
          </div>
        </div>
      </div>

      {/* Email Invite Modal */}
      {isEmailModalOpen && (
        <div className="emailModal">
          <div className="modalContent">
            <h3>Enter email to send invite</h3>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
            <button onClick={handleEmailSubmit}>Send Request</button>
            <button onClick={() => setEmailModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPage;
