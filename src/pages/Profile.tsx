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
import {useAuthUser  } from "@/hooks/useAuth";



const Profile = () => {
//   const [user, setUser] = useState<SupabaseUser | null>(null);
//   const [displayName, setDisplayName] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPasswordLoading, setIsPasswordLoading] = useState(false);
//   const [isGoogleUser, setIsGoogleUser] = useState(false);
//   const navigate = useNavigate();
//   const { toast } = useToast();
 const { data: userProfile } = useAuthUser();
 const isGoogleUser = userProfile?.loginProvider == "Google" ? true : false;
  

  const handleUpdateName = async () => {
    // if (!user) return;
    
    // setIsLoading(true);
    // const { error } = await supabase
    //   .from("profiles")
    //   .update({ display_name: displayName })
    //   .eq("user_id", user.id);

    // setIsLoading(false);

    // if (error) {
    //   toast({
    //     title: "Error",
    //     description: "Failed to update name. Please try again.",
    //     variant: "destructive",
    //   });
    // } else {
    //   toast({
    //     title: "Success",
    //     description: "Your name has been updated.",
    //   });
    // }
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
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </CardTitle>
              <CardDescription>
                Manage your account details
              </CardDescription>
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
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={userProfile.displayName}
                  //onChange={(e) => setDisplayName(e.target.value)}
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

          {isGoogleUser && (
            <Card className="border-muted">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground text-center">
                  You signed in with Google. Password management is handled by your Google account.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;