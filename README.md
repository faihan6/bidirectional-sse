# Bidirectional Server-Sent Events (SSE)

A Node.js implementation of bidirectional messaging server that enables real-time communication between server and clients without using WebSockets. It uses,

- SSE for server to client comunication
- HTTP for client to server communication.

## Overview

This project provides a robust implementation of Server-Sent Events with bidirectional communication capabilities. It consists of two main components:

- **Server**: A Node.js server that listens for SSE connections and HTTP connections.
- **Client**: A JavaScript client library for establishing and managing SSE connections and HTTP requests

## Features

- Real-time server-to-client communication using SSE
- Bidirectional message support
- Unique client identification
- Event-based architecture


## Installation

1. Clone the repository:
```bash
git clone https://github.com/faihan6/bidirectional-sse.git
cd bidirectional-sse
```

2. Install dependencies:

Here is the fun part, there are no dependencies!

## Usage

### Server Setup

```javascript
const { EventSourceServer } = require('./server/duplex-events-server');

const server = new EventSourceServer({
    port: 3000
});

server.addEventListener('connection', (event) => {
    console.log(`New client connected: ${event.client.userId}`);
});

server.addEventListener('message', (event) => {
    console.log(`Message from ${event.client.userId}: ${event.data}`);
});
```

### Client Setup

Unfortunately, the client API is provided only in the form of globals. Support for CommonJS exports and ESM exports will soon be added.

```javascript
const client = new EventSourceClient('http://localhost:3000');

client.addEventListener('message', (event) => {
    console.log('Received message:', event.data);
});

// Send message to server
client.sendMessage('Hello Server!');
```

## API Reference

### Server

#### class `EventSourceServer`

- `constructor(config: object)`: Creates a new SSE server instance. The properties of `config` are defined below.
  - `port: string`: Port number for the server

##### Events

- `connection`: Fired when a new client connects

#### class `EventSourceClient`
Represents a client connected to EventSourceServer. Constructor is not exposed.

##### Methods
- `send(message: string)`: Sends a new message.

##### Events

- `message`: Fired when a message is received by this client


### Client

#### class `DuplexEvents`

##### Methods
- `send(message: string)`: Sends a new message.

##### Events
- `setupcomplete`: thrown when setup is complete. Messages can be sent only after this event is thrown.
- `message`: thrown when a message has arrived.
    - `event.data`: denotes the actual message

## Examples

Example files are provided inside `./client/example` and `./server/example` directories for reference.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
