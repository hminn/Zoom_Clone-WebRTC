const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");
const showNick = document.querySelector("#showNick");

// 여기에 등장하는 socket은 '브라우저 to 서버'의 연결을 의미
const socket = new WebSocket(`ws://${window.location.host}`);

/*
브라우저에서 소켓을 통해 여러 정보가 담긴 JSON 형태의 데이터를 보낼 때,
자바스크립트 객체 형태로 보낼 수 없다. => 웹소켓 서버가 자바스크립트 기반이 아닐 수 있기 때문
따라서, 스트링 형태로 데이터를 전달해야한다. (소켓을 통해 백엔드 서버로)
JSON.stringify 메서드를 이용하여 객체를 JSON String 형태로 변환하여 보내준다.
백엔드 서버에서는 JSON String을 Parsing 하여 프론트에서 의도한 데이터 형태로 다시 변환하는 작업이 필요하다.
*/
function makeMessage(type, payload) {
  const msg = {type, payload};
  return JSON.stringify(msg);
}

function handleOpen() {
  console.log("Connected to Server ✅");
}

function handleMessage(message) {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
}

function handleClose() {
  console.log("Disconnected to Server ⛔");
}

socket.addEventListener("open", handleOpen); // 소켓이 open 되었을 때 : 웹소켓 서버와 연결이 되었을 때
socket.addEventListener("message", handleMessage); // 소켓을 통해 메세지를 수신 했을 때
socket.addEventListener("close", handleClose); // 소켓 연결이 끊어졌을 때

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value));
  input.value = "";
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
  showNick.innerText = input.value;
  input.value = "";
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit)