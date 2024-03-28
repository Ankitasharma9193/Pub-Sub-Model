const amqp = require('amqplib');
const config = require('./congif');

// story after exchange 
// connect with rabbit mq server , create a channel, create exchange(same as publisher)
// step 5: create a queue
// step 6: bind the queue with exchange
// step 7: consume message from the queue

async function consumeMessages(){

    const connection = await amqp.connect(config.rabbitMQ.url);
    const channel = await connection.createChannel();

    const exchangeName = config.rabbitMQ.exchangeName

    await channel.assertExchange(exchangeName, "direct"); // exchange name and the type of exchange: direct
    
    // Create a Queue to receive logs from the Exchange
    const queue = await channel.assertQueue("InfoQueue"); // Infoqueue: name of queue

    // Binding queue with exchange
    // since this is direct type exchange, the 3rd argument is simple routing key
    await channel.bindQueue(queue.queue, exchangeName,'Info');  
    //! IMP 3rd argument(binding key/ routingkey/ logTYpe all are same) should be same as what you've sent in the api params

    // consume message to the microservice, last arrow
    channel.consume(queue.queue, (msg)=>{
        const data = JSON.parse(msg.content);
         console.log(`Received Message : ${msg.content}`);
         channel.ack(msg); // telling channel that message is been received, 
         // so that it can be safely deleted from the queue
    });
}
consumeMessages();