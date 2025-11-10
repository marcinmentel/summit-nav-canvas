import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Send, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { usePostQuery } from "@/hooks/usePosts";
const blogPosts = [
  {
    id: 1,
    title: "Exploring the Alpine Peaks",
    excerpt: "Discover the breathtaking beauty of mountain ranges and learn essential tips for your next alpine adventure.",
    date: "March 15, 2024",
    category: "Adventure",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    content: `The Alpine peaks have captivated adventurers for centuries with their majestic beauty and challenging terrain. Standing atop these magnificent mountains offers a perspective that transforms how we see the world and ourselves.

    In this comprehensive guide, we'll explore what makes alpine adventures so special and how you can prepare for your own journey into these breathtaking landscapes.`,
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"
    ]
  },
  {
    id: 2,
    title: "Mountain Photography Guide",
    excerpt: "Master the art of capturing stunning mountain landscapes with these professional photography techniques.",
    date: "March 10, 2024",
    category: "Photography",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    content: `Capturing the perfect mountain photograph requires more than just pointing your camera at a beautiful view. It's about understanding light, composition, and the unique challenges that high-altitude environments present.

    From golden hour magic to dramatic storm clouds, mountain photography offers endless opportunities for stunning imagery that tells a story.`,
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"
    ]
  },
  {
    id: 3,
    title: "Best Hiking Trails for Beginners",
    excerpt: "Start your hiking journey with these beginner-friendly trails that offer spectacular mountain views.",
    date: "March 5, 2024",
    category: "Hiking",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    content: `Starting your hiking journey doesn't mean you have to miss out on spectacular views. These carefully selected beginner trails offer the perfect introduction to mountain hiking while showcasing some of nature's most beautiful landscapes.

    Each trail has been chosen for its accessibility, safety features, and rewarding views that will inspire you to continue your hiking adventures.`,
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80"
    ]
  },
  {
    id: 4,
    title: "Sustainable Mountain Tourism",
    excerpt: "Learn how to explore mountains responsibly and minimize your environmental impact.",
    date: "February 28, 2024",
    category: "Environment",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
    content: `Our mountains are precious ecosystems that require careful stewardship. Sustainable mountain tourism isn't just a trend—it's a responsibility we all share to preserve these natural wonders for future generations.

    By following simple guidelines and making conscious choices, every visitor can contribute to protecting the fragile alpine environment while still enjoying incredible experiences.`,
    gallery: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
    ]
  },
  {
    id: 5,
    title: "Winter Mountain Safety Tips",
    excerpt: "Essential safety guidelines for winter mountain adventures and cold weather hiking.",
    date: "February 20, 2024",
    category: "Safety",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
    content: `Winter transforms mountains into pristine wonderlands, but these beautiful conditions come with serious challenges that demand respect and preparation. Understanding winter mountain safety is crucial for anyone venturing into snowy alpine environments.

    From avalanche awareness to proper layering techniques, this guide covers the essential knowledge you need to stay safe while enjoying winter mountain adventures.`,
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
    ]
  },
  {
    id: 6,
    title: "Mountain Wellness Retreats",
    excerpt: "Rejuvenate your mind and body with peaceful mountain retreats focused on wellness and tranquility.",
    date: "February 15, 2024",
    category: "Wellness",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    content: `In our fast-paced world, mountain wellness retreats offer a sanctuary for restoration and self-discovery. The combination of fresh alpine air, serene landscapes, and mindful practices creates the perfect environment for deep relaxation and renewal.

    These retreats blend the healing power of nature with expert guidance in wellness practices, offering a transformative experience that stays with you long after you return to daily life.`,
    gallery: [
      "https://poweredazureblob.blob.core.windows.net/photocontainer/IMG_2012_800x600.jpeg",
      "https://poweredazureblob.blob.core.windows.net/photocontainer/IMG_5233_800x600.jpeg",
      "https://poweredazureblob.blob.core.windows.net/photocontainer/IMG_4325_800x600.jpeg",
      "https://poweredazureblob.blob.core.windows.net/photocontainer/IMG_5184_800x600.jpeg",
      "https://poweredazureblob.blob.core.windows.net/photocontainer/IMG_1971_800x600.jpeg",
      "https://poweredazureblob.blob.core.windows.net/photocontainer/IMG_2273_800x600.jpeg",
      "https://poweredazureblob.blob.core.windows.net/photocontainer/IMG_5265_800x600.jpeg"
    ]
  }
];

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === Number(id));
  const { data: onepost, isLoading, isError } = usePostQuery(Number(id));
  console.log('onepost: ', onepost);

  const { toast } = useToast();
  
  const [user, setUser] = useState<any>(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Combine hero image and gallery images
  const allImages = post ? [post.image, ...post.gallery] : [];

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (id) {
      fetchLikes();
      fetchComments();
    }
  }, [id, user]);

  const fetchLikes = async () => {
    const { count } = await supabase
      .from("post_likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", id);
    
    setLikes(count || 0);

    if (user) {
      const { data } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      
      setIsLiked(!!data);
    }
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from("post_comments")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: false });
    
    setComments(data || []);
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to like posts",
        variant: "destructive",
      });
      return;
    }

    if (isLiked) {
      await supabase
        .from("post_likes")
        .delete()
        .eq("post_id", id)
        .eq("user_id", user.id);
      setIsLiked(false);
      setLikes(likes - 1);
    } else {
      await supabase
        .from("post_likes")
        .insert({ post_id: id, user_id: user.id });
      setIsLiked(true);
      setLikes(likes + 1);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from("post_comments")
      .insert({
        post_id: id,
        user_id: user.id,
        content: newComment.trim(),
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    } else {
      setNewComment("");
      fetchComments();
      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    }
    setIsSubmitting(false);
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  if (!post) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Post Not Found</h1>
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Large Image */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 cursor-pointer" onClick={() => openLightbox(0)}>
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        <div className="relative container mx-auto max-w-4xl h-full flex flex-col justify-end px-4 pb-16">
          <Link to="/blog" className="mb-8">
            <Button variant="outline" className="backdrop-blur-sm bg-background/80">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
          
          <Badge className="w-fit mb-4 bg-primary text-primary-foreground">
            {post.category}
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 drop-shadow-lg">
            {post.title}
          </h1>
          
          <p className="text-muted-foreground text-lg">{post.date}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Excerpt */}
          <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 mb-8 border border-border/50">
            <p className="text-xl text-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          {/* Likes Section */}
          <div className="flex items-center gap-4 py-6 mb-12 border-y border-border/50">
            <button
              onClick={handleLike}
              className="group flex items-center gap-2 transition-all hover:scale-110"
            >
              <Heart
                className={`w-7 h-7 transition-all ${
                  isLiked
                    ? "fill-red-500 text-red-500"
                    : "text-muted-foreground group-hover:text-red-500"
                }`}
              />
              <span className="text-sm font-medium">{likes} {likes === 1 ? 'like' : 'likes'}</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none mb-16">
            {post.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-foreground/90 leading-relaxed mb-6 text-lg">
                {paragraph.trim()}
              </p>
            ))}
          </div>

          {/* Gallery Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Gallery</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {post.gallery.map((image, index) => (
                <div 
                  key={index} 
                  className="relative overflow-hidden rounded-xl aspect-video group cursor-pointer"
                  onClick={() => openLightbox(index + 1)}
                >
                  <img 
                    src={image} 
                    alt={`${post.title} gallery ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground">Comments</h2>
            
            {/* Add Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={user ? "Write a comment..." : "Login to comment"}
                disabled={!user || isSubmitting}
                className="min-h-[120px] resize-none"
              />
              <Button type="submit" disabled={!user || isSubmitting || !newComment.trim()} className="gap-2">
                <Send className="w-4 h-4" />
                Post Comment
              </Button>
              {!user && (
                <p className="text-sm text-muted-foreground">
                  Please <Link to="/auth" className="text-primary hover:underline">login</Link> to leave a comment
                </p>
              )}
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50">
                  <p className="text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-xl border border-primary/10 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">
                          {comment.user_id.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm text-foreground">Anonymous User</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <p className="text-foreground/80 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Previous button */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            {/* Image */}
            <img
              src={allImages[currentImageIndex]}
              alt={`${post.title} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Next button */}
            <button
              onClick={goToNext}
              className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <span className="text-white text-sm font-medium">
                {currentImageIndex + 1} / {allImages.length}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogPost;
