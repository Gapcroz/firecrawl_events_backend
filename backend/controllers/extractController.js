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
    const eventsToInsert = [];

    for (const event of data.data.events) {
      const alreadyExists = await fcEvent.findOne({
        name: event.name,
        url_site: event.url_site,
        start_date: event.start_date,
      });

      if (!alreadyExists) {
        eventsToInsert.push(event);
      }
    }

    if (eventsToInsert.length > 0) {
      await fcEvent.insertMany(eventsToInsert);
      console.log(`${eventsToInsert.length} eventos nuevos guardados.`);
    } else {
      console.log("No se encontraron eventos nuevos para guardar.");
    }
    res.status(201).json({
      message: "Eventos extraídos y guardados exitosamente.",
      events: savedEvents,
    });
    console.log("Eventos guardados");
  } catch (error) {
    console.error("Error al extraer o guardar datos:", error);
    res.status(500).json({ error: "Error al extraer datos con Firecrawl" });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await fcEvent.find({});
    res.json({ events });
    console.log("Eventos enviados");
  } catch (error) {
    res.status(500).json({ error: "Error al obtener eventos." });
  }
};

module.exports = { extractInfo, getAllEvents };
