const firecrawlModule = require("@mendable/firecrawl-js");
const axios = require("axios");
const { z } = require("zod");

const FirecrawlApp = firecrawlModule.default;

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

const fetchUrlsFromUmbraco = async () => {
  try {
    const response = await axios.get(
      "http://startupqaf.duckdns.org/api/umbraco?path=sites/opportunities"
    );

    const items = response.data?.properties?.urlScraping?.items || [];

    const urls = items
      .map((item) => item.content?.properties?.stringText)
      .filter(Boolean);

    return urls;
  } catch (err) {
    console.error("❌ Error al obtener URLs desde Umbraco:", err.message);
    return [];
  }
};

const extractWebsiteData = async (urls = []) => {
  const finalUrls = urls.length > 0 ? urls : await fetchUrlsFromUmbraco();

  const schema = z.object({
    events: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        category: z.string().optional(),
        start_date: z.string(),
        end_date: z.string().optional(),
        location: z.string().optional(),
        url_site: z.string().optional(),
        url_image: z.string().optional(),
      })
    ),
  });

  const prompt = `
    Extract all public events from the page.

    If the page includes pagination (such as "Next", page numbers, or "Load more" buttons), follow those links and extract events from the first 5 accessible pages.

    Include for each event:
    - name
    - description
    - category (if available)
    - start date
    - end date (if available)
    - location (venue, city, country if available)

    If available, also include:
    - url_site: the full URL from an <a> tag (like a "Learn More", "Register", or "Details" button)
    - url_image: the image URL from an <img> tag that visually represents the event (like banners or thumbnails)

    IMPORTANT:
    - Do NOT make up data.
    - Only use real href/src attribute values from the HTML.
    - Return a full list of JSON objects across all pages, not just the first page.
  `;

  const result = await firecrawl.extract(finalUrls, {
    prompt,
    schema,
  });

  return result;
};

module.exports = { extractWebsiteData };
