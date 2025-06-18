const fcEvent = require("../models/fcEvent");

const createCustomEvent = async (req, res) => {
  try {
    const event = new fcEvent(req.body);
    const saved = await event.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error al guardar evento personalizado:", err);
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

module.exports = {
  createCustomEvent,
  getCustomEvents,
};
