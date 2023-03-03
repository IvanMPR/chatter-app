export const socket = io();
// prettier-ignore
import { messageInput, usernameInput, enterUsername, editUsername, sendMessage } from './client-modules/utils.js';
const enterUsernameButton = document.querySelector('.chatter-ui-icon');
const editUsernameButton = document.querySelector('.chatter-users-edit');
const sendMessageButton = document.querySelector('.chatter-ui-btn');

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
