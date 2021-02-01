import store from '../store';
const io = require('socket.io-client');

const getSocketInstance = (roomId, authToken) => {
  authToken = authToken || store.state.user.authToken;

  const socket = io(process.env.VUE_APP_SOCKET_URL, {
    reconnectionDelayMax: 10000,
    query: {
      token: authToken,
      roomId: roomId
    },
    transports: ["websocket"]
  });

  return socket;
}

export default getSocketInstance;