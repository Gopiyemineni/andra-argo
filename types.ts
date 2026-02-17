
export interface BuyerLead {
  companyName: string;
  location: string;
  category: string;
  description: string;
  sourceUrl?: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface LeadSearchResponse {
  text: string;
  sources: GroundingChunk[];
}
