// socket.js
import { io } from "socket.io-client";

const socket = io('http://localhost:8080'); // backend address
export default socket;
