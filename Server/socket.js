import express from 'express';
import cors from 'cors';
import { createServer } from 'http'
import { Server } from "socket.io";


const socket = express();
socket.use(cors()); // Add cors middleware
const server = createServer(); // Add this
const URLServer = 'http://localhost:8080'

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST' ,'PUT'],
  },
});



io.on('connection', (socket) => {
 
  socket.on('passenger_join', async (data) => {
    const { room, msg } = data;
    const communication = await fetch(`${URLServer}/communications/${msg}`)
    const result = await communication.json();
    io.to(room).emit('passenger_joined', result);
  });

  socket.on('join_room', (data) => {
    const { room } = data;
    socket.join(room);
  });

  socket.on('leave_room', (data) => {
    const { room } = data;
    socket.leave(room);
  })

  socket.on('confirm_travel', (data) => {
    const { room, msg } = data;
    io.in(room).emit('travel_confirmed', msg);
  });

  socket.on('reject_order', (data) => {
    const { room, orderId } = data;
    io.in(room).emit('reject_order', orderId);
  });

});

server.listen(3000, (err) => {
  if (err) console.error(err);
  console.log("Socket listening on PORT", 3000);
});

