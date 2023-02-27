const socket = new WebSocket("ws://localhost:9000");

self.addEventListener("install", () => {
  self.skipWaiting()
  socket.onopen = () => {
    console.log('Подключение установлено');
    socket.send(JSON.stringify({ event: "connection", message: "Хей" }))
  }
  socket.onmessage = async (event) => {
    const { message } = JSON.parse(event.data)
    console.log('Получено сообщение', message);
    const clients = await self.clients.matchAll();
    console.log('clients', clients);
    if (clients[0]) {
      const client = clients[0];
      client.postMessage(JSON.parse(event.data));
    }
  }
  socket.onerror = () => {
    console.log('Произошла ошибка');
  }
  socket.onclose = () => {
    console.log('Подключение закрыто');
  }

  socket.send(JSON.stringify({
    event: 'message', 
    message: "Сообщение"
  }))
})

self.addEventListener('activate', evt=> {
  console.log('service worker has been activated');
});