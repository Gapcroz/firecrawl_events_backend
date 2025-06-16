// utils/cleanDuplicates.js
const fcEvent = require("../models/fcEvent");

const normalizeDate = (isoDate) => {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0]; // Solo yyyy-mm-dd
};

const normalizeText = (text) => {
  return text?.toLowerCase().replace(/\s+/g, " ").trim() || "";
};

const normalizeUrl = (url) => {
  if (!url) return "";
  return url.split("?")[0].toLowerCase(); // delete query string
};

const cleanDuplicateEvents = async () => {
  const allEvents = await fcEvent.find({});
  const seen = new Map();
  const toDelete = [];

  for (const event of allEvents) {
    const name = normalizeText(event.name);
    const desc = normalizeText(event.description);
    const date = normalizeDate(event.start_date);
    const url = normalizeUrl(event.url_site);

    const key = `${name}|${desc}|${date}|${url}`;

    if (seen.has(key)) {
      toDelete.push(event._id);
    } else {
      seen.set(key, true);
    }
  }

  if (toDelete.length > 0) {
    const result = await fcEvent.deleteMany({ _id: { $in: toDelete } });
    console.log(`🧹 Eliminados ${result.deletedCount} eventos duplicados.`);
  } else {
    console.log("✅ No hay eventos duplicados.");
  }
};

module.exports = cleanDuplicateEvents;
