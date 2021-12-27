// 여기에 등장하는 socket은 '브라우저 to 서버'의 연결을 의미
const socket = new WebSocket(`ws://${window.location.host}`);

function handleOpen() {
  console.log("Connected to Server ✅");
}

function handleMessage(message) {
  console.log("New Message:", message.data);
}

function handleClose() {
  console.log("Disconnected to Server ⛔");
}

socket.addEventListener("open", handleOpen); // 소켓이 open 되었을 때 : 웹소켓 서버와 연결이 되었을 때
socket.addEventListener("message", handleMessage); // 소켓을 통해 메세지를 수신 했을 때
socket.addEventListener("close", handleClose); // 소켓 연결이 끊어졌을 때

setTimeout(() => {
  socket.send("hello from the browser!")
}, 5000) // 5초 뒤에 socket을 통해 메세지 송신