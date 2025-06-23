const fcEvent = require("../models/fcEvent");
require("dotenv").config();

const createCustomEvent = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      start_date,
      end_date,
      location,
      url_site,
      url_image: urlFromBody,
    } = req.body;

    // Usa imagen del archivo si fue subida, si no usa la URL del form
    let finalImageUrl = urlFromBody;
    if (req.file) {
      finalImageUrl = `${process.env.SERVER_URL}/uploads/${req.file.filename}`;

    }

    const newEvent = new fcEvent({
      name,
      description,
      category,
      start_date,
      end_date,
      location,
      url_site,
      url_image: finalImageUrl,
      status: "inactive", // default
    });

    const saved = await newEvent.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error al guardar evento personalizado:", err);
    res.status(500).json({ error: "Error al guardar evento" });
  }
};

const getCustomEvents = async (req, res) => {
  try {
    const events = await fcEvent.find({});
    res.status(200).json({ events });
  } catch (err) {
    console.error("Error al obtener eventos personalizados:", err);
    res.status(500).json({ error: "Error al obtener eventos personalizados" });
  }
};

const getPendingEvents = async (req, res) => {
  try {
    const events = await fcEvent.find({ status: "inactive" });
    res.json({ events });
  } catch (err) {
    res.status(500).json({ error: "Error fetching pending events" });
  }
};

const updateEventStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ error: "Estado inválido." });
  }

  try {
    const updated = await fcEvent.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ error: "Evento no encontrado." });

    res.json(updated);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error al actualizar el estado del evento." });
  }
};

module.exports = {
  createCustomEvent,
  getCustomEvents,
  getPendingEvents,
  updateEventStatus,
};
