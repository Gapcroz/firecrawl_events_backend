// utils/cleanDuplicates.js
const fcEvent = require("../models/fcEvent");
const { normalizeText, normalizeDate, normalizeUrl } = require("./normalize"); // extrae funciones reutilizables aquí

const removePastEvents = async () => {
  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
  const result = await fcEvent.deleteMany({
    start_date: { $lt: today },
  });
  console.log(
    `🗑️ Eliminados ${result.deletedCount} eventos pasados (< ${today}).`
  );
};

const cleanDuplicateEvents = async () => {
  const allEvents = await fcEvent.find({});
  const seen = new Map();
  const toDelete = [];

  for (const event of allEvents) {
    const name = normalizeText(event.name);
    const desc = normalizeText(event.description);
    const date = normalizeDate(event.start_date); // yyyy-mm-dd
    const url = normalizeUrl(event.url_site);
    const image = normalizeUrl(event.url_image);

    const key = `${name}|${desc}|${date}|${url}|${image}`;
    if (seen.has(key)) {
      toDelete.push(event._id);
    } else {
      seen.set(key, true);
    }
  }

  if (toDelete.length > 0) {
    const result = await fcEvent.deleteMany({ _id: { $in: toDelete } });
    console.log(`🧹 Eliminados ${result.deletedCount} duplicados`);
  } else {
    console.log("✅ No se encontraron duplicados");
  }

  await removePastEvents();
};

module.exports = cleanDuplicateEvents;
