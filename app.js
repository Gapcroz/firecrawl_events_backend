const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./backend/config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/users", require("./backend/routes/userRoutes"));
app.use("/api/extract", require("./backend/routes/extractRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
