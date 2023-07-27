// helpers/ipcHelpers.js
import { useEffect } from 'react';

const useIpcListeners = (setMessages, setFormData, formData, setConnected) => {
  const { ipcRenderer } = window.require('electron');

  useEffect(() => {
    const handleRedisPacket = (event, message) => {
      const json = JSON.parse(message);
      setMessages((prevMessages) => [...prevMessages, json]);
    };

    const handleRedisConnectionStatus = (event, isConnected) => {
      setMessages([]);
      if (isConnected) {
        setFormData({ ...formData, host: '', port: '', username: '', password: '' });
      }
      setConnected(isConnected);
    };

    ipcRenderer.on('redis-packet', handleRedisPacket);
    ipcRenderer.on('redis-connection-status', handleRedisConnectionStatus);

    return () => {
      ipcRenderer.removeAllListeners('redis-packet', 'redis-connection-status');
    };
  }, [setMessages, formData, setConnected]);
}

export default useIpcListeners;
