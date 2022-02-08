const socket = io("http://localhost:3000");
const messageContainer = document.getElementById("message-container");
const roomContainer = document.getElementById("room-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const typingUserText = document.getElementById("typing-user");

const appendMessage = (message) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
};

const disconnectRoom = () => {
  socket.emit("disconnect-room", {
    user,
    roomId,
  });

  window.location.href = "/home";
};

socket.emit("join-room", {
  user,
  roomId,
});

appendMessage(`You joined`);

socket.on("room-full", (destination) => {
  window.location.href = destination;
});

socket.on("user-connected", (data) => {
  const { name } = data;
  appendMessage(`${name} joined`);
});

socket.on("user-disconnected", (data) => {
  const { name } = data;
  appendMessage(`${name} leave the room`);
});

socket.on("room-user", (data) => {
  const { totalUser } = data;

  if (totalUser === 2) {
    $("#message-input").prop("disabled", false);
    $("#send-button").prop("disabled", false);
  } else {
    $("#message-input").prop("disabled", true);
    $("#send-button").prop("disabled", true);
  }
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`);
  socket.emit("send-chat-message", {
    roomId,
    message,
    user,
  });
  messageInput.value = "";
});

socket.on("chat-message", (data) => {
  const { message, user } = data;
  appendMessage(`${user.firstname}: ${message}`);
});

messageForm.addEventListener("keydown", (e) => {
  if (e.code !== "Enter") {
    socket.emit("user-is-typing", {
      roomId,
      user,
    });
  }
});

socket.on("user-is-typing", (data) => {
  const { user } = data;
  typingUserText.innerHTML = `${user.name} is typing...`;
  setTimeout(() => {
    typingUserText.innerHTML = "";
  }, 2000);
});
