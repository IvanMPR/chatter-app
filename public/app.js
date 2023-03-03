const socket = io();
const usernameInput = document.querySelector('.chatter-ui-input');
const messageInput = document.querySelector('.chatter-ui-textarea');
const enterUsernameButton = document.querySelector('.chatter-ui-icon');
const editUsernameButton = document.querySelector('.chatter-users-edit');
const usernamePlaceholder = document.querySelector('.chatter-users-h2');
const messagesContainer = document.querySelector('.chatter-messages');
const sendMessageButton = document.querySelector('.chatter-ui-btn');
// focus username input on page load
usernameInput.focus();

function enterUsername() {
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
    disableInputAndFocusTextArea(unchangedUsername);
    return;
  }
  usernamePlaceholder.textContent = newUsername;
  disableInputAndFocusTextArea(newUsername);
}
// helper fn
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

function editUsername() {
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
function sendMessage() {
  if (messageInput.value === '') {
    alert('Please enter your message...');
    messageInput.focus();
    return;
  }
  const name = usernamePlaceholder.textContent;
  const message = messageInput.value;

  appendMessage(name, message);

  //   clear and focus for next message
  messageInput.value = '';
  messageInput.focus();
}
enterUsernameButton.addEventListener('click', enterUsername);
editUsernameButton.addEventListener('click', editUsername);
sendMessageButton.addEventListener('click', sendMessage);

addEventListener('keypress', e => {
  if (e.key !== 'Enter') return;
  if (usernameInput === document.activeElement) {
    enterUsername();
  }
  if (messageInput === document.activeElement) {
    sendMessage();
  }
});
