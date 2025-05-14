import React, { useState } from 'react';
import MemberList from './MemberList';

const ChatWindow = ({ room }) => {
  const [showMembers, setShowMembers] = useState(false);

  if (!room) return <div className="w-3/4 p-4">Select a room to start chatting.</div>;

  return (
    <div className="w-3/4 p-4 flex flex-col">
      <div className="flex justify-between items-center border-b pb-2">
        <h2
          className="text-2xl font-semibold cursor-pointer"
          onClick={() => setShowMembers((prev) => !prev)}
        >
          {room.name}
        </h2>
        {showMembers && <MemberList members={room.members} />}
      </div>
      <div className="flex-1 mt-4">
        {/* Chat messages would go here */}
        <p>Chat messages for <strong>{room.name}</strong></p>
      </div>
    </div>
  );
};

export default ChatWindow;
