import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: Request) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration error",
        },
        { status: 500 }
      );
    }


 

    const body = await req.json();

    if (!body.title || !body.slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and slug are required",
        },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload = {
      title: body.title,
      slug: body.slug,
      category: body.category || null,
      description: body.description || null,
      read_time: body.read_time || null,
      publish_date: body.publish_date || null,
      status: body.status || "draft",

      thumbnail_url: body.thumbnail_url || null,
      thumbnail_alt: body.thumbnail_alt || null,
      infographic_url: body.infographic_url || null,
      infographic_alt: body.infographic_alt || null,
      video_id: body.video_id || null,

      meta_title: body.meta_title || null,
      meta_description: body.meta_description || null,
      canonical_url: body.canonical_url || null,

      body_content: body.body_content || null,
      conclusion: body.conclusion || null,
      faqs: Array.isArray(body.faqs) ? body.faqs : [],
    };

    const { data, error } = await supabase
      .from("blog_posts")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Blog created successfully",
        blog: data,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create blog",
      },
      { status: 500 }
    );
  }
}