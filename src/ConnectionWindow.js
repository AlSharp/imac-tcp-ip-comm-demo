import React from 'react';

const ConnectionWindow = () => (
  <div className="connection-window">
    <form>
      <div>
        <label for="port">Port</label>
        <input type="text" id="socket-port" />
      </div>
      <div>
        <label for="ip">IP</label>
        <input type="text" id="socket-ip" />
      </div>
      <button type="submit">Connect</button>
      <button type="submit">Cancel</button>
    </form>
  </div>
)

export default ConnectionWindow
