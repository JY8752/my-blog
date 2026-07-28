export interface ScrapSummary {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  entryCount: number;
}

export interface ScrapEntry {
  id: string;
  scrapId: string;
  bodyMarkdown: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScrapDetail extends ScrapSummary {
  entries: ScrapEntry[];
}

export interface CreateScrapInput {
  slug: string;
  title: string;
  tags: string[];
  bodyMarkdown: string;
}

export interface AddScrapEntryInput {
  scrapId: string;
  bodyMarkdown: string;
}
