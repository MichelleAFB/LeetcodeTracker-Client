import { io } from 'socket.io-client';
const user=JSON.parse(sessionStorage.getItem("user"))
const URL = "http://localhost:3042";

export const socket = io.connect(URL);