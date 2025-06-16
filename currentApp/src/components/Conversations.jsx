import React, { useEffect, useState } from 'react';
import { db, auth } from '../Firebase/Firebase';
import { collection, addDoc, onSnapshot, query, where } from 'firebase/firestore';

const Conversations = ({ setActiveRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chatRooms'),
      where('members', 'array-contains', user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRooms(roomsList);
    });

    return () => unsubscribe();
  }, [user]);

  const createRoom = async () => {
    if (!newRoomName) return;

    await addDoc(collection(db, 'chatRooms'), {
      name: newRoomName,
      members: [user.email], 
      createdAt: new Date()
    });

    setNewRoomName('');
  };

  return (
    <div className="conversations">
      <h2>Your Rooms</h2>
      <div className="roomsList">
        {rooms.map((room) => (
          <div key={room.id} className="room" onClick={() => setActiveRoom(room)}>
            <span>{room.name}</span>
          </div>
        ))}
      </div>
      <div className="createRoom">
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="Enter new room name"
        />
        <button onClick={createRoom}>Create Room</button>
      </div>
    </div>
  );
};

export default Conversations;
