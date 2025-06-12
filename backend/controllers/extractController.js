const { extractWebsiteData } = require("../services/firecrawlExtractService");
const fcEvent = require("../models/fcEvent");

const extractInfo = async (req, res) => {
  const { urls } = req.body;
  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: "Se requiere un arreglo de URLs." });
  }

  try {
    const data = await extractWebsiteData(urls);
    console.log("Datos extraídos:", data);
    // Validación básica
    if (!data || !data.data || !Array.isArray(data.data.events)) {
      return res
        .status(400)
        .json({ error: "No se encontraron eventos válidos." });
    }
    // Guardar en MongoDB
    const savedEvents = await fcEvent.insertMany(data.data.events);
    res.status(201).json({
      message: "Eventos extraídos y guardados exitosamente.",
      events: savedEvents,
    });
  } catch (error) {
    console.error("Error al extraer o guardar datos:", error);
    res.status(500).json({ error: "Error al extraer datos con Firecrawl" });
  }
};

module.exports = { extractInfo };
