# FoglightAPM-Monitor
FoglightAPM-Monitor is base on [Look](https://github.com/baryshev/look).
Look is a perfomance profiler for node.js applications based on [nodetime](https://github.com/SSI-Avalon/nodetime).

FoglightAPM-Monitor just collect performance and send message by Socket.IO then any socket.IO client can receive those performance data and re-send any where.

# Installation

	npm install FoglightAPM-Monitor

# Usage

The following call should be placed before any other require statement in your application, e.g. at the first line of your main module

```js
require('FoglightAPM-Monitor').start();
```

FoglightAPM-Monitor will be started as a web server on port `5959`, you can access it by pointing your browser to: `http://[yourhost]:5959`
FoglightAPM-Monitor also binding this port as a websocket server, then any websocket client can conneting it and get performance data.

# Options

  - `port` Listening port, defaulting to `5959`
  - `host` Listening host, defaulting to `0.0.0.0`

```js
require('FoglightAPM-Monitor').start(3000, '127.0.0.1');
```