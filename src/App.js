import React, { useState } from 'react';
import styles from './App.module.css';

import Highlight from 'react-highlight'
import 'highlight.js/styles/obsidian.css'; // Import the CSS for the default highlight.js style
import 'highlight.js/lib/languages/json'; // Import the JSON syntax highlighting for highlight.js
import 'highlight.js/lib/languages/javascript'; // Import the JSON syntax highlighting for highlight.js

const { ipcRenderer } = window.require('electron');

function App() {
  const [isConnected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({
    host: '',
    port: '',
    username: '',
    password: ''
  });

  const channelRef = React.useRef('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleConnect = () => ipcRenderer.send('redis-connect', formData);
  const handleDisconnect = () => ipcRenderer.send('redis-disconnect');
  const handleChannelChange = (e) => {
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

  React.useEffect(() => {
    ipcRenderer.on('redis-packet', (event, message) => { // used to forward packets from current channel
      const json = JSON.parse(message);
      setMessages((prevMessages) => [...prevMessages, json]);
    });

    ipcRenderer.on('redis-connection-status', (event, isConnected) => { // used to determine if the client is connected or not
      setMessages([]) // clear messages when the client connects or disconnects

      if (isConnected) {
        setFormData({ ...formData, host: '', port: '', username: '', password: '' });
      }

      setConnected(isConnected);
    });

    return () => {
      ipcRenderer.removeAllListeners( // clean up the event listeners when the component unmounts
        'redis-packet',
        'redis-connection-status'
      );
    };
  }, []);

  return (
    <div className={styles.App}>
      <nav className={styles.navBar}>
        <div className={styles.title}>Lettuce v0.1.0</div>
        <div className={styles.buttons}>
          <button className={styles.button + " " + styles.connectButton} onClick={() => isConnected ? handleDisconnect() : handleConnect()}>
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>

          {isConnected && (
            <>
              <button onClick={() => setMessages([])} className={styles.button}>Clear</button>
              <input type="text" name="channel" placeholder="channel" onChange={handleChannelChange} className={styles.button} />
            </>
          )}
        </div>
      </nav>

      <div className={styles.container}>
        <form className={styles.credentials}>
          <input
            type="text"
            name="host"
            placeholder="host"
            value={formData.host}
            onChange={handleChange}
            disabled={isConnected}
          />
          <input
            type="text"
            name="port"
            placeholder="port"
            value={formData.port}
            onChange={handleChange}
            disabled={isConnected}
          />
          <input
            type="text"
            name="username"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
            disabled={isConnected}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isConnected}
          />
        </form>

        <div className={styles.codeContainer}>
          <div className={styles.code}>
            <Highlight className={`${styles.codeContent} json`}>
              {messages.length > 0 ? JSON.stringify(messages, null, 2) : (isConnected ? 'Waiting for packets...' : 'Connect to start receiving packets')}
            </Highlight>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
