// ビルド前に src/content/blog/*.md を読み込み src/generated/blogs.json を生成する
// Workers にはファイルシステムがないため、コンテンツをバンドルに含める
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

type BlogPost = {
  title: string;
  tags: string[];
  date: string;
  slug: string;
  body: string;
};

const getStringField = (
  data: Record<string, unknown>,
  field: string,
  file: string,
): string => {
  const value = data[field];

  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${file}: frontmatter.${field} must be a non-empty string`);
  }

  return value;
};

const getTags = (data: Record<string, unknown>, file: string): string[] => {
  const value = data.tags;

  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((tag) => typeof tag === "string" && tag.length > 0)
  ) {
    throw new Error(`${file}: frontmatter.tags must be a non-empty string array`);
  }

  return value;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, "../src/content/blog");
const outputPath = path.join(__dirname, "../src/generated/blogs.json");

const blogs: BlogPost[] = fs
  .readdirSync(contentDir)
  .filter((f) => f.endsWith(".md"))
  .map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const { data, content } = matter(raw);

    return {
      title: getStringField(data, "title", file),
      tags: getTags(data, file),
      date: getStringField(data, "date", file),
      slug,
      body: content,
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(blogs, null, 2));
console.log(`✓ Generated ${blogs.length} blog posts → src/generated/blogs.json`);
