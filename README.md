<h1>Lettuce</h1>
<h3>Redis GUI</h3>

This is a small project that allows you to connect to a Redis database through an Electron App.

It allows you to view pub/sub messages in real-time, with correct formatting and colorization.

<ul>
  <li>Note that this only currently works with Windows.</li>
</ul>

<h1>Download</h1>
<ul style="list-style-type: number">
  <li>git clone https://github.com/markxhewson/lettuce</li>
  <li>cd lettuce</li>
  <li>npm run build</li>
  <li>npm run compile</li>
</ul>

This will load the React content, then compile the Electron application with the up-to-date React build.

<ul">
  <li>The executable file is within **dist/win-unpacked/Lettuce.exe**</li>
</ul>

<h1>Usage</h1>
Simply run the application after build and enter your Redis server details.

You must then enter your Redis channel to listen to packet messages.

<ul>
  <li>Note that your Redis server must be able to be connected to from outside sources.</li>
</ul>

