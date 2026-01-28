import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { differenceInDays } from "date-fns";
import { useState, useEffect } from "react";
import LoadingRunner from "@/components/LoadingRunner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  created_at: string;
  categories: string[] | null;
  image: string | null;
}

const Blog = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, excerpt, created_at, categories, image")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data || []);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []);

  const isRecentPost = (dateString: string) => {
    try {
      const postDate = new Date(dateString);
      const today = new Date();
      return differenceInDays(today, postDate) <= 6 && differenceInDays(today, postDate) >= 0;
    } catch {
      return false;
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Mountain Stories
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of adventures, guides, and inspiration from the peaks
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {isLoading ? (
            <LoadingRunner message="Loading posts..." />
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No posts published yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={post.image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {isRecentPost(post.created_at) && (
                          <Badge className="bg-accent text-accent-foreground">
                            New
                          </Badge>
                        )}
                        {post.categories?.map((category, index) => (
                          <Badge key={index} className="bg-primary text-primary-foreground">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {formatDate(post.created_at)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/80">{post.excerpt}</p>
                      <span className="mt-4 inline-block text-primary hover:text-primary/80 font-medium transition-colors">
                        Read More →
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
