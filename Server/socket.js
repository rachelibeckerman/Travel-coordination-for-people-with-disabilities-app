import express from 'express';
import cors from 'cors';
import { createServer } from 'http'
import { Server } from "socket.io";


const socket = express();
socket.use(cors()); // Add cors middleware
const server = createServer(); // Add this
const URLServer = 'http://localhost:8080'
// Add this
// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
  cors: {
    // origin: 'http://localhost:3000',
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST' ,'PUT'],
  },
});

// Add this
// Listen for when the client connects via socket.io-client

io.on('connection', (socket) => {
  console.log("connection ")
  socket.on('passenger_join', async (data) => {
    console.log("start socket passenger_join ", data)
    const { room, msg } = data;
    const communication = await fetch(`${URLServer}/communications/${msg}`)
    const result = await communication.json();
    console.log("result", result)
    io.to(room).emit('passenger_joined', result);
  });

  socket.on('join_room', (data) => {
    console.log("start socket join_room ", data)
    const { room } = data;
    socket.join(room);
    console.log("end socket join_room ")


  });

  socket.on('leave_room', (data) => {
    const { room } = data;
    socket.leave(room);
  })

  socket.on('confirm_travel', (data) => {
    console.log("start socket confirm_travel", data)
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

