import { user } from "../utils/user.js";
import { renewMsg } from "./send.js";
const socket = io("ws://175.178.193.182:8080/chat");

socket.on("connect", () => {
  socket.emit("online", user.userId);
  socket.on("receive-message", (res) => {
    renewMsg(res.message);
  });
});
function sendMessage(userId, receiverId, message) {
  userId = String(userId);
  receiverId = String(receiverId);
  socket.emit("send-message", { userId, receiverId, message });
}

export { sendMessage };
