import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';


const socket = io('http://localhost:8080'); 

const Online = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
   
    socket.on('onlineUsers', (users) => {
      setOnlineUsers(users);
    });

 
    return () => {
      socket.off('onlineUsers');
    };
  }, []);

  return (
    <div className="OnlineFriends">
      {onlineUsers.length > 0 ? (
        onlineUsers.map((user, index) => (
          <div key={index} className="chatOnlineFriend">
            <div className="chatOnlineImg">
              <img
                className="OnlineFriendImg"
                src="https://images.unsplash.com/photo-1741732311554-911ecc8da478?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
              />
              <div className="chatOnlineBadge"></div>
            </div>
            <span className="chatonlineName">{user}</span>
          </div>
        ))
      ) : (
        <p> 👤 No users online</p>
      )}
    </div>
  );
};

export default Online;
