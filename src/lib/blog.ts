import blogsData from "../generated/blogs.json";

export interface Blog {
  title: string;
  tags: string[];
  date: string;
  slug: string;
  body: string;
}

export function getAllBlogs(): Blog[] {
  return blogsData as Blog[];
}
