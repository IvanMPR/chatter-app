import { socket } from '../app.js';
const usernamePlaceholder = document.querySelector('.chatter-users-h2');
const messagesContainer = document.querySelector('.chatter-messages');

export const usernameInput = document.querySelector('.chatter-ui-input');
export const messageInput = document.querySelector('.chatter-ui-textarea');
export const usersListUl = document.querySelector('.chatter-users-ul');

export const enterUsernameButton = document.querySelector('.chatter-ui-icon');
export const editUsernameButton = document.querySelector('.chatter-users-edit');
export const sendMessageButton = document.querySelector('.chatter-ui-btn');
// ---------------------------------------------------------------//
const botNameClient = 'Admin';
const helperObject = {
  isUsernameModified: false,
  oldUsername: '',
};

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
  // notify server about new username or edited username
  helperObject.isUsernameModified
    ? socket.emit('username modified', {
        newUsername,
        oldUsername: helperObject.oldUsername,
      })
    : socket.emit('username added', { newUsername });

  // display greeting
  greetOnAddedUsername(newUsername, helperObject.isUsernameModified);
  // reset modified flag and oldUsername value
  helperObject.isUsernameModified = false;
  helperObject.oldUsername = '';
}
// helper fn
function disableInputAndFocusTextArea(username) {
  usernamePlaceholder.placeholder = username;
  usernameInput.disabled = true;
  messageInput.focus();
  enterUsernameButton.style.pointerEvents = 'none';
}
// helper fn
function enableAndFocusInput() {
  usernameInput.disabled = false;
  usernameInput.value = '';
  usernameInput.placeholder = 'Edit your username';
  usernameInput.focus();
  enterUsernameButton.style.pointerEvents = 'initial';
}

export function editUsername() {
  if (usernamePlaceholder.textContent === 'Username') {
    alert("You're trying to edit username that is not yet set !");
    return;
  }
  // Add true flag to helper helperObject.isUsernameModified
  // Store value of old username in helperObject.oldUsername
  helperObject.isUsernameModified = true;
  helperObject.oldUsername = usernamePlaceholder.textContent;

  enableAndFocusInput();
}
// main function for appending/displaying messages in chat area
export function appendMessage(name, message, rightAligned = false) {
  const html = `
   <div class="chatter-message ${rightAligned ? 'aligned-right-message' : ''}">
       <h3 class="chatter-message-name ${
         rightAligned ? 'aligned-right-name' : ''
       }">${name}</h3>
       <p class="chatter-message-text ${
         rightAligned ? 'aligned-right-text' : ''
       }">
          ${message}
       </p>
   </div>`;

  messagesContainer.insertAdjacentHTML('beforeend', html);
  // scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
// validating input and sending message
export function sendMessage() {
  if (messageInput.value.trim() === '') {
    alert('Please enter your message...');
    messageInput.focus();
    return;
  }
  if (usernamePlaceholder.textContent === 'Username') {
    alert('Please enter your name before sending a message...');
    return;
  }
  if (
    usernamePlaceholder.textContent !== 'Username' &&
    usernameInput.placeholder === 'Edit your username'
  ) {
    alert('Please enter your name before sending a message...');
  }
  const name = usernamePlaceholder.textContent;
  const message = messageInput.value;

  appendMessage(name, message, true);
  // transfer message to the server
  socket.emit('new message', {
    user: name,
    text: message,
  });
  //   clear and focus for next message
  messageInput.value = '';
  messageInput.focus();
}
// helper function to greet user from Admin on adding username
function greetOnAddedUsername(username, boolean) {
  const name = botNameClient;
  const message = boolean
    ? `You've successfully edited your username to ${username}`
    : `${username}, you're all set! Enjoy your Chatter...`;

  appendMessage(name, message);
}

export function displayConnectedUsers(parentEl, usersList) {
  // clear UL from old users before updating list
  parentEl.innerHTML = '';

  usersList.forEach(user => {
    const html = `<li class="chatter-user-li">${user.username}</li>`;
    parentEl.insertAdjacentHTML('beforeend', html);
  });
}
