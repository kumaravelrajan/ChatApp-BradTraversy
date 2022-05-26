const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('div.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true});

const socket = io();

// Join chatroom
socket.emit('joinRoom', {username, room});

// Get room and users
socket.on('roomUsers', ({room, users})=>{
    outputRoom(room);
    outputUsers(users);
});

// Message from server.
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Listen for message submit in chat form.
chatForm.addEventListener('submit', evnt => {
    evnt.preventDefault();

    // Get message text.
    const msg = evnt.target.elements.msg.value;

    // Emit message to server.
    socket.emit('chatMessage', msg);

    // Clear input and focus
    evnt.target.elements.msg.value = '';
    evnt.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`

    // Insert message as child of div.chat-messages
    document.querySelector('div.chat-messages').appendChild(div);
}


function outputRoom(room){
    roomName.innerText = room;
}

function outputUsers(users){
    // const ul = document.querySelector('#users');
    // users.forEach(user => {
    //     const li = document.createElement('li');
    //     li.innerHTML = user.username;
    //     ul.appendChild(li);
    // });

    userList.innerHTML = `
        ${users.map(user=>`<li>${user.username}</li>`).join('')}
    `;
}