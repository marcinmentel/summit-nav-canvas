import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, Send, ChevronLeft, ChevronRight, X, Clock, User, Quote, MapPin, Camera, Mountain, Compass } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import LoadingRunner from "@/components/LoadingRunner";
import { Separator } from "@/components/ui/separator";

const blogPosts = [
  {
    id: 1,
    title: "Exploring the Alpine Peaks",
    subtitle: "A Journey Through Europe's Most Majestic Mountain Ranges",
    excerpt: "Discover the breathtaking beauty of mountain ranges and learn essential tips for your next alpine adventure.",
    date: "March 15, 2024",
    readTime: "8 min read",
    author: "Alex Thompson",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
    location: "Swiss Alps, Switzerland",
    categories: ["Adventure", "Hiking"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
    sections: [
      {
        type: "intro",
        content: "The Alpine peaks have captivated adventurers for centuries with their majestic beauty and challenging terrain. Standing atop these magnificent mountains offers a perspective that transforms how we see the world and ourselves. In this comprehensive guide, we'll explore what makes alpine adventures so special and how you can prepare for your own journey into these breathtaking landscapes."
      },
      {
        type: "image-left",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
        title: "The Call of the Mountains",
        content: "There's something primal about the way mountains call to us. Perhaps it's the challenge they represent, or maybe it's the promise of views that few will ever witness. The Alps, spanning eight countries across Europe, offer some of the most accessible yet awe-inspiring mountain experiences in the world. From gentle meadow walks to technical climbing routes, there's an adventure waiting for every skill level."
      },
      {
        type: "quote",
        quote: "The mountains are calling and I must go.",
        author: "John Muir"
      },
      {
        type: "image-right",
        image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
        title: "Essential Preparation",
        content: "Before embarking on any alpine adventure, proper preparation is essential. This means not only physical conditioning but also understanding the unique challenges that high-altitude environments present. Weather can change rapidly in the mountains, temperatures can drop significantly, and navigation becomes crucial when visibility is reduced. Investing in quality gear and taking the time to learn basic mountaineering skills can make the difference between a memorable adventure and a dangerous situation."
      },
      {
        type: "stats",
        stats: [
          { value: "4,808m", label: "Mont Blanc Height" },
          { value: "8", label: "Countries Spanned" },
          { value: "1,200km", label: "Alpine Arc Length" },
          { value: "82", label: "Peaks Over 4,000m" }
        ]
      },
      {
        type: "full-width-image",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&q=80",
        caption: "Sunrise over the Matterhorn, one of the most iconic peaks in the Alps"
      },
      {
        type: "text",
        title: "The Best Time to Visit",
        content: "The Alps offer different experiences throughout the year. Summer months (June to September) provide the best conditions for hiking and climbing, with longer days and more predictable weather. Spring brings blooming wildflowers and fewer crowds, while autumn offers spectacular foliage and crisp, clear days. Winter transforms the landscape into a snow-covered wonderland, perfect for skiing and snowshoeing adventures."
      },
      {
        type: "tips",
        title: "Pro Tips for Your Alpine Adventure",
        tips: [
          "Start your hikes early in the morning to avoid afternoon thunderstorms",
          "Always carry layers – mountain weather can change in minutes",
          "Invest in quality hiking boots with ankle support",
          "Stay hydrated – you lose more water at altitude than you realize",
          "Respect the environment and follow Leave No Trace principles"
        ]
      },
      {
        type: "image-grid",
        images: [
          { src: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&q=80", alt: "Alpine meadow" },
          { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80", alt: "Mountain peaks" },
          { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", alt: "Sunset view" },
          { src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&q=80", alt: "Trail path" }
        ]
      },
      {
        type: "conclusion",
        content: "Whether you're seeking physical challenge, spiritual renewal, or simply the joy of being immersed in nature's grandeur, the Alpine peaks offer an experience unlike any other. Each summit reached, each trail conquered, becomes a part of your story – a reminder of what we're capable of when we push beyond our comfort zones. The mountains await. Will you answer their call?"
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"
    ]
  },
  {
    id: 2,
    title: "Mountain Photography Guide",
    subtitle: "Capture Stunning Landscapes Like a Professional",
    excerpt: "Master the art of capturing stunning mountain landscapes with these professional photography techniques.",
    date: "March 10, 2024",
    readTime: "12 min read",
    author: "Sarah Chen",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    location: "Dolomites, Italy",
    categories: ["Photography", "Adventure"],
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80",
    sections: [
      {
        type: "intro",
        content: "Capturing the perfect mountain photograph requires more than just pointing your camera at a beautiful view. It's about understanding light, composition, and the unique challenges that high-altitude environments present. From golden hour magic to dramatic storm clouds, mountain photography offers endless opportunities for stunning imagery that tells a story."
      },
      {
        type: "image-left",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        title: "Understanding Mountain Light",
        content: "Light in the mountains behaves differently than at sea level. The thinner atmosphere means more intense sunlight during the day, but also creates more dramatic color during golden hour. Plan your shoots around sunrise and sunset for the most spectacular results. The 'blue hour' just before sunrise offers particularly magical opportunities for moody, atmospheric shots."
      },
      {
        type: "quote",
        quote: "Photography is the story I fail to put into words.",
        author: "Destin Sparks"
      },
      {
        type: "image-right",
        image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
        title: "Composition Techniques",
        content: "Use leading lines like trails, rivers, or ridgelines to guide the viewer's eye through your image. The rule of thirds works beautifully in mountain photography – place your horizon on the upper or lower third line depending on whether the sky or foreground is more interesting. Don't forget to include elements in the foreground to add depth and scale to your images."
      },
      {
        type: "stats",
        stats: [
          { value: "f/11", label: "Ideal Aperture" },
          { value: "ISO 100", label: "Base Sensitivity" },
          { value: "24mm", label: "Wide Angle Sweet Spot" },
          { value: "4:30am", label: "Golden Hour Wake-up" }
        ]
      },
      {
        type: "full-width-image",
        image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&q=80",
        caption: "Long exposure shot capturing the movement of clouds over alpine peaks"
      },
      {
        type: "tips",
        title: "Essential Gear for Mountain Photography",
        tips: [
          "A sturdy tripod that can handle wind – carbon fiber is ideal",
          "Graduated ND filters for balancing bright skies with darker foregrounds",
          "Extra batteries – cold temperatures drain them quickly",
          "Lens cleaning kit for removing dust and moisture",
          "A weather-sealed camera body or rain cover for unpredictable conditions"
        ]
      },
      {
        type: "image-grid",
        images: [
          { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", alt: "Mountain sunrise" },
          { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80", alt: "Dramatic peaks" },
          { src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&q=80", alt: "Alpine lake reflection" },
          { src: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&q=80", alt: "Snow-capped mountains" }
        ]
      },
      {
        type: "conclusion",
        content: "Mountain photography is as much about patience and persistence as it is about technical skill. The perfect shot often requires multiple visits, early mornings, and the willingness to wait for conditions to align. But when everything comes together – the light, the composition, the moment – you'll capture something truly extraordinary that conveys the majesty these landscapes inspire."
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80"
    ]
  },
  {
    id: 3,
    title: "Best Hiking Trails for Beginners",
    subtitle: "Start Your Mountain Journey with Confidence",
    excerpt: "Start your hiking journey with these beginner-friendly trails that offer spectacular mountain views.",
    date: "March 5, 2024",
    readTime: "6 min read",
    author: "Mike Rodriguez",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    location: "Rocky Mountains, Colorado",
    categories: ["Hiking", "Adventure"],
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&q=80",
    sections: [
      {
        type: "intro",
        content: "Starting your hiking journey doesn't mean you have to miss out on spectacular views. These carefully selected beginner trails offer the perfect introduction to mountain hiking while showcasing some of nature's most beautiful landscapes. Each trail has been chosen for its accessibility, safety features, and rewarding views that will inspire you to continue your hiking adventures."
      },
      {
        type: "image-left",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
        title: "Choosing Your First Trail",
        content: "When selecting your first mountain trail, consider factors like elevation gain, trail length, and terrain type. Look for well-marked trails with gradual inclines and good footing. Many national parks offer 'easy' rated trails that still provide stunning scenery without overwhelming physical demands."
      },
      {
        type: "quote",
        quote: "Every mountain top is within reach if you just keep climbing.",
        author: "Barry Finlay"
      },
      {
        type: "stats",
        stats: [
          { value: "2-4 mi", label: "Ideal First Hike" },
          { value: "500ft", label: "Beginner Elevation Gain" },
          { value: "2-3 hrs", label: "Average Duration" },
          { value: "10 items", label: "Essential Gear List" }
        ]
      },
      {
        type: "tips",
        title: "Beginner Hiking Essentials",
        tips: [
          "Start with shorter hikes and gradually increase distance",
          "Check weather conditions before heading out",
          "Bring more water than you think you'll need",
          "Wear layers and pack rain protection",
          "Tell someone your hiking plans and expected return time"
        ]
      },
      {
        type: "image-grid",
        images: [
          { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", alt: "Mountain trail" },
          { src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&q=80", alt: "Forest path" },
          { src: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&q=80", alt: "Scenic overlook" },
          { src: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80", alt: "Valley view" }
        ]
      },
      {
        type: "conclusion",
        content: "Remember, every experienced hiker started exactly where you are now. The key is to begin, stay safe, and let the mountains inspire you. With each hike, you'll build confidence, fitness, and a deeper connection with nature."
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80"
    ]
  },
  {
    id: 4,
    title: "Sustainable Mountain Tourism",
    subtitle: "Preserving Nature for Future Generations",
    excerpt: "Learn how to explore mountains responsibly and minimize your environmental impact.",
    date: "February 28, 2024",
    readTime: "7 min read",
    author: "Emma Green",
    authorImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    location: "Patagonia, Chile",
    categories: ["Environment", "Hiking"],
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1600&q=80",
    sections: [
      {
        type: "intro",
        content: "Our mountains are precious ecosystems that require careful stewardship. Sustainable mountain tourism isn't just a trend—it's a responsibility we all share to preserve these natural wonders for future generations. By following simple guidelines and making conscious choices, every visitor can contribute to protecting the fragile alpine environment while still enjoying incredible experiences."
      },
      {
        type: "quote",
        quote: "Take only memories, leave only footprints.",
        author: "Chief Seattle"
      },
      {
        type: "tips",
        title: "Leave No Trace Principles",
        tips: [
          "Pack out all trash, including biodegradable items like fruit peels",
          "Stay on designated trails to prevent erosion",
          "Camp at least 200 feet from lakes and streams",
          "Observe wildlife from a distance – never feed animals",
          "Be considerate of other visitors and respect quiet hours"
        ]
      },
      {
        type: "image-grid",
        images: [
          { src: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80", alt: "Pristine wilderness" },
          { src: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&q=80", alt: "Mountain ecosystem" },
          { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80", alt: "Protected landscape" },
          { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", alt: "Natural beauty" }
        ]
      },
      {
        type: "conclusion",
        content: "Sustainable tourism is about making choices that allow future generations to experience the same wonder we feel today. Every small action counts – from choosing eco-friendly accommodations to supporting local conservation efforts."
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
    ]
  },
  {
    id: 5,
    title: "Winter Mountain Safety Tips",
    subtitle: "Essential Knowledge for Cold Weather Adventures",
    excerpt: "Essential safety guidelines for winter mountain adventures and cold weather hiking.",
    date: "February 20, 2024",
    readTime: "9 min read",
    author: "James Winter",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    location: "Canadian Rockies, Canada",
    categories: ["Safety", "Adventure"],
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1600&q=80",
    sections: [
      {
        type: "intro",
        content: "Winter transforms mountains into pristine wonderlands, but these beautiful conditions come with serious challenges that demand respect and preparation. Understanding winter mountain safety is crucial for anyone venturing into snowy alpine environments. From avalanche awareness to proper layering techniques, this guide covers the essential knowledge you need to stay safe while enjoying winter mountain adventures."
      },
      {
        type: "image-left",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
        title: "Avalanche Awareness",
        content: "Understanding avalanche terrain is crucial for winter mountain safety. Always check local avalanche forecasts before heading out, learn to recognize avalanche-prone slopes, and consider taking an avalanche safety course. Carry essential rescue equipment including a beacon, probe, and shovel."
      },
      {
        type: "stats",
        stats: [
          { value: "-20°C", label: "Prepare for Cold" },
          { value: "3 layers", label: "Clothing System" },
          { value: "15 min", label: "Frostbite Risk" },
          { value: "4 hrs", label: "Daylight Planning" }
        ]
      },
      {
        type: "tips",
        title: "Winter Safety Essentials",
        tips: [
          "Layer clothing properly: base, insulation, and shell layers",
          "Carry emergency shelter and fire-starting materials",
          "Know the signs of hypothermia and frostbite",
          "Plan for shorter daylight hours",
          "Always travel with a partner in winter conditions"
        ]
      },
      {
        type: "conclusion",
        content: "Winter mountain adventures offer unique rewards, but they require careful preparation and respect for the conditions. By prioritizing safety and building your skills gradually, you can enjoy the magical beauty of snow-covered peaks while minimizing risks."
      }
    ],
    gallery: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80"
    ]
  },
  {
    id: 6,
    title: "Mountain Wellness Retreats",
    subtitle: "Finding Peace and Renewal in Nature",
    excerpt: "Rejuvenate your mind and body with peaceful mountain retreats focused on wellness and tranquility.",
    date: "February 15, 2024",
    readTime: "5 min read",
    author: "Luna Martinez",
    authorImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    location: "Himalayas, Nepal",
    categories: ["Wellness", "Adventure"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
    sections: [
      {
        type: "intro",
        content: "In our fast-paced world, mountain wellness retreats offer a sanctuary for restoration and self-discovery. The combination of fresh alpine air, serene landscapes, and mindful practices creates the perfect environment for deep relaxation and renewal. These retreats blend the healing power of nature with expert guidance in wellness practices, offering a transformative experience that stays with you long after you return to daily life."
      },
      {
        type: "quote",
        quote: "In every walk with nature, one receives far more than they seek.",
        author: "John Muir"
      },
      {
        type: "image-right",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
        title: "The Healing Power of Altitude",
        content: "Mountains have long been recognized as places of spiritual significance and healing. The clean air, reduced pollution, and natural beauty create an environment conducive to meditation, reflection, and physical restoration. Many retreat centers offer yoga, meditation, and holistic therapies designed to help guests disconnect from stress and reconnect with themselves."
      },
      {
        type: "image-grid",
        images: [
          { src: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80", alt: "Peaceful meadow" },
          { src: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=600&q=80", alt: "Morning mist" },
          { src: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600&q=80", alt: "Sunset meditation" },
          { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", alt: "Alpine serenity" }
        ]
      },
      {
        type: "conclusion",
        content: "A mountain wellness retreat is an investment in your health and happiness. Whether you're seeking stress relief, physical rejuvenation, or spiritual growth, the mountains offer a powerful backdrop for transformation and renewal."
      }
    ],
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
  const { toast } = useToast();
  
  const [user, setUser] = useState<any>(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const allImages = post ? [post.image, ...post.gallery] : [];

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (id) {
      setIsLoadingData(true);
      Promise.all([fetchLikes(), fetchComments()]).finally(() => {
        setIsLoadingData(false);
      });
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
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 pt-32 px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Post Not Found</h1>
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const renderSection = (section: any, index: number) => {
    switch (section.type) {
      case "intro":
        return (
          <div key={index} className="mb-16">
            <p className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-light first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:float-left first-letter:mr-4 first-letter:mt-1">
              {section.content}
            </p>
          </div>
        );

      case "text":
        return (
          <div key={index} className="mb-16">
            {section.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 flex items-center gap-3">
                <Mountain className="w-8 h-8 text-primary" />
                {section.title}
              </h2>
            )}
            <p className="text-lg text-foreground/80 leading-relaxed">
              {section.content}
            </p>
          </div>
        );

      case "image-left":
        return (
          <div key={index} className="mb-16 grid md:grid-cols-2 gap-8 items-center">
            <div 
              className="relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer group"
              onClick={() => openLightbox(0)}
            >
              <img 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="absolute bottom-4 right-4 w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">{section.title}</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">{section.content}</p>
            </div>
          </div>
        );

      case "image-right":
        return (
          <div key={index} className="mb-16 grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold text-foreground mb-4">{section.title}</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">{section.content}</p>
            </div>
            <div 
              className="relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer group order-1 md:order-2"
              onClick={() => openLightbox(0)}
            >
              <img 
                src={section.image} 
                alt={section.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="absolute bottom-4 right-4 w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );

      case "quote":
        return (
          <div key={index} className="mb-16 relative py-12">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-transparent rounded-full" />
            <Quote className="absolute -left-2 top-8 w-12 h-12 text-primary/20 -rotate-12" />
            <blockquote className="pl-8 md:pl-12">
              <p className="text-2xl md:text-4xl font-serif italic text-foreground mb-4">
                "{section.quote}"
              </p>
              <cite className="text-lg text-muted-foreground not-italic flex items-center gap-2">
                <span className="w-8 h-px bg-primary" />
                {section.author}
              </cite>
            </blockquote>
          </div>
        );

      case "stats":
        return (
          <div key={index} className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {section.stats.map((stat: any, i: number) => (
              <div key={i} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50" />
                <div className="relative bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-2xl p-6 text-center hover:border-primary/30 transition-colors">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        );

      case "full-width-image":
        return (
          <div key={index} className="mb-16 -mx-4 md:-mx-8 lg:-mx-16">
            <div 
              className="relative aspect-[21/9] overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(0)}
            >
              <img 
                src={section.image} 
                alt={section.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              {section.caption && (
                <p className="absolute bottom-6 left-6 right-6 text-white/90 text-sm md:text-base flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  {section.caption}
                </p>
              )}
            </div>
          </div>
        );

      case "tips":
        return (
          <div key={index} className="mb-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl p-8 md:p-10 border border-primary/20">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
              <Compass className="w-8 h-8 text-primary" />
              {section.title}
            </h3>
            <ul className="space-y-4">
              {section.tips.map((tip: string, i: number) => (
                <li key={i} className="flex items-start gap-4 group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {i + 1}
                  </span>
                  <span className="text-lg text-foreground/80 pt-1">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "image-grid":
        return (
          <div key={index} className="mb-16">
            <div className="grid grid-cols-2 gap-4">
              {section.images.map((img: any, i: number) => (
                <div 
                  key={i}
                  className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group"
                  onClick={() => openLightbox(i + 1)}
                >
                  <img 
                    src={img.src} 
                    alt={img.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-white text-sm">{img.alt}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "conclusion":
        return (
          <div key={index} className="mb-16 relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl blur-2xl" />
            <div className="relative bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 md:p-10">
              <p className="text-xl md:text-2xl text-foreground leading-relaxed font-light">
                {section.content}
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 cursor-pointer" onClick={() => openLightbox(0)}>
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        </div>
        
        <div className="relative container mx-auto max-w-5xl h-full flex flex-col justify-end px-4 pb-16">
          <Link to="/blog" className="mb-8 w-fit">
            <Button variant="outline" className="backdrop-blur-md bg-background/60 hover:bg-background/80 border-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.categories.map((category, index) => (
              <Badge key={index} className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                {category}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-6 max-w-3xl">
            {post.subtitle}
          </p>
          
          {/* Author & Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-3">
              <img 
                src={post.authorImage} 
                alt={post.author}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/30"
              />
              <div>
                <p className="font-medium text-foreground">{post.author}</p>
                <p className="text-sm">{post.date}</p>
              </div>
            </div>
            <Separator orientation="vertical" className="h-8 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
            <Separator orientation="vertical" className="h-8 hidden sm:block" />
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{post.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 flex-1">
        <div className="container mx-auto max-w-4xl">
          {/* Likes Section */}
          <div className="flex items-center gap-4 py-6 mb-12 border-y border-border/50">
            {isLoadingData ? (
              <div className="animate-pulse flex items-center gap-2">
                <div className="w-7 h-7 bg-muted rounded-full" />
                <div className="w-16 h-4 bg-muted rounded" />
              </div>
            ) : (
              <button
                onClick={handleLike}
                className={`group flex items-center gap-2 transition-all hover:scale-110 ${!user ? 'cursor-not-allowed opacity-70' : ''}`}
                title={!user ? 'Login required to like' : (isLiked ? 'Unlike this post' : 'Like this post')}
              >
                <Heart
                  className={`w-7 h-7 transition-all ${
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : user 
                        ? "text-muted-foreground group-hover:text-red-500"
                        : "text-muted-foreground/50"
                  }`}
                />
                <span className="text-sm font-medium">{likes} {likes === 1 ? 'like' : 'likes'}</span>
              </button>
            )}
            {!user && !isLoadingData && (
              <span className="text-xs text-muted-foreground">
                <Link to="/auth" className="text-primary hover:underline">Login</Link> to like
              </span>
            )}
          </div>

          {/* Dynamic Sections */}
          {post.sections.map((section, index) => renderSection(section, index))}

          <Separator className="my-16" />

          {/* Comments Section */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <User className="w-8 h-8 text-primary" />
              Comments
            </h2>
            
            {/* Add Comment Form */}
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={user ? "Share your thoughts..." : "Login to comment"}
                disabled={!user || isSubmitting}
                className="min-h-[120px] resize-none bg-card/50 border-border/50 focus:border-primary/50"
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
              {isLoadingData ? (
                <LoadingRunner message="Loading comments..." />
              ) : comments.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50">
                  <p className="text-muted-foreground">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gradient-to-r from-card to-card/50 p-6 rounded-2xl border border-border/50 hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">
                          {comment.user_id.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-foreground">Anonymous User</span>
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

      <Footer />

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-background/95 backdrop-blur-xl border-none">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 rounded-full bg-background/50 hover:bg-background"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-background/50 hover:bg-background"
              onClick={goToPrevious}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-background/50 hover:bg-background"
              onClick={goToNext}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>

            <img
              src={allImages[currentImageIndex]}
              alt={`Gallery image ${currentImageIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-primary" : "bg-muted-foreground/30"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogPost;