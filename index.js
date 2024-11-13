import { createServer } from 'http';
import app from './api/app.js';
import config from './config.js';

const port = config.app.port;
const server = createServer(app);

server.listen(port, () => {console.log("Server running on port "+port)});