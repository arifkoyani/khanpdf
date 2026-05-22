import BlogListingpage from "../components/blog/page";

type Props = {
  searchParams?: Promise<{
    category?: string;
  }>;
};

export default function Blog({ searchParams }: Props) {
  return <BlogListingpage searchParams={searchParams} />;
}