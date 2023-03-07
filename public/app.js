export const socket = io();
// prettier-ignore
import { messageInput, usernameInput, enterUsername, editUsername, sendMessage, appendMessage, displayConnectedUsers, usersListUl, enterUsernameButton, editUsernameButton, sendMessageButton} from './client-modules/utils.js';

// ---------------- SOCKETS HANDLING ---------------------- //
// send 'new connection' event to the server when someone connects
socket.emit('new connection');
// respond on 'new connection registered' event from server, with sent data
socket.on('new connection registered', data => {
  appendMessage(data.sender, data.message);
});
// notify all members on new user
socket.on('new user alert', data => {
  appendMessage(data.sender, `${data.message} has joined the chat!`);
});
// notify all members that user has modified his username
socket.on('modified username', data => {
  appendMessage(data.sender, data.message);
});
// update active users list
socket.on('update users list', data => {
  displayConnectedUsers(usersListUl, data);
});

// distribute chat message passed from server
socket.on('incoming message', data => {
  appendMessage(data.user, data.text);
});
// alert that user has disconnected from chat ---------------------- //
socket.on('user left alert', data => {
  appendMessage(data.sender, `${data.leftUser} has left the chat...`);
});
// ---------------- --------------- ---------------------- //

// listeners
enterUsernameButton.addEventListener('click', enterUsername);
editUsernameButton.addEventListener('click', editUsername);
sendMessageButton.addEventListener('click', sendMessage);
// focus username input on page load
addEventListener('load', () => {
  usernameInput.focus();
});
// send message with return key
addEventListener('keypress', e => {
  if (e.key !== 'Enter') return;

  if (messageInput === document.activeElement) {
    sendMessage();
  }
});
