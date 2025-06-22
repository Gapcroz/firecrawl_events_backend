const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./backend/config/db");
const cleanDuplicateEvents = require("./backend/utils/cleanDuplicates");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

(async () => {
  try {
    await connectDB();
    await cleanDuplicateEvents();

    app.use("/api/users", require("./backend/routes/userRoutes"));
    app.use("/api/extract", require("./backend/routes/extractRoutes"));
    app.use(
      "/api/custom-events",
      require("./backend/routes/customEventRoutes")
    );

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`✅ Servidor corriendo en el puerto ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Error durante la inicialización del servidor:", err);
  }
})();
