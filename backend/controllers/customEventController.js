const fcEvent = require("../models/fcEvent");
const cloudinary = require("../config/cloudinary");
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

    // Use an image if there isn't a URL provided
    let finalImageUrl = urlFromBody;
    if (req.file && req.file.path) {
      finalImageUrl = req.file.path; // URL Cloudinary
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
    const events = await fcEvent.find({}).sort({ start_date: 1 });
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

const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await fcEvent.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado." });
    }

    // Si es imagen de Cloudinary, intenta borrar
    if (event.url_image && event.url_image.includes("res.cloudinary.com")) {
      const urlParts = event.url_image.split("/");
      const fileWithExt = urlParts[urlParts.length - 1];
      const fileName = fileWithExt.replace(/\.(jpg|jpeg|png)$/, ""); // Quita extensión
      const publicId = `events/${fileName}`;

      await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
      });
    }

    await fcEvent.findByIdAndDelete(id);

    res.json({ message: "Evento e imagen eliminados exitosamente." });
  } catch (err) {
    console.error("❌ Error al eliminar evento:", err);
    res.status(500).json({ error: "Error al eliminar evento." });
  }
};

module.exports = {
  createCustomEvent,
  getCustomEvents,
  getPendingEvents,
  updateEventStatus,
  deleteEvent,
};
