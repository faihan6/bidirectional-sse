class DuplexEvents extends EventTarget{

    #eventSource = null;
    #sseURL = null;
    #httpURL = null;

    #userId = null;

    constructor(config){

        super();

        this.#sseURL = config.sseURL;
        this.#httpURL = config.httpURL;

        this.#eventSource = new EventSource(this.#sseURL);
        
        this.#eventSource.onmessage = (event) => this.#handleMessage(event)
    }

    #handleMessage(event){
        if(!this.#userId){
            try{
                const userId = event.data.split('->')[1];
                if(userId){
                    this.#userId = userId;
                    
                    const event = new Event('setupcomplete');
                    this.dispatchEvent(event)
                }
            }
            catch(e){}

            return;
        }

        const e = new Event('message');
        e.data = event.data;
        this.dispatchEvent(e);
    }

    send(message){

        if(typeof message != 'string'){
            throw new Error("INVALID_INPUT_TYPE")
        }

        if(!this.#userId){
            throw new Error("SETUP_INCOMPLETE")
        }

        const data = {
            userId: this.#userId,
            message
        }


        fetch(this.#httpURL, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

}