import express from "express";
import bodyParser from "body-parser";
import appointmentRoutes from "./routes/appointments.js";
import authRoutes from "./routes/auth.js";
import carRoutes from "./routes/cars.js";
import workshopRoutes from "./routes/workshops.js";

//App initiation and configuration
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Route groups
app.use("/api/appointments", appointmentRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/auth", authRoutes);

//OPTIONS route
app.use((req, res, next) => {
    req.header("Access-Control-Allow-Origin", '*');
    req.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
        return res.status(200).json({
            message: "Options in header."
        });
    }
    next();
});

//Request error handling
app.use((req, res, next) => {
    const err = {
        status: 404,
        message: "Not found"
    };
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message
    });
});

export default app;