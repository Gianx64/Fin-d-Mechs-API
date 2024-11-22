import { createServer } from 'http';
import app from './api/app.js';

const server = createServer(app);
server.listen(process.env.PORT, () => {console.log("Server running on port", process.env.PORT)});