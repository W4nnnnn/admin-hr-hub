import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun, Users } from "lucide-react";
import heroImage from "@/assets/hr-login-bg.jpg";

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simple admin credentials check
    if (email === "admin@hr.com" && password === "admin123") {
      toast({
        title: "Login berhasil!",
        description: "Selamat datang di HR Dashboard",
      });
      setTimeout(() => {
        onLogin();
      }, 500);
    } else {
      toast({
        title: "Login gagal",
        description: "Email atau password salah. Gunakan admin@hr.com / admin123",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary-glow/30 to-background/40 backdrop-blur-sm" />
      
      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          className="bg-background/80 backdrop-blur-hr border-border/50 hover:bg-background/90"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* Login Form */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-hr-glow bg-card/95 backdrop-blur-hr border-border/50">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-hr-medium">
              <Users className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold text-gradient-primary">
              HR Dashboard
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Employee Directory System - Login untuk mengakses dashboard admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Admin
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@hr.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-hr focus:shadow-hr-soft"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="transition-hr focus:shadow-hr-soft"
                />
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-hr shadow-hr-medium"
                disabled={isLoading}
              >
                {isLoading ? "Memverifikasi..." : "Login ke Dashboard"}
              </Button>
            </form>
            <div className="mt-6 text-center text-xs text-muted-foreground">
              <p>Demo credentials:</p>
              <p className="font-mono">admin@hr.com / admin123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;