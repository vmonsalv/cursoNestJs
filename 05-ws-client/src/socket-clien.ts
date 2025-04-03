import { Manager, Socket } from "socket.io-client";

export const connectToServer = () => {
  const manager = new Manager("http://localhost:3000/socket.io/socket.io.js");

  const socket = manager.socket("/");

  // console.log('socket', socket);

  addListener(socket);
};

const addListener = (socket: Socket) => {
  const serverStatusLabel = document.querySelector("#server-status") as Element;
  const clientesUl = document.querySelector("#clients-ul") as Element;

  const messageForm = document.querySelector<HTMLFormElement>("#message-form")!;
  const messageInput =
    document.querySelector<HTMLInputElement>("#message-input")!;

  socket.on("connect", () => {
    serverStatusLabel.innerHTML = "connected";
  });

  socket.on("disconnect", () => {
    serverStatusLabel.innerHTML = "disconnected";
  });

  socket.on("clients-updated", (clients: string[]) => {
    let clienstHtml = "";
    clients.forEach((clientId) => {
      clienstHtml += `<li>${clientId}</li>`;
    });
    clientesUl.innerHTML = clienstHtml;
  });

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (messageInput.value.trim().length <= 0) return;

    socket.emit("message-form-client", {
      id: `YO!!`,
      message: messageInput.value,
    });

    messageInput.value = '';
  });
};
