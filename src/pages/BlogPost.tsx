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
import {useAuthUser } from "@/hooks/useAuth";
import { usePostQuery , usePostSlugQuery , usePostsAddCommentMutation, usePostLikeMutations  } from "@/hooks/usePosts";
import { CommentToSend , LikeDto} from "@/components/api/postAPI";
import {  format } from "date-fns";

const BlogPost = () => {
  const { slug } = useParams();
  const { id } = useParams();// nie uzywane. tylko dla like, comment

  const addCommentMutation = usePostsAddCommentMutation();
  const { data: post, isLoading, isError } = usePostSlugQuery(String(slug));
  console.log('onepost: ', post);

  const { data: userProfile } = useAuthUser();
  const [newComment, setNewComment] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const allImages = post ? [post.featuredImage, ...post.galleryImages] : [];
  const currentUserId = userProfile?.userName;
  const { addLikeMutation, removeLikeMutation } = usePostLikeMutations(
        String(slug), 
        post?.id || 0, 
        currentUserId
    );

  const likesCount = post?.likes?.length || 0;
  const isLiked = post?.likes?.some(l => l.userId === currentUserId) || false;
  //console.log("currentUserId",post?.likes[0]?.userId);  
  console.log("isLiked",isLiked);
  

  const handleLike = async () => {
        if (!userProfile || !post?.id) { /* toast i return */ return; }

        const likeData: LikeDto = {
            postId: post.id,
            userId:userProfile.userName

        }  

        if (isLiked) {
            removeLikeMutation.mutate(likeData);
        } else {
            addLikeMutation.mutate(likeData);
        }
    };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("post: ",post);
    if (!post.id || !newComment.trim()) return; 

    const commentData: CommentToSend = {
        // 💡 Zakładamy, że userProfile ma pole ID, którego używamy jako authorId
        authorId: userProfile.userName, // Dostosuj do struktury Twojego userProfile!
        content: newComment.trim(),
        postId: post.id,
    };

    // Wywołaj mutację
    addCommentMutation.mutate(commentData, {
        onSuccess: () => {
            // Wyczyść pole po udanej mutacji (toast jest obsługiwany w hooku)
            setNewComment(""); 
        }
        // onError jest obsługiwany w hooku
    });
   
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
  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center text-lg text-muted-foreground">
        Loading blog posts...
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500">
        Failed to load blog posts.
      </div>
    );
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section with Large Image */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 cursor-pointer" onClick={() => openLightbox(0)}>
          <img 
            src={post.featuredImage} 
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
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.postTags.map((category, index) => (
              <Badge key={index} className="bg-primary text-primary-foreground">
                {category}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 drop-shadow-lg">
            {post.title}
          </h1>
          
          <p className="text-muted-foreground text-lg">{format(post.createdAt,"yyy-MM-dd")}</p>
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
            {isLoading ? (
              <div className="animate-pulse flex items-center gap-2">
                <div className="w-7 h-7 bg-muted rounded-full" />
                <div className="w-16 h-4 bg-muted rounded" />
              </div>
            ) : (
              <button
                onClick={handleLike}
                className={`group flex items-center gap-2 transition-all hover:scale-110 ${!userProfile ? 'cursor-not-allowed opacity-70' : ''}`}
                title={!userProfile ? 'Login required to like' : (isLiked ? 'Unlike this post' : 'Like this post')}
              >
                <Heart
                  className={`w-7 h-7 transition-all ${
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : userProfile 
                        ? "text-muted-foreground group-hover:text-red-500"
                        : "text-muted-foreground/50"
                  }`}
                />
                <span className="text-sm font-medium">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
              </button>
            )}
            {!userProfile && !isLoading && (
              <span className="text-xs text-muted-foreground">
                <Link to="/auth" className="text-primary hover:underline">Login</Link> to like
              </span>
            )}
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
              {post.galleryImages.map((image, index) => (
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
                placeholder={userProfile ? "Write a comment..." : "Login to comment"}
                disabled={!userProfile }
                className="min-h-[120px] resize-none"
              />
              <Button type="submit" disabled={!userProfile } className="gap-2">
                <Send className="w-4 h-4" />
                Post Comment
              </Button>
              {!userProfile && (
                <p className="text-sm text-muted-foreground">
                  Please <Link to="/auth" className="text-primary hover:underline">login</Link> to leave a comment
                </p>
              )}
            </form>

            {/* Comments List */}
            <div className="space-y-6">
              {post.comments.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50">
                  <p className="text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              ) : (
                post.comments.map((comment) => (
                  <div
                    key={comment.createdAt}
                    className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-xl border border-primary/10 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">
                          {comment.authorId.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm text-foreground">
                            {comment.authorId}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
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
