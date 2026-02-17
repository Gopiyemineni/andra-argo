
import { GoogleGenAI, Type } from "@google/genai";

export const findMoringaBuyers = async (country: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Step 1: Research with Google Search Grounding
  const searchPrompt = `
    Research task: Find 5 real companies in ${country} that actively import or distribute bulk Moringa powder, Moringa leaves, or Moringa capsules. 
    For each company identify: company name, city, website URL, email, phone number, which Moringa products they buy, and certifications they require.
    Also describe the Moringa import market in ${country}: demand level, key regulations, and best channels for an Indian exporter.
    Focus on finding B2B importers, superfood distributors, and organic health stores.
  `;

  const searchResponse = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: searchPrompt,
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.2,
    },
  });

  const researchText = searchResponse.text;

  // Step 2: Structure the research into JSON
  const structurePrompt = `
    You are a Trade Data Analyst. Convert the following research into a strict JSON object.
    
    RESEARCH DATA:
    ${researchText}

    JSON SCHEMA:
    {
      "overview": {
        "summary": "string (2-3 sentences)",
        "market_size": "string (estimated size or demand level)",
        "growth_rate": "string (growth % or trend)",
        "top_entry": "string (best channel for Indian exporter)",
        "regulations": "string (key import rules and certifications needed)"
      },
      "buyers": [
        {
          "company": "string",
          "type": "string (Importer/Distributor/Retailer/Manufacturer)",
          "city": "string",
          "country": "${country}",
          "description": "string (2 sentences why they are a good lead)",
          "products": ["string"],
          "certifications": ["string"],
          "email": "string or null",
          "phone": "string or null",
          "website": "string or null",
          "annual_import_volume": "string or null",
          "min_order": "string or null",
          "priority": "High" | "Medium" | "Low",
          "approach_tip": "string (how to approach them)"
        }
      ]
    }
  `;

  const jsonResponse = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: structurePrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overview: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              market_size: { type: Type.STRING },
              growth_rate: { type: Type.STRING },
              top_entry: { type: Type.STRING },
              regulations: { type: Type.STRING },
            },
            required: ["summary", "market_size", "growth_rate", "top_entry", "regulations"],
          },
          buyers: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                company: { type: Type.STRING },
                type: { type: Type.STRING },
                city: { type: Type.STRING },
                country: { type: Type.STRING },
                description: { type: Type.STRING },
                products: { type: Type.ARRAY, items: { type: Type.STRING } },
                certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                email: { type: Type.STRING, nullable: true },
                phone: { type: Type.STRING, nullable: true },
                website: { type: Type.STRING, nullable: true },
                annual_import_volume: { type: Type.STRING, nullable: true },
                min_order: { type: Type.STRING, nullable: true },
                priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                approach_tip: { type: Type.STRING },
              },
              required: ["company", "type", "city", "country", "description", "products", "certifications", "priority", "approach_tip"],
            },
          },
        },
        required: ["overview", "buyers"],
      },
    },
  });

  try {
    return JSON.parse(jsonResponse.text || "{}");
  } catch (e) {
    console.error("JSON Parsing Error", e);
    throw new Error("Failed to structure trade data.");
  }
};
