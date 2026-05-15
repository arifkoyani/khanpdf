"use client"
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Send,
  FileText,
  Eye,
  Image as ImageIcon,
  Video,
  BarChart3,
  GripVertical,
  Upload,
  X,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../../components/ui/accordion";
import { FileText as FileIcon, Image as ImageBlock, Layers, HelpCircle, Search as SearchIcon, LogOut } from "lucide-react";
import BlogApiDocsSection from "./BlogApiDocsSection/BlogApiDocsSection";


type BlogStatus = "draft" | "publish";

type BlogItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  status: BlogStatus;
  publish_date: string;
  read_time: string;
  thumbnail_url: string;
};



type FAQ = { q: string; a: string };

type BlogForm = BlogItem & {
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  mid_image_url: string;
  infographic_url: string;
  video_id: string;
  body_content: string;
  conclusion: string;
  faqs: FAQ[];
};

const emptyForm: BlogForm = {
  id: "",
  title: "",
  slug: "",
  description: "",
  category: "URL to PDF",
  status: "draft",
  publish_date: new Date().toISOString().slice(0, 10),
  read_time: "5 min read",
  thumbnail_url: "",
  meta_title: "",
  meta_description: "",
  canonical_url: "",
  mid_image_url: "",
  infographic_url: "",
  video_id: "",
  body_content: "",
conclusion: "",
  faqs: [{ q: "", a: "" }],
};

export default function BlogAdmin({ onLogout }: { onLogout?: () => void }) {
  const [blogs, setBlogs] = useState<BlogForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BlogStatus>("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState<BlogForm>(emptyForm);

  const filtered = useMemo(() => {
    return blogs.filter((b) => {
      const hay = (b.title + " " + b.description + " " + b.category).toLowerCase();
      const matchesSearch = hay.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ? true : b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [blogs, search, statusFilter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const res = await fetch("/api/blogs/allblogs");
      const data = await res.json();
  
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch blogs");
      }
  
      setBlogs(data.blogs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBlogs();
  }, []);

  const openCreate = () => {
    setForm({ ...emptyForm });
    setEditorOpen(true);
  };

  const openEdit = (blog: BlogForm) => {
    setForm({
      ...emptyForm,
      ...blog,
      faqs: Array.isArray(blog.faqs) && blog.faqs.length > 0 ? blog.faqs : [{ q: "", a: "" }],
    });
  
    setEditorOpen(true);
  };

  const saveBlog = async (next: BlogForm, status: BlogStatus) => {
    try {
      setLoading(true);
      setError(null);
  
      const payload = {
        ...next,
        status,
        faqs: Array.isArray(next.faqs) ? next.faqs : [],
      };
  
      const isEdit = Boolean(next.id);
  
      const res = await fetch(
        isEdit ? "/api/blogs/updateblog" : "/api/blogs/createblog",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
  
      const data = await res.json();
  
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save blog");
      }
  
      setEditorOpen(false);
      await fetchBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };




  const setStatus = async (id: string, status: BlogStatus) => {
    const blog = blogs.find((b) => b.id === id);
    if (!blog) return;
  
    await saveBlog(
      {
        ...emptyForm,
        ...blog,
        status,
        faqs: Array.isArray(blog.faqs) ? blog.faqs : [],
      },
      status
    );
  };


  function ImageUploadField({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
  
    const handleFile = async (file?: File | null) => {
      if (!file) return;
  
      try {
        setUploading(true);
        setUploadError(null);
  
        const uploadedUrl = await uploadMediaToSupabase(file);
        onChange(uploadedUrl);
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Image upload failed"
        );
      } finally {
        setUploading(false);
  
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    };
  
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
  
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className="rounded-xl border border-dashed p-4 flex items-center gap-4 bg-muted/30"
        >
          <div className="size-20 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
            {value ? (
              <img src={value} alt="" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="size-6 text-muted-foreground" />
            )}
          </div>
  
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {uploading ? "Uploading..." : "Drag & drop or click to upload"}
            </p>
  
            <p className="text-xs text-muted-foreground truncate">
              {value ? value : "Saved URL will appear here after upload."}
            </p>
  
            {uploadError && (
              <p className="text-xs text-destructive mt-1">
                {uploadError}
              </p>
            )}
          </div>
  
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="gap-2"
          >
            <Upload className="size-4" />
            {uploading ? "Uploading..." : "Upload"}
          </Button>
  
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      </div>
    );
  }

  const remove = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmed) return;
  
    try {
      setLoading(true);
  
      const res = await fetch("/api/blogs/deleteblog", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
  
      const data = await res.json();
  
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete blog");
      }
  
      await fetchBlogs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete blog");
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.status === "publish").length,
    drafts: blogs.filter((b) => b.status === "draft").length,
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-7xl px-5 py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">
              · Blog Admin
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Manage your blog posts
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Create, edit, publish and organise every article in one place.
            </p>
          </div>
          <div className="flex gap-2">
            {onLogout && (
              <Button size="lg" variant="outline" onClick={onLogout} className="gap-2">
                <LogOut className="size-4" /> Logout
              </Button>
            )}
            <Button size="lg" onClick={openCreate} className="gap-2">
              <Plus className="size-4" /> New Blog
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Published" value={stats.published} accent />
          <StatCard label="Drafts" value={stats.drafts} />
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs by title, category…"
              className="pl-9 h-11"
            />
          </div>
          <Tabs
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as "all" | BlogStatus)}
          >
            <TabsList className="h-11">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="publish">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {error && (
  <p className="text-sm text-destructive mb-4">
    {error}
  </p>
)}

{loading && (
  <p className="text-sm text-muted-foreground mb-4">
    Loading...
  </p>
)}
        {filtered.length === 0 ? (
          <div className="border border-dashed rounded-xl p-16 text-center">
            <FileText className="size-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No blogs match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((b) => (
              <BlogCard
                key={b.id}
                blog={b}
                onEdit={() => openEdit(b)}
                onDelete={() => remove(b.id)}
                onPublish={() => setStatus(b.id, "publish")}
                onDraft={() => setStatus(b.id, "draft")}
              />
            ))}
          </div>
        )}
      </main>


      <BlogApiDocsSection />

      <BlogEditorDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        form={form}
        setForm={setForm}
        onSaveDraft={() => saveBlog(form, "draft")}
onPublish={() => saveBlog(form, "publish")}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={
        "rounded-xl border p-4 md:p-5 " +
        (accent ? "bg-primary/5 border-primary/30" : "bg-card")
      }
    >
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="text-2xl md:text-3xl font-semibold mt-1">{value}</p>
    </div>
  );
}

function BlogCard({
  blog,
  onEdit,
  onDelete,
  onPublish,
  onDraft,
}: {
  blog: BlogItem;
  onEdit: () => void;
  onDelete: () => void;
  onPublish: () => void;
  onDraft: () => void;
}) {
  return (
    <Card className="overflow-hidden group hover:border-primary/40 transition-colors">
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {blog.thumbnail_url ? (
          <img
            src={blog.thumbnail_url}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageIcon className="size-8" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge
            variant={blog.status === "publish" ? "default" : "secondary"}
            className="capitalize"
          >
            {blog.status === "publish" ? "Published" : "Draft"}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>{blog.category}</span>
          <span>{blog.publish_date}</span>
        </div>
        <h3 className="font-semibold leading-snug line-clamp-2">{blog.title}</h3>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {blog.description}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0">
        <Button variant="ghost" size="sm" onClick={onEdit} className="gap-2">
          <Pencil className="size-3.5" /> Edit
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="size-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={"/blog/" + blog.slug} target="_blank" rel="noreferrer">
                <Eye className="size-4 mr-2" /> View Blog
              </a>
            </DropdownMenuItem>
            {blog.status === "draft" ? (
              <DropdownMenuItem onClick={onPublish}>
                <Send className="size-4 mr-2" /> Publish
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={onDraft}>
                <FileText className="size-4 mr-2" /> Move to Draft
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="size-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}

function BlogEditorDialog({
  open,
  onOpenChange,
  form,
  setForm,
  onSaveDraft,
  onPublish,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  form: BlogForm;
  setForm: (f: BlogForm) => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}) {
  const update = <K extends keyof BlogForm>(key: K, value: BlogForm[K]) =>
    setForm({ ...form, [key]: value });

  const updateFaq = (i: number, key: keyof FAQ, value: string) => {
    const faqs = form.faqs.map((f, idx) =>
      idx === i ? { ...f, [key]: value } : f,
    );
    setForm({ ...form, faqs });
  };
  const addFaq = () =>
    setForm({ ...form, faqs: [...form.faqs, { q: "", a: "" }] });
  const removeFaq = (i: number) =>
    setForm({ ...form, faqs: form.faqs.filter((_, idx) => idx !== i) });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-none w-screen h-screen sm:rounded-none p-0 gap-0 flex flex-col translate-x-0 translate-y-0 left-0 top-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-3 bg-background z-10 border-b shrink-0">
          <DialogTitle className="text-2xl">
            {form.title ? "Edit: " + form.title : "Create New Blog"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            All fields are filled manually. Images upload to your storage bucket.
          </p>
        </DialogHeader>

        <div className="px-6 py-4 flex-1 overflow-y-auto">
          <Accordion
            type="multiple"
            defaultValue={["basic"]}
            className="space-y-3"
          >
            <SectionItem
              value="basic"
              icon={<FileIcon className="size-4 text-primary" />}
              title="Basic"
              subtitle="Title, slug, category and publish status"
            >
              <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Title">
                  <Input
                    value={form.title}
                    onChange={(e) => update("title", e.target.value)}
                    placeholder="What Is URL to PDF?"
                  />
                </Field>
                <Field label="Slug">
                  <Input
                    value={form.slug}
                    onChange={(e) => update("slug", e.target.value)}
                    placeholder="what-is-url-to-pdf"
                  />
                </Field>
              </div>
              <Field label="Description">
                <Textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Short summary that appears on the blog card and meta description."
                />
              </Field>
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Category">
                  <Input
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                  />
                </Field>
                <Field label="Read Time">
                  <Input
                    value={form.read_time}
                    onChange={(e) => update("read_time", e.target.value)}
                    placeholder="10 min read"
                  />
                </Field>
                <Field label="Publish Date">
                  <Input
                    type="date"
                    value={form.publish_date}
                    onChange={(e) => update("publish_date", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Status">
                <Select
                  value={form.status}
                  onValueChange={(v) => update("status", v as BlogStatus)}
                >
                  <SelectTrigger className="w-full md:w-60">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="publish">Publish</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              </div>
            </SectionItem>

            <SectionItem
              value="media"
              icon={<ImageBlock className="size-4 text-primary" />}
              title="Media"
              subtitle="Thumbnail, middle image, infographic and video"
            >
              <div className="space-y-5">
              <ImageUploadField
                label="Thumbnail Image"
                value={form.thumbnail_url}
                onChange={(v) => update("thumbnail_url", v)}
              />
              <ImageUploadField
                label="Middle Image"
                value={form.mid_image_url}
                onChange={(v) => update("mid_image_url", v)}
              />
              <ImageUploadField
                label="Infographic Image"
                value={form.infographic_url}
                onChange={(v) => update("infographic_url", v)}
              />
              <Field
                label="YouTube Video ID"
                hint="Only the ID, e.g. dQw4w9WgXcQ — not the full URL."
              >
                <Input
                  value={form.video_id}
                  onChange={(e) => update("video_id", e.target.value)}
                  placeholder="dQw4w9WgXcQ"
                />
              </Field>
              </div>
            </SectionItem>

            <SectionItem
              value="content"
              icon={<Layers className="size-4 text-primary" />}
              title="Content"
              subtitle="Body editor with draggable media blocks"
            >
              <BodyEditor
  value={form.body_content}
  onChange={(v) => update("body_content", v)}
/>
            </SectionItem>

            <SectionItem
              value="faq"
              icon={<HelpCircle className="size-4 text-primary" />}
              title="FAQ"
              subtitle="Questions and answers shown on the post"
            >
              <div className="space-y-4">
              {form.faqs.map((f, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-4 space-y-3 bg-card relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      FAQ #{i + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFaq(i)}
                      className="text-destructive"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Question"
                    value={f.q}
                    onChange={(e) => updateFaq(i, "q", e.target.value)}
                  />
                  <Textarea
                    placeholder="Answer"
                    rows={3}
                    value={f.a}
                    onChange={(e) => updateFaq(i, "a", e.target.value)}
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addFaq} className="gap-2">
                <Plus className="size-4" /> Add FAQ
              </Button>
              </div>
            </SectionItem>

            <SectionItem
              value="seo"
              icon={<SearchIcon className="size-4 text-primary" />}
              title="SEO"
              subtitle="Meta title, description and canonical URL"
            >
              <div className="space-y-4">
              <Field label="Meta Title">
                <Input
                  value={form.meta_title}
                  onChange={(e) => update("meta_title", e.target.value)}
                />
              </Field>
              <Field label="Meta Description">
                <Textarea
                  rows={3}
                  value={form.meta_description}
                  onChange={(e) => update("meta_description", e.target.value)}
                />
              </Field>
              <Field label="Canonical URL">
                <Input
                  value={form.canonical_url}
                  onChange={(e) => update("canonical_url", e.target.value)}
                  placeholder="https://example.com/blog/your-slug"
                />
              </Field>
              </div>
            </SectionItem>
          </Accordion>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-background shrink-0 flex-row flex-wrap gap-2 sm:justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2">
              <Eye className="size-4" /> Preview
            </Button>
            <Button variant="secondary" onClick={onSaveDraft} className="gap-2">
              <FileText className="size-4" /> Save as Draft
            </Button>
            <Button onClick={onPublish} className="gap-2">
              <Send className="size-4" /> Publish Blog
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function SectionItem({
  value,
  icon,
  title,
  subtitle,
  children,
}: {
  value: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionItem
      value={value}
      className="border rounded-xl bg-card overflow-hidden data-[state=open]:border-primary/40"
    >
      <AccordionTrigger className="px-4 py-4 hover:no-underline">
        <div className="flex items-center gap-3 text-left">
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">{title}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-5 pt-2 border-t">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

async function uploadMediaToSupabase(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "blog");

  const res = await fetch("/api/blogs/uploadmedia", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Image upload failed");
  }

  return data.url as string;
}

function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFile = async (file?: File | null) => {
    if (!file) return;

    try {
      setUploading(true);
      setUploadError(null);

      const uploadedUrl = await uploadMediaToSupabase(file);
      onChange(uploadedUrl);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Image upload failed"
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className="rounded-xl border border-dashed p-4 flex items-center gap-4 bg-muted/30"
      >
        <div className="size-20 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="size-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {uploading ? "Uploading..." : "Drag & drop or click to upload"}
          </p>

          <p className="text-xs text-muted-foreground truncate">
            {value ? value : "Saved URL will appear here after upload."}
          </p>

          {uploadError && (
            <p className="text-xs text-destructive mt-1">
              {uploadError}
            </p>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="gap-2"
        >
          <Upload className="size-4" />
          {uploading ? "Uploading..." : "Upload"}
        </Button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
    </div>
  );
}

const PLACEHOLDERS = [
  { token: "[MID_IMAGE]", label: "Middle Image", icon: ImageIcon },
  { token: "[VIDEO]", label: "YouTube Video", icon: Video },
  { token: "[INFOGRAPHIC]", label: "Infographic", icon: BarChart3 },
] as const;

function BodyEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [draggingToken, setDraggingToken] = useState<string | null>(null);

  const insertAtCursor = (token: string) => {
    const el = textareaRef.current;
    if (!el) {
      onChange(value + "\n\n" + token + "\n");
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = value.slice(0, start) + "\n" + token + "\n" + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      const pos = start + token.length + 2;
      el.setSelectionRange(pos, pos);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const token = e.dataTransfer.getData("text/placeholder");
    if (!token) return;
    const el = textareaRef.current;
    if (!el) return;
    const pos = el.selectionStart ?? value.length;
    const next = value.slice(0, pos) + "\n" + token + "\n" + value.slice(pos);
    onChange(next);
    setDraggingToken(null);
  };

  const usedTokens = PLACEHOLDERS.filter((p) => value.includes(p.token));

  return (
    <div className="grid lg:grid-cols-[1fr_260px] gap-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-medium">Body Content</Label>
          <span className="text-xs text-muted-foreground">
            Drag a block on the right into the body
          </span>
        </div>
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          rows={20}
          placeholder={"## Introduction\n\nWrite your blog content here.\n\n[MID_IMAGE]\n\n## How It Works\n\n[VIDEO]\n\n## Wrap-up\n\n[INFOGRAPHIC]"}
          className={
            "font-mono text-sm leading-relaxed min-h-[420px] transition-colors " +
            (draggingToken ? "ring-2 ring-primary border-primary" : "")
          }
        />
        {usedTokens.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-muted-foreground self-center mr-1">
              In document:
            </span>
            {usedTokens.map((p) => (
              <Badge key={p.token} variant="secondary" className="gap-1">
                <p.icon className="size-3" /> {p.label}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <aside className="rounded-xl border bg-card p-4 h-fit lg:sticky lg:top-4">
        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-3">
          · Insert Blocks
        </p>
        <div className="space-y-2">
          {PLACEHOLDERS.map((p) => (
            <div
              key={p.token}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/placeholder", p.token);
                e.dataTransfer.effectAllowed = "copy";
                setDraggingToken(p.token);
              }}
              onDragEnd={() => setDraggingToken(null)}
              onClick={() => insertAtCursor(p.token)}
              className="group flex items-center gap-3 rounded-lg border bg-background p-3 cursor-grab active:cursor-grabbing hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <GripVertical className="size-4 text-muted-foreground group-hover:text-primary" />
              <p.icon className="size-4 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none">{p.label}</p>
                <p className="text-[11px] text-muted-foreground font-mono mt-1">
                  {p.token}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-4 leading-relaxed">
          Drag a block into the body, or tap to insert at the cursor. The blog
          page renders the uploaded media at each placeholder.
        </p>
      </aside>
    </div>
  );
}
