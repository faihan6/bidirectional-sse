const http = require('http');

class EventSourceClient extends EventTarget {
    #responseObj = null;
    #userId = Math.random().toString(36).substring(2, 15);

    constructor(res) {
        super();

        this.#responseObj = res;
    }

    get userId(){
        return this.#userId
    }

    send(data) {
        this.#responseObj.write(`data: ${data}\n\n`);
    }
}

class EventSourceServer extends EventTarget {

    #clients = null;
    #server = null;

    constructor(config) {
        super();

        this.#clients = {};
        this.#server = http.createServer((req, res) => this.#handleConnection(req, res));
        this.#server.listen(config.port);
        
    }

    #initiateSSEUser(req, res) {
        
        req.on('close', () => {
            delete this.#clients[userId];
        });

        const client = new EventSourceClient(res);
        this.#clients[client.userId] = client;

        const event = new Event('connection');
        event.client = client;
        this.dispatchEvent(event);

        return client.userId;
    }

    async #handleMessage(req) {

        let bodyPromise;

        if(req.method === 'POST') {
            bodyPromise = this.#getBody(req);
        }

        const data = JSON.parse(await bodyPromise);
        const userId = data.userId;        

        const client = this.#clients[userId];
        if(client) {
            const event = new Event('message');
            event.client = client;
            event.data = data.message;
            client.dispatchEvent(event);

            return true;

        }

        return false;
    }

    async #handleConnection(req, res) {
        if (req.url === '/sse') {
            try{
                const userId = this.#initiateSSEUser(req, res);
                if(userId) {
                    res.writeHead(200, {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive'
                    });
                    res.write(`data: userId->${userId}\n\n`);
                }
                else {
                    res.writeHead(400, {
                        'Access-Control-Allow-Origin': '*',
                    });
                }
            } catch(error) {
                console.error('---Error initiating SSE', error);
                res.writeHead(500, {
                    'Access-Control-Allow-Origin': '*',
                });
            }

            
            
        } else {
            try{
                const status = await this.#handleMessage(req);
                const statusCode = status ? 200 : 404;
                res.writeHead(statusCode, {
                    'Access-Control-Allow-Origin': '*',
                });
                res.end();
            } catch(error) {
                console.error('---Error handling message', error);
                res.writeHead(500, {
                    'Access-Control-Allow-Origin': '*',
                });
                res.end();
            }
        }
        
    }

    #getBody(req) {
        return new Promise(resolve => {
            let data = '';

            req.on('data', (chunk) => {
                data += chunk;
            });

            req.on('end', () => {
                resolve(data);
            });
        })
    }
}

module.exports = {
    EventSourceServer
}