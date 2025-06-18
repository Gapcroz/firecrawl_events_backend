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
        location: z.string().optional(),
        url_site: z.string().optional(),
        url_image: z.string().optional(),
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
    - location (venue, city, country if available)

    If available, also include:
    - url_site: the full URL from an <a> tag (like a "Learn More", "Register", or "Details" button)
    - url_image: the image URL from an <img> tag that visually represents the event (like banners or thumbnails)

    IMPORTANT: Do not make up links. Only use real href or src attribute values found in the HTML.

    Return a full list of JSON objects.
  `;

  const result = await firecrawl.extract(
    // [
    //   "https://www.eventbrite.com/d/mexico--chihuahua/business/",
    //   "https://mexicobusiness.events/",
    // ],
    ["https://techcrunch.com/events/", "https://vc4a.com/events/?lang=es"],
    {
      prompt,
      schema,
    }
  );
  return result;
};

module.exports = { extractWebsiteData };
