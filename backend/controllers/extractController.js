const { extractWebsiteData } = require("../services/firecrawlExtractService");

const extractInfo = async (req, res) => {
  const { urls } = req.body;
  if (!urls) return res.status(400).json({ error: "URL requerida" });

  try {
    const data = await extractWebsiteData(urls);
    console.log("Datos extraídos:", data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al extraer datos con Firecrawl" });
  }
};

module.exports = { extractInfo };
