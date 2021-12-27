import express from "express";
import http from "http";
import WebSocket from 'ws';
const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.render("home"));
const handleListen = () => console.log(`Listening on http://localhost:3000`);

// 동일한 리소스에 대해 두 개의 프로토콜이 모두 동작하도록 설정
const server = http.createServer(app); // http 서버 생성
const wss = new WebSocket.Server({ server }); // 생성된 http 서버 위에 WebSocket 서버를 올리는 코드

// 소켓 저장 공간
const sockets = [];

function onSocketClose() {
  console.log("Disconnected from the Browser ⛔");
}

function onSocketMessage(msg) {
  const decodedMessage = Buffer.from(msg, "base64").toString("utf-8");
  // 프론트에서 보낸 JSON String을 Parsing 하는 작업
  const message = JSON.parse(decodedMessage);
  switch(message.type) {

    case "new_message":
      sockets.forEach(aSocket => aSocket.send(`${this.nickname}: ${message.payload}`));
      break

    case "nickname":
      this["nickname"] = message.payload;
      break
  }
}

// socket은 웹소켓 서버에 연결된 어떤 사람을 의미 : 연결된 '특정' 브라우저와의 Contact 라인
// 여기에 등장하는 socket은 '서버 to 브라우저'의 연결을 의미
// wss.on("connection") 은 서버 단위의 이벤트 리스너 역할
// 웹소켓 서버에 connection 이벤트가 발생하면 특정 브라우저와의 socket이 생성이 되고, 해당 소켓에 대한 처리들이 진행된다.
wss.on("connection", (socket) => {
  console.log(socket);
  sockets.push(socket);
  socket["nickname"] = "Anonymous";
  console.log("Connected to Browser ✅");
  socket.on("close", onSocketClose); // 해당 소켓이 종료되었을 때
  socket.on("message", onSocketMessage); // 해당 소켓을 통해 메세지를 수신했을 때
});

server.listen(3000, handleListen); // 3000번 포트를 통해, http 서버, WS 서버를 모두 동작시킬 수 있다.