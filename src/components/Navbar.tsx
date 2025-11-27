import { useState, useEffect } from "react";
import { Menu, X, Mountain, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {useCurrentUser} from "@/hooks/useAuth";
//import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  //const [user, setUser] = useState(null);
  //const [userProfile, setUserProfile] = useState<{ display_name: string } | null>(null);
  const navigate = useNavigate();

  const { data: userProfile, isLoading, isError } = useCurrentUser();
  //const { user, isLoggedIn, isLoading } = useCurrentUser();
  console.log("getuser");
  console.log(userProfile?.displayName);

  // useEffect(() => {
  //   const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  //     setUser(session?.user ?? null);
  //     if (session?.user) {
  //       fetchUserProfile(session.user.id);
  //     } else {
  //       setUserProfile(null);
  //     }
  //   });

  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setUser(session?.user ?? null);
  //     if (session?.user) {
  //       fetchUserProfile(session.user.id);
  //     }
  //   });

  //   return () => subscription.unsubscribe();
  // }, []);
  // const fetchUserProfile = async (userId: string) => {
  //   const { data, error } = await supabase
  //     .from("profiles")
  //     .select("display_name")
  //     .eq("user_id", userId)
  //     .maybeSingle();

  //   if (!error && data) {
  //     setUserProfile(data);
  //   }
  // };
  const handleSignOut = async () => {
    //await supabase.auth.signOut();
    navigate("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src= "https://poweredbytrailstorage.blob.core.windows.net/pbtgallery/ICON300.png"
              alt="PBT icon"
              className="h-8 w-8" />
             <span className="text-xl font-bold bg-gradient-to-r from-trail-green via-trail-brown to-trail-blue bg-clip-text  text-transparent">
                Powered By Trail
              </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
            
            <ThemeToggle />
            
            {userProfile ? (
               <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {userProfile?.displayName?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{userProfile?.displayName || "User"}</span>
                </div>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-2 space-y-2">
              <ThemeToggle />
              
              {userProfile ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {userProfile?.displayName?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{userProfile?.displayName || "User"}</span>
                  </div>
                  <Button onClick={handleSignOut} variant="outline" size="sm" className="w-full">
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="w-full">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
