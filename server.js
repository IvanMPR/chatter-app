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
  // NEW CONNECTION
  socket.on('new connection', () => {
    socket.emit('new connection registered', {
      sender: botName,
      id: socket.id,
      message: initialMessage,
    });
  });
  // USERNAME ADDED
  socket.on('username added', data => {
    const newUser = { username: data.newUsername, id: socket.id };
    users.push(newUser);
    //  notify all other chat members about new user arrival
    socket.broadcast.emit('new user alert', {
      sender: botName,
      id: socket.id,
      message: data.newUsername,
    });
    // send users list
    io.emit('update users list', users);
  });
  // USERNAME MODIFIED
  socket.on('username modified', data => {
    // extract old and new data passed from client and get index of user to be modified
    const oldUsername = data.oldUsername;
    const newUsername = data.newUsername;
    const userToModifyIndex = users.findIndex(user => user.id === socket.id);
    // modify username in users array
    users[userToModifyIndex].username = newUsername;
    // emit modification of username
    socket.broadcast.emit('modified username', {
      sender: botName,
      message: `User ${oldUsername} changed username to ${newUsername}...`,
    });
    // send modified list
    io.emit('update users list', users);
  });

  // SEND MESSAGE
  socket.on('new message', data => {
    // server forwards the message to all connected clients except the sender
    socket.broadcast.emit('incoming message', data);
  });
  // USER LEAVES
  socket.on('disconnect', () => {
    // locate user who disconnected by his index in users array
    const disconnectedUserIndex = users.findIndex(
      user => user.id === socket.id
    );

    if (disconnectedUserIndex !== -1) {
      // get disconnected user name
      const leftUser = users[disconnectedUserIndex].username;
      // delete disconnected user from users array
      users.splice(disconnectedUserIndex, 1);
      // emit that user has left the chat
      socket.broadcast.emit('user left alert', {
        sender: botName,
        leftUser,
      });
      // emit updated users array //
      io.emit('update users list', users);
    }
  });
});
// PORT
const PORT = 3000 || process.env.port;
server.listen(PORT);
