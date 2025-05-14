import React from 'react';

const Sidebar = ({ rooms, currentRoomId, setCurrentRoomId }) => {
  return (
    <div className="w-1/4 bg-gray-800 text-white h-screen overflow-auto">
      <h2 className="text-xl font-bold p-4">My Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li
            key={room.id}
            onClick={() => setCurrentRoomId(room.id)}
            className={`p-4 cursor-pointer hover:bg-gray-700 ${currentRoomId === room.id ? 'bg-gray-700' : ''}`}
          >
            {room.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
