const mqtt = require('mqtt')
const topic = 'expolab';
require('dotenv').config();
const io = require('socket.io')({
    cors: '*'
});

const host = process.env.MQTT_HOST
const port = process.env.MQTT_PORT
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    reconnectPeriod: 1000,
});

sendData = async (topic, message) => {
    io.emit(topic,message)
}

client.on('connect', () => {
    console.log('connected');
    client.subscribe([topic], () => {
        console.log('Subscribe to topic' , `${topic}`);
    });
});

client.on('message', async (topic, payload) =>{
   console.log('Received data' , topic, payload.toString());
   await sendData(topic,payload.toString())
});

io.on('connection', client => {
    console.log('Socket connected ', client.id);
});

io.listen(4000);




