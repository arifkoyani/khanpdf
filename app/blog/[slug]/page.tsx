import BlogPostComponent from "../../components/blog/[slug]/page";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: PageProps) {
  // Await the params to resolve Next.js 15+ routing requirements
  const resolvedParams = await params;
  
  return <BlogPostComponent slug={resolvedParams.slug} />;
}
