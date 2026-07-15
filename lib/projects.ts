import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getProjectBySlug, projects, type Project } from "@/lib/data/projects";

const CONTENT_DIR = path.join(process.cwd(), "content", "projects");

export type CaseStudy = {
  project: Project;
  content: string;
  frontmatter: {
    title: string;
    year: string;
    status: string;
    stack: string[];
  };
};

export function getAllCaseStudySlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export function getCaseStudy(slug: string): CaseStudy | null {
  const project = getProjectBySlug(slug);
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!project || !fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    project,
    content,
    frontmatter: {
      title: data.title ?? project.title,
      year: data.year ?? project.year,
      status: data.status ?? project.status,
      stack: data.stack ?? project.stack,
    },
  };
}

export function getProjectsWithCaseStudies(): string[] {
  const slugs = getAllCaseStudySlugs();
  return projects.filter((p) => slugs.includes(p.slug)).map((p) => p.slug);
}
