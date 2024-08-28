import { createServer } from 'http';
import app from './api/app.js';
const port = process.env.port || 3000;
const server = createServer(app);

server.listen(port, () => {console.log("Server running on port "+port)});