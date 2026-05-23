// ビルド前に src/content/blog/*.md を読み込み src/generated/blogs.json を生成する
// Workers にはファイルシステムがないため、コンテンツをバンドルに含める
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, "../src/content/blog");
const outputPath = path.join(__dirname, "../src/generated/blogs.json");

const blogs = fs
  .readdirSync(contentDir)
  .filter((f) => f.endsWith(".md"))
  .map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(contentDir, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      title: data.title,
      tags: data.tags,
      date: data.date,
      slug,
      body: content,
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

fs.writeFileSync(outputPath, JSON.stringify(blogs, null, 2));
console.log(`✓ Generated ${blogs.length} blog posts → src/generated/blogs.json`);
