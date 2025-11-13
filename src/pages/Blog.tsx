import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const blogPosts = [
  {
    id: 1,
    title: "Exploring the Alpine Peaks",
    excerpt: "Discover the breathtaking beauty of mountain ranges and learn essential tips for your next alpine adventure.",
    date: "March 15, 2024",
    categories: ["Adventure", "Hiking"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
  },
  {
    id: 2,
    title: "Mountain Photography Guide",
    excerpt: "Master the art of capturing stunning mountain landscapes with these professional photography techniques.",
    date: "March 10, 2024",
    categories: ["Photography", "Adventure"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
  },
  {
    id: 3,
    title: "Best Hiking Trails for Beginners",
    excerpt: "Start your hiking journey with these beginner-friendly trails that offer spectacular mountain views.",
    date: "March 5, 2024",
    categories: ["Hiking", "Adventure"],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"
  },
  {
    id: 4,
    title: "Sustainable Mountain Tourism",
    excerpt: "Learn how to explore mountains responsibly and minimize your environmental impact.",
    date: "February 28, 2024",
    categories: ["Environment", "Hiking"],
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80"
  },
  {
    id: 5,
    title: "Winter Mountain Safety Tips",
    excerpt: "Essential safety guidelines for winter mountain adventures and cold weather hiking.",
    date: "February 20, 2024",
    categories: ["Safety", "Adventure"],
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80"
  },
  {
    id: 6,
    title: "Mountain Wellness Retreats",
    excerpt: "Rejuvenate your mind and body with peaceful mountain retreats focused on wellness and tranquility.",
    date: "February 15, 2024",
    categories: ["Wellness", "Hiking"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
  }
];

const Blog = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-background via-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
            Mountain Stories
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Explore our collection of adventures, guides, and inspiration from the peaks
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      {post.categories.map((category, index) => (
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
                      {post.date}
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
        </div>
      </section>
    </div>
  );
};

export default Blog;
