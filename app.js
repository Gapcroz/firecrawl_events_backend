const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./backend/config/db");
const cleanDuplicateEvents = require("./backend/utils/cleanDuplicates");

dotenv.config();

const app = express();
app.use(express.json());

// Conexión a Mongo + limpieza antes de iniciar servidor
(async () => {
  try {
    await connectDB();
    await cleanDuplicateEvents(); // 🔥 Ejecuta limpieza aquí

    app.use("/api/users", require("./backend/routes/userRoutes"));
    app.use("/api/extract", require("./backend/routes/extractRoutes"));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Error durante la inicialización del servidor:", err);
  }
})();
