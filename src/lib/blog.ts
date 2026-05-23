import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Blog {
  title: string;
  tags: string[];
  date: string;
  slug: string;
  body: string;
}

const contentDir = path.join(process.cwd(), "src/content/blog");

export function getAllBlogs(): Blog[] {
  const files = fs.readdirSync(contentDir);
  return files
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        title: data.title as string,
        tags: data.tags as string[],
        date: data.date as string,
        slug,
        body: content,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
