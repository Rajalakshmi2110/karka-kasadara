import React, { useEffect, useRef, useState } from 'react';

const VideoCall = ({ socket, roomId, userEmail }) => {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peerConnection = useRef(null);
  const [isCalling, setIsCalling] = useState(false); 
  const [stream, setStream] = useState(null);
  const servers = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  useEffect(() => {
    console.log('Initializing peer connection...');
    peerConnection.current = new RTCPeerConnection(servers);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(userStream => {
        console.log('Media stream obtained:', userStream);
        localVideo.current.srcObject = userStream;
        setStream(userStream);
        userStream.getTracks().forEach(track => {
          peerConnection.current.addTrack(track, userStream);
        });
      })
      .catch(err => {
        console.error("Error accessing media devices", err);
      });

    peerConnection.current.ontrack = event => {
      console.log('Received remote stream:', event.streams[0]);
      remoteVideo.current.srcObject = event.streams[0];
    };

    socket.on('offer', async (offer) => {
      console.log('Received offer:', offer);
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('answer', { answer, roomId });
    });

    socket.on('answer', async (answer) => {
      console.log('Received answer:', answer);
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on('ice-candidate', candidate => {
      console.log('Received ICE candidate:', candidate);
      peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
    });

    peerConnection.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit('ice-candidate', { candidate: e.candidate, roomId });
      }
    };

    return () => {
      peerConnection.current.close();
    };
  }, [socket, roomId]);

  const startCall = async () => {
    console.log("Start call button clicked");
    if (!isCalling) {
      console.log("Creating offer...");
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      console.log("Offer created, sending to server...");
      socket.emit('offer', { offer, roomId });
      setIsCalling(true);
    } else {
      console.log("Already in a call");
    }
  };

  const endCall = () => {
    console.log('Ending call...');

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    if (peerConnection.current) {
      peerConnection.current.close();
    }

    setIsCalling(false);
  };

  return (
    <div className="video-call">
      <video ref={localVideo} autoPlay muted />
      <video ref={remoteVideo} autoPlay />
      {!isCalling ? (
        <button onClick={startCall}>Start Call</button>
      ) : (
        <>
          <p>Call in progress...</p>
          <button onClick={endCall}>End Call</button>
        </>
      )}
    </div>
  );
};

export default VideoCall;
