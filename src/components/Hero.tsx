import { ArrowRight, Mountain } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <img
          src="https://poweredbytrailstorage.blob.core.windows.net/pbtgallery/Background.JPEG"
          alt="Mountain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Embrace the
            <span className="block bg-gradient-to-r from-trail-green via-trail-brown to-trail-blue bg-clip-text text-transparent">
              Mountain Spirit
            </span>
          </h1>

          <div className="max-w-2xl mx-auto">
            <blockquote className="text-xl text-foreground/70 leading-relaxed italic">
              "Of all the paths you take in life, make sure a few of them are dirt. "
            </blockquote>
            <p className="text-lg text-foreground/60 mt-4">— John Muir</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center ">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground group">
              Hit the trail
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative mountain shapes */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
