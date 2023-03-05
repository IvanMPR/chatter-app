const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
// --------------------------------------------- //
const app = express();
const server = http.createServer(app);
const io = socketio(server);
// --------------------------------------------- //
// prettier-ignore
const { botName, initialMessage, users } = require('./public/server-modules/server-utils');
// --------------------------------------------- //

// set static folder
app.use(express.static(path.join(__dirname, 'public')));
// ----------- SOCKETS HANDLING ------------------------------- //
io.on('connection', socket => {
  // new connection to server
  socket.on('new connection', () => {
    socket.emit('new connection registered', {
      sender: botName,
      id: socket.id,
      message: initialMessage,
    });
  });
  // user from new connection added his username
  socket.on('username added', data => {
    console.log(data);
    const newUser = { username: data.newUsername, id: socket.id };
    users.push(newUser);
    //  notify all other chat members about new user arrival
    socket.broadcast.emit('new user alert', {
      sender: botName,
      id: socket.id,
      message: data.newUsername,
    });
  });
  // on new message sent
  socket.on('new message', data => {
    // server forwards the message to all connected clients except the sender
    socket.broadcast.emit('incoming message', data);
  });
  // when user leaves chat
  socket.on('disconnect', () => {
    console.log(socket.id, users);
    const disconnectedUser = users.find(user => user.id === socket.id);
    console.log(disconnectedUser, 'from diss...');
    if (disconnectedUser) {
      socket.broadcast.emit('user left alert', {
        sender: botName,
        leftUser: disconnectedUser.username,
      });
    }
  });
});
// port
const PORT = 3000 || process.env.port;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
