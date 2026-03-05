import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const BuyerSchema = z.object({
  company: z.string(),
  type: z.string().describe("Importer/Distributor/Retailer/Manufacturer"),
  city: z.string(),
  country: z.string(),
  description: z.string().describe("2 sentences why they are a good lead"),
  products: z.array(z.string()),
  certifications: z.array(z.string()),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  website: z.string().nullable(),
  annual_import_volume: z.string().nullable(),
  min_order: z.string().nullable(),
  priority: z.enum(["High", "Medium", "Low"]),
  approach_tip: z.string().describe("how to approach them")
});

const OverviewSchema = z.object({
  summary: z.string().describe("2-3 sentences"),
  market_size: z.string().describe("estimated size or demand level"),
  growth_rate: z.string().describe("growth % or trend"),
  top_entry: z.string().describe("best channel for Indian exporter"),
  regulations: z.string().describe("key import rules and certifications needed")
});

const TradeDataSchema = z.object({
  overview: OverviewSchema,
  buyers: z.array(BuyerSchema)
});

export const findMoringaBuyers = async (country: string) => {
  const openai = new OpenAI({
    apiKey: process.env.API_KEY,
    dangerouslyAllowBrowser: true // Need this since this runs in the browser via Vite
  });

  const searchPrompt = `
    Research task: Find 5 real companies in ${country} that actively import or distribute bulk Moringa powder, Moringa leaves, or Moringa capsules.
    For each company identify: company name, city, website URL, email, phone number, which Moringa products they buy, and certifications they require.
    Also describe the Moringa import market in ${country}: demand level, key regulations, and best channels for an Indian exporter.
    Focus on finding B2B importers, superfood distributors, and organic health stores.

    Output the research as a strict JSON object following the schema structure.
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a Trade Data Analyst." },
      { role: "user", content: searchPrompt }
    ],
    temperature: 0.2,
    response_format: zodResponseFormat(TradeDataSchema, "trade_data"),
  });

  try {
    const text = response.choices[0].message.content || "{}";
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON Parsing Error", e);
    throw new Error("Failed to structure trade data.");
  }
};
