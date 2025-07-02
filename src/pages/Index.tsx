
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Search } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-fitness-primary" />,
      title: "Encontre Parceiros",
      description: "Match com pessoas que têm objetivos e horários compatíveis com os seus"
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 fitness-gradient opacity-10"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encontre seu
              <span className="text-gradient block">Parceiro de Treino</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Conecte-se com pessoas que compartilham seus objetivos fitness ou encontre o personal trainer ideal para você
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="fitness-gradient text-white hover:opacity-90 transition-opacity">
                  Começar Agora
                </Button>
              </Link>
              <Link to="/profile/create">
                <Button size="lg" variant="outline" className="border-primary hover:bg-primary/10">
                  Criar Perfil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader>
                  <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-16 px-4">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-8">Objetivos Suportados</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Independente do seu objetivo fitness, temos a comunidade certa para você
          </p>
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {objectives.map((objective, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="px-4 py-2 text-sm hover:bg-primary/10 transition-colors cursor-pointer"
              >
                {objective}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 fitness-gradient text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já encontraram seus parceiros de treino ideais
          </p>
          <Link to="/auth">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-primary hover:bg-white/90 transition-colors"
            >
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
