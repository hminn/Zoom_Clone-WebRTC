const socket = io();
const nickname = document.getElementById("nickname");
const welcome = document.getElementById("welcome");
const openRooms = document.getElementById("open_rooms");
const roomNameForm = welcome.querySelector("form");
const room = document.getElementById("room");
const headerNickname = document.getElementById("header-nick");
const Nicknameform = nickname.querySelector("#name");
const roomExit = document. getElementById("exit");
const exitBtn = roomExit.querySelector("button");

roomExit.hidden = true;
room.hidden = true;
let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = nickname.querySelector("#name input");
  headerNickname.innerText = ` ${input.value}`;
  socket.emit("nickname", input.value);
  input.value = "";
}

function updateRoomName(count) {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${count})`;
}

function showRoom(count) {
  welcome.hidden = true;
  room.hidden = false;
  roomExit.hidden = false;
  updateRoomName(count);
  const msgform = room.querySelector("#msg");
  msgform.addEventListener("submit", handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = roomNameForm.querySelector("input");
  roomName = input.value;
  socket.emit("enter_room", input.value, showRoom);
  input.value = "";
}

function handleExitBtnClick(event) {
  event.preventDefault();
  const msgList = room.querySelector("ul");
  welcome.hidden = false;
  room.hidden = true;
  roomExit.hidden = true;
  msgList.innerHTML = "";
  socket.emit("exit_room", roomName);
  roomName = "";
}

Nicknameform.addEventListener("submit", handleNicknameSubmit);
roomNameForm.addEventListener("submit", handleRoomSubmit)
exitBtn.addEventListener("click", handleExitBtnClick)

socket.on("welcome", (user, newCount) => {
  updateRoomName(newCount)
  addMessage(`${user} joined!`);
})

socket.on("bye", (leftUser, newCount) => {
  updateRoomName(newCount)
  addMessage(`${leftUser} left..!`);
})

socket.on("new_message", (msg) => {
	addMessage(msg);
});

socket.on("room_change", (rooms) => {
  const roomList = openRooms.querySelector("ul");
  roomList.innerHTML = "";
  if(rooms.length === 0) {
    return ;
  }
  rooms.forEach(room => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.appendChild(li);
  })
});