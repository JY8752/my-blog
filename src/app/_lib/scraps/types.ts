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
  bodyHtml: string | null;
  bodyHtmlVersion: number | null;
  position: number;
  isPinned: boolean;
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

export interface ScrapBodyHtml {
  html: string;
  version: number;
}
