import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";

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
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80"
    ]
  }
];

const BlogPost = () => {
  const { id } = useParams();
  const post = blogPosts.find((p) => p.id === Number(id));

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
        <div className="absolute inset-0">
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
          <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 mb-12 border border-border/50">
            <p className="text-xl text-foreground leading-relaxed italic">
              {post.excerpt}
            </p>
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
                  className="relative overflow-hidden rounded-xl aspect-video group"
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

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 rounded-2xl p-12 text-center border border-border/50">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your Adventure?
            </h3>
            <p className="text-muted-foreground mb-8 text-lg">
              Explore more inspiring stories and guides from the mountains
            </p>
            <Link to="/blog">
              <Button size="lg" className="font-semibold">
                View All Posts
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
