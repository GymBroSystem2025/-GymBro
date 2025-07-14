import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Search, Dumbbell, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar sessão atual
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
      setLoading(false);
    });
    
    // Listener para mudanças de autenticação
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const features = [
    {
      icon: <Search className="h-8 w-8 text-fitness-primary" />,
      title: "Encontre Parceiros",
      description: "Encontre pessoas que têm objetivos e horários compatíveis com os seus"
    },
    {
      icon: <User className="h-8 w-8 text-fitness-secondary" />,
      title: "Personal Trainers",
      description: "Conecte-se com profissionais qualificados próximos a você"  
    },
    {
      icon: <Calendar className="h-8 w-8 text-fitness-success" />,
      title: "Agende Treinos",
      description: "Organize seus treinos e acompanhe seu progresso"
    }
  ];

  const objectives = [
    "Emagrecimento",
    "Hipertrofia", 
    "Cardio",
    "Força",
    "Flexibilidade",
    "Condicionamento"
  ];

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden section-dark">
        <div className="absolute inset-0 fitness-gradient opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-fitness-primary/5 via-transparent to-fitness-secondary/5"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient glow">
              {user ? (
                <>
                  Bem-vindo de volta,
                  <span className="text-gradient block glow">Vamos treinar!</span>
                </>
              ) : (
                <>
                  Encontre seu
                  <span className="text-gradient block glow">Parceiro de Treino</span>
                </>
              )}
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              {user 
                ? "Continue sua jornada fitness e encontre novos parceiros de treino"
                : "Conecte-se com pessoas que compartilham seus objetivos fitness ou encontre o personal trainer ideal para você"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link to="/match">
                    <Button size="lg" className="btn-gradient hover:opacity-90 transition-opacity shadow-xl">
                      Encontrar Parceiro(a)
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/auth">
                    <Button size="lg" className="btn-gradient hover:opacity-90 transition-opacity">
                      Começar Agora
                    </Button>
                  </Link>
                  <Link to="/profile/create">
                    <Button size="lg" className="btn-gradient hover:opacity-90 transition-opacity">
                      Criar Perfil
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-muted/20 via-background to-muted/20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conecte-se com a comunidade fitness e transforme seus treinos
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center card-glow group">
                <CardHeader className="pb-6">
                  <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-fitness-primary/20 to-fitness-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl mb-3">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-fitness-primary/5 via-background to-fitness-secondary/5">
        <div className="container text-center">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4">Objetivos Suportados</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Independente do seu objetivo fitness, temos a comunidade certa para você
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {objectives.map((objective, index) => (
              <Card key={index} className="p-6 card-glow group cursor-pointer">
                <div className="w-12 h-12 bg-gradient-to-br from-fitness-primary/20 to-fitness-secondary/20 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">{objective}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 fitness-gradient text-white relative overflow-hidden section-dark">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-fitness-primary/30 to-fitness-secondary/30"></div>
        <div className="container text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-white/20 rounded-2xl mx-auto mb-8 flex items-center justify-center backdrop-blur">
              <Dumbbell className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {user ? "Pronto para o próximo treino?" : "Pronto para Começar?"}
            </h2>
            <p className="text-xl mb-10 text-white/90 max-w-3xl mx-auto leading-relaxed">
              {user 
                ? "Junte-se a milhares de pessoas que já encontraram seus parceiros de treino ideais"
                : "Junte-se a milhares de pessoas que já encontraram seus parceiros de treino ideais"
              }
            </p>
            {user ? (
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-white text-primary hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-xl px-8 py-4 text-lg font-semibold btn-gradient"
                >
                  <Activity className="h-5 w-5 mr-2" />
                  Acessar Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="bg-white text-primary hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-xl px-8 py-4 text-lg font-semibold btn-gradient"
                >
                  <User className="h-5 w-5 mr-2" />
                  Criar Conta Grátis
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
