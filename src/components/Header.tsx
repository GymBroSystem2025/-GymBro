import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Buscar sessão atual
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });
    // Listener para mudanças de autenticação
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // Buscar perfil do usuário quando user mudar
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setProfile(data);
        }
      };
      fetchProfile();
    }
  }, [user]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex flex-col md:flex-row h-auto md:h-16 items-center md:justify-between gap-2 md:gap-0 py-2 md:py-0">
        <div className="flex items-center space-x-2 w-full md:w-auto justify-center md:justify-start">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="GymBro Logo"
              className="w-10 h-10 object-contain bg-white rounded mr-2"
            />
            <span className="text-xl font-bold text-gradient">GymBro</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Início
          </Link>
          <Link to="/profile/edit" className="text-sm font-medium hover:text-primary transition-colors">
            Editar Perfil
          </Link>
          <Link to="/trainers" className="text-sm font-medium hover:text-primary transition-colors">
            Personal Trainers
          </Link>
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
            Marcar Treino
          </Link>
        </nav>

        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto justify-center md:justify-end">
          <ThemeToggle />
          {user ? (
            <div className="flex flex-col md:flex-row items-center gap-2">
              <span className="text-sm font-medium truncate max-w-[120px] md:max-w-none">
                {profile?.full_name || profile?.name || user.email}
              </span>
              <Link to="/profile/edit">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                >
                  <User className="h-3 w-3" />
                  Editar
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={async () => {
                  await supabase.auth.signOut();
                }}
              >
                Sair
              </Button>
            </div>
          ) : (
            <Link to="/auth">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
