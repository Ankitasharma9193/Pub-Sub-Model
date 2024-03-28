const amqp = require("amqplib");
const config = require("./config");

//step 1 : Connect to the rabbitmq server
//step 2 : Create a new channel on that connection
//step 3 : Create the exchange
//step 4 : Publish the message to the exchange with a routing key

class Producer {
  channel;

  async createChannel() {
    // 1
    const connection = await amqp.connect(config.rabbitMQ.url);
    // console.log('~~~~~~~~~~~~~~~~~', connection)
    // 2
    this.channel = await connection.createChannel();
  }

  async publishMessage(routingKey, message) {
    if (!this.channel) {
      await this.createChannel();
    }

    const exchangeName = config.rabbitMQ.exchangeName;
    // console.log('~~~~~~~~~~~~~ channel', this.channel )
  // 3
    await this.channel.assertExchange(exchangeName, "direct");
  // log details which we want to send to end consumer
    const logDetails = {
      bindingKey: routingKey,
      message: message,
      dateTime: new Date(),
    };
    // 4 sending it to exchange we have created
    await this.channel.publish(
      exchangeName,
      routingKey,
      Buffer.from(JSON.stringify(logDetails))
    );

    console.log(
      `The new "${message}" log is sent to exchange ${exchangeName}`
    );
  }
}

module.exports = Producer;