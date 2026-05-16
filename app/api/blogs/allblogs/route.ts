import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase
      .from("blog_posts")
      .select(`
        id,
        title,
        slug,
        category,
        description,
        read_time,
        publish_date,
        status,
        thumbnail_url,
        thumbnail_alt,
        infographic_url,
        infographic_alt,
        video_id,
        meta_title,
        meta_description,
        canonical_url,
        body_content,
        conclusion,
        faqs,
        created_at,
        updated_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      blogs: data,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}