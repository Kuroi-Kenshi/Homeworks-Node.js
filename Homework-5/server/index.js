import { WebSocketServer } from 'ws';

try {
  const cities = [
    'Москвы',
    'Стамбула',
    "Рима",
    "Венеции",
    "Парижа",
    "Амстердама",
    "Праги",
    "Кейптауна",
    "Сиднея",
    "Токио",
    "Сеула",
  ]
  const wsServer = new WebSocketServer({ port: 9000 });

  const broadcastMessage = (message) => {
    wsServer.clients.forEach(client => {
      client.send(JSON.stringify(message))
    });
  }

  wsServer.on('connection', (ws) => {
    ws.on('message', (message) => {
      message = JSON.parse(message);

      switch (message.event) {
        case 'message':
          broadcastMessage(message)
          break;
        case 'connection':
          broadcastMessage(message)
          break;
      
        default:
          break;
      }
    })
  })

  setInterval(() => {
    const city = cities[Math.floor(Math.random() * cities.length)]
    broadcastMessage({ event: 'message', message: `Привет из ${city}`})
  }, 30000)
} catch (error) {
  console.log(error);
}