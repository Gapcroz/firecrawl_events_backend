// utils/normalize.js
const normalizeText = (text) =>
  (text || "")
    .normalize("NFD") // separa tildes de letras (ej. á → a + ́)
    .replace(/[\u0300-\u036f]/g, "") // remueve tildes
    .toLowerCase()
    .replace(/\s+/g, " ") // espacios múltiples → 1
    .replace(/[^\w\s]|_/g, "") // quita puntuación, símbolos, emojis
    .trim();

const normalizeDate = (isoDate) => {
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0]; // yyyy-mm-dd
};

const normalizeUrl = (url) => {
  if (!url) return "";
  return url
    .toLowerCase()
    .trim()
    .replace(/^https?:\/\//, "") // sin http/https
    .replace(/^www\./, "") // sin www
    .split("?")[0]; // sin parámetros
};

module.exports = { normalizeText, normalizeDate, normalizeUrl };
