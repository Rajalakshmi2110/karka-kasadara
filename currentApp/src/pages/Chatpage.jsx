import React, { useEffect, useState } from 'react';
import '../styles/ChatPage.css';
import Conversations from '../components/Conversations';
import Message from '../components/Message.jsx';
import Online from '../components/Online.jsx';
import VideoCall from '../components/VideoCall.jsx'; // New component
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
  const [showCall, setShowCall] = useState(false); // For video call
  const [isCalling, setIsCalling] = useState(false); // Track call state
  const [callMessageSent, setCallMessageSent] = useState(false); // Track if the call message is sent

  // Fetch messages when room changes
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

  // Invite user
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

  // Send video call message to chat history
  const sendVideoCallMessage = async (message) => {
    if (!activeRoom || !user) return;

    await addDoc(collection(db, 'chatRooms', activeRoom.id, 'messages'), {
      text: message,
      sender: user.email,
      timestamp: serverTimestamp(),
    });
    setCallMessageSent(true); // Mark the message as sent
  };

  // Send chat message
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeRoom || !user) return;

    await addDoc(collection(db, 'chatRooms', activeRoom.id, 'messages'), {
      text: newMessage.trim(),
      sender: user.email,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  // Start video call
  const startCall = async () => {
    if (isCalling || !activeRoom) return;

    // Send video call message
    sendVideoCallMessage('A video call has started. Click to join.');

    setIsCalling(true); // Mark call as started
    setShowCall(true); // Show the video call UI

    // Emit signal to other users in the room
    socket.emit('startCall', { roomId: activeRoom.id, userEmail: user.email });
  };

  // Join video call (for other members)
  const joinCall = () => {
    setShowCall(true);
    socket.emit('joinCall', { roomId: activeRoom.id, userEmail: user.email });
  };

  // End video call
  const endCall = () => {
    // Stop all media tracks (video/audio)
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    // Send message indicating video call ended
    sendVideoCallMessage('The video call has ended.');

    setIsCalling(false); // Mark call as ended
    setShowCall(false); // Hide the video call UI
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
              <button className="addEmailButton" onClick={() => setEmailModalOpen(true)}>+</button>
              <button onClick={startCall} className="startCallButton">📹 Start Video Call</button>
              {isCalling && (
                <button onClick={endCall} className="endCallButton">End Call</button>
              )}
              {/* Show 'Join Call' button if the call message is present and user is not already in a call */}
              {callMessageSent && !isCalling && (
                <button onClick={joinCall} className="joinCallButton">Join Video Call</button>
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

      {/* Video Call UI */}
      {showCall && activeRoom && (
        <VideoCall socket={socket} roomId={activeRoom.id} userEmail={user?.email} />
      )}

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
