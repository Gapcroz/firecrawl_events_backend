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
