const socket = io('http://localhost:3040');
const client = feathers();
client.configure(feathers.socketio(socket))
client.configure(feathers.authentication())

export default client;
