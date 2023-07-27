const redisConnect = (ipcRenderer, formData) => {
  ipcRenderer.send('redis-connect', formData);
};

const redisDisconnect = (ipcRenderer) => {
  ipcRenderer.send('redis-disconnect');
};

const updateRedisChannel = (e, channelRef, ipcRenderer) => {
  const { value } = e.target;

  if (value !== channelRef.current) {
    if (channelRef.current) {
      ipcRenderer.send('redis-unsubscribe', channelRef.current);
    }

    channelRef.current = value;

    if (value) {
      ipcRenderer.send('redis-subscribe', value);
    }
  }
};

export { redisConnect, redisDisconnect, updateRedisChannel };