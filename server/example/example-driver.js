const { EventSourceServer } = require('../duplex-events-server');

const server = new EventSourceServer({
    port: 3000
});

server.addEventListener('connection', (event) => {
    const client = event.client;

    console.log(client.userId, 'Connection established', event.client);

    

    client.addEventListener('message', (event) => {
        console.log(client.userId, 'Message received', event.data);

        client.send(`you said ${event.data}`)
    });
});