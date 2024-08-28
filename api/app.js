import express from 'express';
const app = express();
import appointmentRoutes from './routes/appointments.js';

app.use('/appointments', appointmentRoutes);

app.use('/', (req, res, next) => {
    res.status(200).json({
        message: 'It works!'
    });
});

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Not found!'
    });
});

export default app;