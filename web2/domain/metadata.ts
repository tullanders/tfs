export type Metadata = {
  countries?: Array<{ alpha3Code: string; name: string; emoji?: string }>;
  legalTypes?: Array<{ id: number; name: string }>;
  legalSetups?: Array<{ id: number; name: string }>;
  boardTypes?: Array<{ id: string; name: string }>;
};