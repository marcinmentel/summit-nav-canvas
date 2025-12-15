import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, KeyRound, Save } from "lucide-react";
import {useAuthUser, useAuthUpdateDiplayName  } from "@/hooks/useAuth";



const Profile = () => {
//   const [user, setUser] = useState<SupabaseUser | null>(null);
//   const [displayName, setDisplayName] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPasswordLoading, setIsPasswordLoading] = useState(false);
//   const [isGoogleUser, setIsGoogleUser] = useState(false);
//   const navigate = useNavigate();
 const { toast } = useToast();
 const { data: userProfile } = useAuthUser();
 const updateDisplayNameMutation = useAuthUpdateDiplayName();
 const isGoogleUser = userProfile?.loginProvider == "Google" ? true : false;
 const [displayName, setDisplayName] = useState("");
 useEffect(() => {
    if (userProfile?.displayName) {
      setDisplayName(userProfile.displayName);
    }
  }, [userProfile?.displayName]); // Zależność od userProfile.displayName

 const handleUpdateName = async () => {
    // Sprawdzenie czy nazwa jest inna od obecnej
    if (displayName === userProfile?.displayName) {
        toast({
            title: "Info",
            description: "Display Name is already up to date.",
        });
        return;
    }

    // Sprawdzenie czy pole jest puste
    if (!displayName.trim()) {
         toast({
            title: "Error",
            description: "Display Name cannot be empty.",
            variant: "destructive",
        });
        return;
    }
    console.log("DIsplayNmae: ",displayName);
    //2. Wywołanie mutacji z nową nazwą
    updateDisplayNameMutation.mutate(displayName, {
        onSuccess: () => {
            // Toast o sukcesie jest już obsłużony w useAuthUpdateDiplayName
            // ale możesz go dodać tutaj, jeśli chcesz.
             toast({
                title: "Success",
                description: "Your name has been updated.",
            });
        },
        onError: (error) => {
            // Obsługa błędów, jeśli nie jest obsłużona w useAuthUpdateDiplayName
            console.error("Błąd aktualizacji nazwy:", error);
            toast({
                title: "Error",
                description: "Failed to update name. Please try again.",
                variant: "destructive",
            });
        },
    });
  };

  const handleResetPassword = async () => {
    // if (!user?.email) return;
    
    // setIsPasswordLoading(true);
    // const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
    //   redirectTo: `${window.location.origin}/auth`,
    // });

    // setIsPasswordLoading(false);

    // if (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to send reset email. Please try again.",
    //     variant: "destructive",
    //   });
    // } else {
    //   toast({
    //     title: "Email Sent",
    //     description: "Check your inbox for the password reset link.",
    //   });
    // }
  };

  if (!userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-xl mx-auto space-y-6">
          
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userProfile.email || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                />
              </div>

              <Button 
                onClick={handleUpdateName} 
                //disabled={isLoading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {false ? "Saving..." : "Save Name"}
              </Button>
            </CardContent>
          </Card>

          {/* Password Reset Card - Only for email/password users */}
          {!isGoogleUser && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-5 w-5" />
                  Password
                </CardTitle>
                <CardDescription>
                  Reset your password via email
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleResetPassword}
                  //disabled={isPasswordLoading}
                  variant="outline"
                  className="w-full"
                >
                  {false ? "Sending..." : "Send Password Reset Email"}
                </Button>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;