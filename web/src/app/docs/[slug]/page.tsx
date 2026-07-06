import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DocsShell from "@/components/docs/DocsShell";
import { docs, getDoc } from "@/lib/docs";

type PageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return docs.filter((doc) => doc.slug !== "introduction").map((doc) => ({ slug: doc.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const doc = getDoc(params.slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: doc.description,
  };
}

export default function DocDetailPage({ params }: PageProps) {
  const doc = getDoc(params.slug);
  if (!doc) notFound();
  return <DocsShell slug={params.slug} />;
}
