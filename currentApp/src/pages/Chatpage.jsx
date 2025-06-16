import React, { useEffect, useState } from 'react';
import '../styles/ChatPage.css';
import Conversations from '../components/Conversations';
import Message from '../components/Message.jsx';
import Online from '../components/Online.jsx';
import VideoCall from '../components/VideoCall.jsx';
import { db } from '../Firebase/Firebase.js';
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
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
  const [newMessage, setNewMessage] = useState('');
  const [showCall, setShowCall] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [callMessageSent, setCallMessageSent] = useState(false);

  useEffect(() => {
    if (!activeRoom) return;

    const q = query(
      collection(db, 'chatRooms', activeRoom.id, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [activeRoom]);

  const handleEmailSubmit = async () => {
    if (!email || !activeRoom) return;

    const roomRef = doc(db, 'chatRooms', activeRoom.id);
    await updateDoc(roomRef, {
      members: arrayUnion(email),
    });

    alert(`Invite sent to ${email}`);
    setEmail('');
    setEmailModalOpen(false);
  };

  const sendVideoCallMessage = async (message) => {
    if (!activeRoom || !user) return;

    await addDoc(collection(db, 'chatRooms', activeRoom.id, 'messages'), {
      text: message,
      sender: user.email,
      timestamp: serverTimestamp(),
    });
    setCallMessageSent(true);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeRoom || !user) return;

    await addDoc(collection(db, 'chatRooms', activeRoom.id, 'messages'), {
      text: newMessage.trim(),
      sender: user.email,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  const startCall = async () => {
    if (isCalling || !activeRoom) return;

    sendVideoCallMessage('A video call has started. Click to join.');
    setIsCalling(true);
    setShowCall(true);

    socket.emit('startCall', { roomId: activeRoom.id, userEmail: user.email });
  };

  const joinCall = () => {
    setShowCall(true);
    socket.emit('joinCall', { roomId: activeRoom.id, userEmail: user.email });
  };

  const endCall = () => {
    sendVideoCallMessage('The video call has ended.');
    setIsCalling(false);
    setShowCall(false);
  };

  return (
  <>
    <div className="chatTopbar">
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <input placeholder="search for friends" className="ChatMenuInput" />
        </div>
        <Conversations setActiveRoom={setActiveRoom} />
      </div>

      <div className="chatBox">
        <div className="chatBoxWrapper">

          {/* New chat header with room name and controls */}
          <div className="chatHeader">
            {activeRoom?.name && <h3 className="roomName">{activeRoom.name}</h3>}
            <div className="controlButtons">
              <button className="addEmailButton" onClick={() => setEmailModalOpen(true)}>+</button>
              <button onClick={startCall} className="startCallButton">📹 Start Video Call</button>
              {isCalling && (
                <button onClick={endCall} className="endCallButton">End Call</button>
              )}
              {callMessageSent && !isCalling && (
                <button onClick={joinCall} className="joinCallButton">Join Video Call</button>
              )}
            </div>
          </div>

          <div className="chatboxTop">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <Message
                  key={msg.id}
                  text={msg.text}
                  sender={msg.sender}
                  own={msg.sender === user?.email}
                />
              ))
            ) : (
              <p className="noMessages">No messages yet in this room.</p>
            )}
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

    {showCall && activeRoom && (
      <VideoCall socket={socket} roomId={activeRoom.id} userEmail={user?.email} />
    )}

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
