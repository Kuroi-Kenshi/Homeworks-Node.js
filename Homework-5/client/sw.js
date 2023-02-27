// importScripts('./socket.io.js')
const socket = new WebSocket("ws://localhost:9000");

self.addEventListener("install", () => {
  socket.onopen = () => {
    console.log('Подключение установлено');
    socket.send(JSON.stringify({ event: "connection", message: "Хей" }))
  }
  socket.onmessage = async (event) => {
    const { message } = JSON.parse(event.data)
    console.log('Получено сообщение', message);
    const clients = await self.clients.matchAll();
    console.log('clients', clients);
    const client = clients[0];
    client.postMessage(JSON.parse(event.data));
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

self.addEventListener("active", (event) => {
  // const socket = io("localhost:9000");

  // socket.on("connect", () => {
  //   console.log('Подключение установлено');
  //   socket.emit('message', 'MEssage from client')
  // });
  
  // socket.on("message", (message) => {
  //   console.log('Сообщение', message);
  // });

  // socket.onopen = () => {
  //   console.log('Подключение установлено');
  //   socket.send(JSON.stringify({ event: "connection", message: "Хей" }))
  // }
  // socket.onmessage = (event) => {
  //   const message = JSON.parse(event.data)
  //   console.log('Получено сообщение', message);
  //   event.source.postMessage(message);
  // }
  // socket.onerror = () => {
  //   console.log('Произошла ошибка');
  // }
  // socket.onclose = () => {
  //   console.log('Подключение закрыто');
  // }

  // socket.send(JSON.stringify({
  //   event: 'message', 
  //   message: "Сообщение"
  // }))
})

// self.addEventListener('fetch', (event) => {
//   if (event.request.url === 'ws://localhost:9000') {
//     // send a message to the server using the WebSocket connection
//     socket.send('Hello server!');

//     // intercept the response and modify it as needed
//     // event.respondWith(new Response('Hello client!'));
//   }
// });