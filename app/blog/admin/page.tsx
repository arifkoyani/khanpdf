"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BlogAdmin from "../../components/blogadmin/blogadmin";

export default function BlogAdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const session = sessionStorage.getItem("blog_admin_session");
    if (!session) {
      router.push("/blog/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (isAuthenticated === null) {
    return null;
  }

  return <BlogAdmin onLogout={() => {
    sessionStorage.removeItem("blog_admin_session");
    sessionStorage.removeItem("blog_admin_email");
    router.push("/blog/admin/login");
  }} />;
}