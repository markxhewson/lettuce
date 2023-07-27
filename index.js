const { app, BrowserWindow, ipcMain } = require('electron');
const Redis = require('ioredis');

let window;
let client;

app.on('ready', () => {
  window = new BrowserWindow({
    autoHideMenuBar: true,
    width: 800,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    resizable: false
  });

  const isDev = process.env.NODE_ENV == 'development';

  console.log("isDev: ", isDev);
  console.log(process.env.NODE_ENV)

  if (isDev) {
    window.loadURL('http://localhost:3000');
    window.webContents.openDevTools({ mode: 'detach' });
  } else {
    window.loadURL(`${app.getAppPath()}\\build\\index.html`);
  }

  ipcMain.on('redis-connect', (event, formData) => {
    if (client?.connected) client.quit();

    const { host, port, username, password } = formData;

    // Create a Redis client in the main process
    client = new Redis({
      host,
      port,
      username,
      password
    });

    client.on('error', (err) => {
      console.log("error: ", err)
    });

    client.on('ready', () => {
      console.log("connected!")
      window.webContents.send('redis-connection-status', true);
    });

    client.on('message', (channel, message) => {
      console.log("message: ", message)
      window.webContents.send('redis-packet', message);
    });
  });

  ipcMain.on('redis-subscribe', (event, channel) => {
    console.log("subscribing to channel: ", channel)
    client.subscribe(channel);
  });

  ipcMain.on('redis-unsubscribe', (event, channel) => {
    console.log("unsubscribing from channel: ", channel)
    client.unsubscribe(channel);
  });

  ipcMain.on('redis-disconnect', () => {
    console.log("disconnecting from redis")
    client.quit();
    window.webContents.send('redis-connection-status', false);
  })
});