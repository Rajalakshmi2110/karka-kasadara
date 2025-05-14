import React from 'react';
import '../styles/Message.css';

const Message = ({ text, sender, own }) => {
  return (
    <div className={`message ${own ? 'own' : ''}`}>
      <div className="messageTop">
        <p className="messageText">{text}</p>
      </div>
      <div className="messageBottom">{sender}</div>
    </div>
  );
};

export default Message;
