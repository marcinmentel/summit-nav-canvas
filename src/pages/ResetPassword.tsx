import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthConfirmResetPassword } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lock, Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const passwordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    // Usuwamy isLoading, użyjemy isPending z mutacji
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const emailFromUrl = query.get("email") || "";
  const tokenFromUrl = query.get("token") ? decodeURIComponent(query.get("token")!) : "";

    // 🚨 2. UŻYCIE MUTACJI
    const resetMutation = useAuthConfirmResetPassword();
    const isLoading = resetMutation.isPending;

    // 🚨 3. WALIDACJA WEJŚCIOWA
    useEffect(() => {
        if (!emailFromUrl || !tokenFromUrl) {
             toast({
                title: "Invalid Link",
                description: "The reset link is missing required parameters (email or token).",
                variant: "destructive",
            });
            // Przekierowanie na stronę logowania/zapomnianego hasła po walidacji linku
            // navigate("/forgot-password"); 
        }
    }, [emailFromUrl, tokenFromUrl, navigate, toast]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
        setErrors({});
        console.log("Pass:")
        // Walidacja front-end (zod)
        const validation = passwordSchema.safeParse({ password, confirmPassword });
        if (!validation.success) {
            // ... (obsługa błędów walidacji)
            return;
        }

        // Sprawdzenie linku ponownie
        if (!emailFromUrl || !tokenFromUrl) {
            // Zakończenie, jeśli link jest nieprawidłowy, błąd jest już w toast
            return; 
        }
        console.log("Pass1:")
        // 🚨 4. WYWOŁANIE MUTACJI
        resetMutation.mutate({
            email: emailFromUrl,
            token: tokenFromUrl,
            newPassword: password
        }, {
            onSuccess: () => {
                console.log("zaloguuj sie");
                navigate("/auth"); 
            },
            onError: (error) => {
                // Błąd jest już obsługiwany w hooku (toast)
                console.error("Reset failed:", error);
            }
        });


  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <div className="p-3 rounded-full bg-gradient-sky">
                <img
                  src= "https://poweredbytrailstorage.blob.core.windows.net/pbtgallery/ICON300.png"
                  alt="PBT icon"
                  className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || !emailFromUrl || !tokenFromUrl}>
                            {isLoading ? "Updating..." : "Update Password"}
                        </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;