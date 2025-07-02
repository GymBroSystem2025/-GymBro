
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-fitness-primary to-fitness-secondary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">GB</span>
          </div>
          <span className="text-xl font-bold text-gradient">GymBro</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Início
          </Link>
          <Link to="/matches" className="text-sm font-medium hover:text-primary transition-colors">
            Matches
          </Link>
          <Link to="/trainers" className="text-sm font-medium hover:text-primary transition-colors">
            Personal Trainers
          </Link>
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link to="/auth">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Entrar
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
