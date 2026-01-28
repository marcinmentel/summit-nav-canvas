import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import LoadingRunner from "@/components/LoadingRunner";

interface Post {
  id: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  content: unknown;
  image: string | null;
  categories: string[];
  location: string | null;
  read_time: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const ManagePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState("");
  const [location, setLocation] = useState("");
  const [readTime, setReadTime] = useState("5 min read");
  const [published, setPublished] = useState(false);
  const [content, setContent] = useState("");

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to manage your posts",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      setUser(session.user);
      fetchPosts(session.user.id);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
        fetchPosts(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const fetchPosts = async (userId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching posts",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPosts(data || []);
    }
    setIsLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setExcerpt("");
    setImage("");
    setCategories("");
    setLocation("");
    setReadTime("5 min read");
    setPublished(false);
    setContent("");
    setEditingPost(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title);
    setSubtitle(post.subtitle || "");
    setExcerpt(post.excerpt);
    setImage(post.image || "");
    setCategories(post.categories?.join(", ") || "");
    setLocation(post.location || "");
    setReadTime(post.read_time || "5 min read");
    setPublished(post.published);
    setContent(JSON.stringify(post.content, null, 2));
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!title.trim() || !excerpt.trim()) {
      toast({
        title: "Validation error",
        description: "Title and excerpt are required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    let parsedContent: Json = [];
    try {
      parsedContent = content ? JSON.parse(content) : [];
    } catch {
      toast({
        title: "Invalid JSON",
        description: "Content must be valid JSON",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    const postData = {
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      excerpt: excerpt.trim(),
      image: image.trim() || null,
      categories: categories.split(",").map(c => c.trim()).filter(Boolean),
      location: location.trim() || null,
      read_time: readTime.trim() || "5 min read",
      published,
      content: parsedContent,
      user_id: user.id,
    };

    if (editingPost) {
      const { error } = await supabase
        .from("posts")
        .update(postData)
        .eq("id", editingPost.id);

      if (error) {
        toast({
          title: "Error updating post",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Post updated",
          description: "Your post has been updated successfully",
        });
        setIsDialogOpen(false);
        fetchPosts(user.id);
      }
    } else {
      const { error } = await supabase
        .from("posts")
        .insert(postData);

      if (error) {
        toast({
          title: "Error creating post",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Post created",
          description: "Your post has been created successfully",
        });
        setIsDialogOpen(false);
        fetchPosts(user.id);
      }
    }

    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!postToDelete || !user) return;

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postToDelete);

    if (error) {
      toast({
        title: "Error deleting post",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully",
      });
      fetchPosts(user.id);
    }

    setDeleteDialogOpen(false);
    setPostToDelete(null);
  };

  const togglePublish = async (post: Post) => {
    if (!user) return;

    const { error } = await supabase
      .from("posts")
      .update({ published: !post.published })
      .eq("id", post.id);

    if (error) {
      toast({
        title: "Error updating post",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: post.published ? "Post unpublished" : "Post published",
        description: post.published 
          ? "Your post is now a draft" 
          : "Your post is now visible to everyone",
      });
      fetchPosts(user.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Manage Posts</h1>
              <p className="text-muted-foreground mt-1">Create, edit, and manage your blog posts</p>
            </div>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </div>

          {/* Posts List */}
          {isLoading ? (
            <LoadingRunner message="Loading your posts..." />
          ) : posts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground mb-4">You haven't created any posts yet</p>
                <Button onClick={openCreateDialog} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create your first post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {post.image && (
                      <div className="md:w-48 h-32 md:h-auto flex-shrink-0">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{post.title}</CardTitle>
                            <Badge variant={post.published ? "default" : "secondary"}>
                              {post.published ? "Published" : "Draft"}
                            </Badge>
                          </div>
                          <CardDescription className="line-clamp-2 mb-2">
                            {post.excerpt}
                          </CardDescription>
                          <div className="flex flex-wrap gap-1">
                            {post.categories?.map((cat, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePublish(post)}
                            title={post.published ? "Unpublish" : "Publish"}
                          >
                            {post.published ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(post)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setPostToDelete(post.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Created: {new Date(post.created_at).toLocaleDateString()}
                        {post.location && ` • ${post.location}`}
                        {post.read_time && ` • ${post.read_time}`}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
            <DialogDescription>
              {editingPost ? "Update your post details" : "Fill in the details for your new post"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter post title"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Enter post subtitle"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief description of your post"
                rows={2}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Cover Image URL</Label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="categories">Categories</Label>
                <Input
                  id="categories"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  placeholder="Adventure, Hiking"
                />
                <p className="text-xs text-muted-foreground">Comma-separated</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Swiss Alps, Switzerland"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="readTime">Read Time</Label>
                <Input
                  id="readTime"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="5 min read"
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Content (JSON)</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder='[{"type": "intro", "content": "Your intro text..."}]'
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                JSON array of content sections (intro, text, quote, image-left, image-right, etc.)
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingPost ? "Update Post" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your post
              and all associated comments and likes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ManagePosts;
