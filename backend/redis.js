const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();

const redisClient = () => {
    return redis.createClient();
}

const client = redisClient();

client.on('connect', () => {
    console.log('Redis client connected');
});

client.on('error', (err) => {
    console.log(`Something went wrong ${err}`);
});

client.on('end', () => {
    console.log('Redis client disconnected');
});

client.on('SIGQUIT', () => { // SIGQUIT is the signal sent to a process by the operating system when the user requests that the process be terminated.
    client.quit();
});

module.exports = client;