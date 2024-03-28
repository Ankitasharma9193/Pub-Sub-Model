const amqp = require('amqplib');
const config = require('./congif');

async function consumeWarningAndErrors(){
    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    //create a exchange
    const exchangeName = config.rabbitMQ.exchangeName;

    await channel.assertExchange(exchangeName, "direct")
    
    //create a queue
    const queue = await channel.assertQueue("WarningsAndErrorsQueue");
    // bind a queue
    await channel.bindQueue(queue.queue, exchangeName, 'Warning');
    await channel.bindQueue(queue.queue, exchangeName, 'Error');

    // consume message from queue to microservice
    await channel.consume(queue.queue, (msg) => {
        const data = JSON.parse(msg.content);
        console.log(`Recieved msg:  ${data}`);

        channel.ack(msg); // if we delete it the msg will remain in queue
    })
}

consumeWarningAndErrors();