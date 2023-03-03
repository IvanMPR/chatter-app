import { socket } from '../app.js';
export const usernameInput = document.querySelector('.chatter-ui-input');
export const messageInput = document.querySelector('.chatter-ui-textarea');
const enterUsernameButton = document.querySelector('.chatter-ui-icon');
const usernamePlaceholder = document.querySelector('.chatter-users-h2');
const messagesContainer = document.querySelector('.chatter-messages');

export function enterUsername() {
  const newUsername = usernameInput.value;
  if (
    (newUsername === '' && usernamePlaceholder.textContent === 'Username') ||
    usernamePlaceholder.textContent === ''
  ) {
    alert('Please type your username...');
    usernameInput.focus();
    return;
  }
  if (newUsername === '' && usernamePlaceholder.textContent !== 'Username') {
    const unchangedUsername = usernamePlaceholder.textContent;
    usernamePlaceholder.textContent = unchangedUsername;
    usernameInput.placeholder = unchangedUsername;
    disableInputAndFocusTextArea(unchangedUsername);
    return;
  }
  usernamePlaceholder.textContent = newUsername;
  disableInputAndFocusTextArea(newUsername);
}

function disableInputAndFocusTextArea(username) {
  usernamePlaceholder.placeholder = username;
  usernameInput.disabled = true;
  messageInput.focus();
  enterUsernameButton.style.pointerEvents = 'none';
}

function enableAndFocusInput() {
  usernameInput.disabled = false;
  usernameInput.value = '';
  usernameInput.placeholder = 'Edit your username';
  usernameInput.focus();
  enterUsernameButton.style.pointerEvents = 'initial';
}

export function editUsername() {
  console.log('hi');
  if (usernamePlaceholder.textContent === 'Username') {
    alert("You're trying to edit username that is not yet set !");
    return;
  }
  enableAndFocusInput();
}

function appendMessage(name, message) {
  const html = `
   <div class="chatter-message">
       <h3 class="chatter-message-name">${name}</h3>
       <p class="chatter-message-text">
          ${message}
       </p>
 </div>`;

  messagesContainer.insertAdjacentHTML('beforeend', html);
  // scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
export function sendMessage() {
  if (messageInput.value.trim() === '') {
    alert('Please enter your message...');
    messageInput.focus();
    return;
  }
  if (usernamePlaceholder.textContent === 'Username') {
    alert('Please enter your name before sending a message...');
  }
  if (
    usernamePlaceholder.textContent !== 'Username' &&
    usernameInput.placeholder === 'Edit your username'
  ) {
    alert('Please enter your name before sending a message...');
  }
  const name = usernamePlaceholder.textContent;
  const message = messageInput.value;

  appendMessage(name, message);

  //   clear and focus for next message
  messageInput.value = '';
  messageInput.focus();
}
