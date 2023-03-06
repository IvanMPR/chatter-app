export const socket = io();
// prettier-ignore
import { messageInput, usernameInput, enterUsername, editUsername, sendMessage, appendMessage, displayConnectedUsers, usersListUl } from './client-modules/utils.js';
const enterUsernameButton = document.querySelector('.chatter-ui-icon');
const editUsernameButton = document.querySelector('.chatter-users-edit');
const sendMessageButton = document.querySelector('.chatter-ui-btn');

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
  displayConnectedUsers(usersListUl, data.users);
});
// distribute chat message passed from server
socket.on('incoming message', data => {
  appendMessage(data.user, data.text);
});
// alert that user has disconnected from chat ---------------------- //
socket.on('user left alert', data => {
  console.log(data.users, ' from user left alert...');
  appendMessage(data.sender, `${data.leftUser} has left the chat...`);
  displayConnectedUsers(usersListUl, data.users);
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
