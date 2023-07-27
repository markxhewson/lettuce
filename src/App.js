import React, { useState, useRef } from 'react';
import styles from './App.module.css';

import useIpcListeners from './helpers/ipcHelpers';
import { handleRedisConnect, handleRedisDisconnect, handleRedisChannelChange } from './helpers/handleRedisActions';
import handleCredentialsUpdate from './helpers/handleCredentialsUpdate';

import Highlight from 'react-highlight'
import 'highlight.js/styles/obsidian.css'; // Import the CSS for the default highlight.js style
import 'highlight.js/lib/languages/json'; // Import the JSON syntax highlighting for highlight.js

const { ipcRenderer } = window.require('electron');

function App() {
  const [isConnected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [formData, setFormData] = useState({ host: '', port: '', username: '', password: '' });

  const channelRef = useRef('');

  useIpcListeners(setMessages, setFormData, formData, setConnected); // Use the helper function

  return (
    <div className={styles.App}>
      <nav className={styles.navBar}>
        <div className={styles.title}>Lettuce v0.1.0</div>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={() => isConnected ? handleRedisDisconnect(ipcRenderer) : handleRedisConnect(ipcRenderer, formData)}>
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>

          {isConnected && (
            <>
              <button onClick={() => setMessages([])} className={styles.button}>Clear</button>
              <input type="text" name="channel" placeholder="channel" onChange={(e) => handleRedisChannelChange(e, channelRef, ipcRenderer)} className={styles.button} />
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
            onChange={(e) => handleCredentialsUpdate(e, setFormData)}
            disabled={isConnected}
          />
          <input
            type="text"
            name="port"
            placeholder="port"
            value={formData.port}
            onChange={(e) => handleCredentialsUpdate(e, setFormData)}
            disabled={isConnected}
          />
          <input
            type="text"
            name="username"
            placeholder="username"
            value={formData.username}
            onChange={(e) => handleCredentialsUpdate(e, setFormData)}
            disabled={isConnected}
          />
          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={(e) => handleCredentialsUpdate(e, setFormData)}
            disabled={isConnected}
          />
        </form>

        <div className={styles.codeContainer}>
          <Highlight className={`${styles.codeContent} json`}>
            {messages.length > 0 ? JSON.stringify(messages, null, 2) : (isConnected ? 'Waiting for packets...' : 'Connect to start receiving packets')}
          </Highlight>
        </div>
      </div>
    </div>
  );
}

export default App;
