const express = require("express");
const compression = require('compression');
const path = require('path');
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 3000;
const index = require("./routes/index");

const app = express();

const PUBLIC_DIR = path.resolve(__dirname, '../public');


app.use(compression());
app.use(express.static(PUBLIC_DIR));
app.use('/api/index', index);

const server = http.createServer(app);

const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));