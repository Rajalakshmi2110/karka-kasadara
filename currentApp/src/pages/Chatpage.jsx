import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, push, onValue } from "firebase/database";
import { db } from "../Firebase/Firebase"; // Your Firebase config import

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const messagesRef = ref(db, "messages/");

    // Listen for new messages added to Firebase
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messageList = [];

      for (let id in data) {
        messageList.push({ id, ...data[id] });
      }
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      const messagesRef = ref(db, "messages/");
      const newMessageRef = push(messagesRef);
      set(newMessageRef, {
        text: message,
        timestamp: Date.now(),
      });
      setMessage(""); // Clear message input after sending
    }
  };

  return (
    <div className="chat-page">
      <div className="messages-container">
        <div className="message-list">
          {messages.map((msg) => (
            <div key={msg.id} className="message-item">
              <p>{msg.text}</p>
              <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="message-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
