const firecrawlModule = require("@mendable/firecrawl-js");
const { z } = require("zod");

const FirecrawlApp = firecrawlModule.default;

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

const extractWebsiteData = async (urls) => {
  const schema = z.object({
    events: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        category: z.string().optional(),
        start_date: z.string(),
        end_date: z.string().optional(),
      })
    ),
  });

  const prompt = `
  Extract all public events from the page.
  Include for each event:
  - name
  - description
  - category (if available)
  - start date
  - end date (if available)
  Return a full list of JSON objects.
  `;

  const result = await firecrawl.extract(
    ["https://techcrunch.com/events/", "https://vc4a.com/events/?lang=es"],
    {
      prompt,
      schema,
    }
  );
  return result;
};

module.exports = { extractWebsiteData };
