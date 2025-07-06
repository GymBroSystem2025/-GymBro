import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Clock, Users, MessageCircle, Heart, Mail, Dumbbell, Activity, Target, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Partner {
  id: string;
  email: string;
  full_name: string;
  name?: string;
  avatar_url?: string;
  bio?: string;
  objectives?: string[];
  availability?: string[];
  location?: string;
  experience_level?: string;
  age?: number;
  gym?: string;
  images?: string[];
  created_at: string;
  updated_at: string;
}

const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const objectives = [
    "Emagrecimento",
    "Hipertrofia", 
    "Cardio",
    "Força",
    "Flexibilidade",
    "Condicionamento"
  ];

  const experienceLevels = [
    "Iniciante",
    "Intermediário",
    "Avançado"
  ];

  const fetchPartners = async () => {
    try {
      setLoading(true);
      
      // Por enquanto, usar dados de exemplo para evitar erros
      // Quando implementar corretamente, substituir por:
      // const { data, error } = await supabase
      //   .from('profiles')
      //   .select('*')
      //   .neq('id', user?.id)
      //   .not('full_name', 'is', null)
      //   .order('created_at', { ascending: false });

      const mockPartners = [
        {
          id: '1',
          email: 'joao@exemplo.com',
          full_name: 'João Silva',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          bio: 'Apaixonado por musculação e sempre buscando novos desafios!',
          objectives: ['Hipertrofia', 'Força'],
          availability: ['Manhã', 'Tarde'],
          experience_level: 'Intermediário'
        },
        {
          id: '2',
          email: 'maria@exemplo.com',
          full_name: 'Maria Santos',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          bio: 'Focada em cardio e funcional. Vamos treinar juntos!',
          objectives: ['Cardio', 'Condicionamento'],
          availability: ['Tarde', 'Noite'],
          experience_level: 'Avançado'
        },
        {
          id: '3',
          email: 'pedro@exemplo.com',
          full_name: 'Pedro Costa',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          bio: 'Iniciante na jornada fitness, procurando parceiros para motivar!',
          objectives: ['Emagrecimento', 'Flexibilidade'],
          availability: ['Manhã'],
          experience_level: 'Iniciante'
        },
        {
          id: '4',
          email: 'ana@exemplo.com',
          full_name: 'Ana Oliveira',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          bio: 'Personal trainer apaixonada por ajudar pessoas a alcançarem seus objetivos!',
          objectives: ['Hipertrofia', 'Emagrecimento', 'Condicionamento'],
          availability: ['Manhã', 'Tarde', 'Noite'],
          experience_level: 'Avançado'
        },
        {
          id: '5',
          email: 'carlos@exemplo.com',
          full_name: 'Carlos Mendes',
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          bio: 'Focado em treinos funcionais e crossfit. Vamos treinar forte!',
          objectives: ['Força', 'Condicionamento'],
          availability: ['Tarde'],
          experience_level: 'Intermediário'
        }
      ];

      setPartners(mockPartners);
      
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os parceiros de treino",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          return;
        }
        setUser(user);
        if (user) {
          fetchPartners();
        }
      } catch (error) {
        // Silenciar erro
      }
    };
    getUser();
  }, []);

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.objectives?.some(obj => obj.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const handleConnect = async (partnerId: string) => {
    try {
      // Por enquanto, apenas mostrar toast
      // Quando implementar a tabela connections, substituir por:
      // const { error } = await supabase
      //   .from('connections')
      //   .insert({
      //     user_id: user.id,
      //     partner_id: partnerId,
      //     status: 'pending'
      //   });

      toast({
        title: "Solicitação enviada!",
        description: "Sua solicitação de conexão foi enviada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar a solicitação",
        variant: "destructive",
      });
    }
  };

  const getRandomFitnessImage = () => {
    const images = [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop"
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-fitness-primary to-fitness-secondary rounded-full mx-auto mb-6 flex items-center justify-center">
            <Dumbbell className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Faça login para ver os parceiros(as) de treino</h1>
          <p className="text-muted-foreground">Entre na sua conta para encontrar parceiros(as) de treino próximos(as)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-fitness-primary/20 to-fitness-secondary/20"></div>
        <div className="container relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-fitness-primary to-fitness-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Parceiros(as) de Treino</h1>
            <p className="text-xl text-muted-foreground">Encontre pessoas com objetivos similares para treinar juntos(as)</p>
          </div>

          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center max-w-2xl mx-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nome, objetivo ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background/80 backdrop-blur focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Parceiros */}
      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando parceiros(as)...</p>
            </div>
          </div>
        ) : filteredPartners.length === 0 ? (
          <Card className="text-center py-16 max-w-2xl mx-auto bg-background/80 backdrop-blur border-primary/20">
            <CardContent>
              <div className="w-20 h-20 bg-gradient-to-br from-fitness-primary/20 to-fitness-secondary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Nenhum parceiro(a) encontrado(a)</h3>
              <p className="text-muted-foreground mb-6 text-lg">
                {partners.length === 0 
                  ? "Ainda não há parceiros(as) de treino cadastrados(as) na sua região."
                  : "Nenhum parceiro(a) corresponde aos filtros selecionados. Tente ajustar sua busca."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner, index) => (
              <Card key={partner.id} className="group hover:shadow-xl transition-all duration-300 bg-background/80 backdrop-blur border-primary/20 hover:border-primary/40 overflow-hidden">
                {/* Background Image */}
                <div className="relative h-32 bg-gradient-to-br from-fitness-primary/20 to-fitness-secondary/20">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-primary">
                      {partner.experience_level || "Iniciante"}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="relative -mt-16 pb-2">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border-4 border-background shadow-lg">
                      <AvatarImage src={partner.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-fitness-primary to-fitness-secondary text-white font-bold">
                        {partner.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{partner.full_name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {partner.email}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {partner.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2 bg-muted/50 p-3 rounded-lg">
                      {partner.bio}
                    </p>
                  )}
                  
                  {partner.objectives && partner.objectives.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        Objetivos:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {partner.objectives.slice(0, 3).map((objective) => (
                          <Badge key={objective} variant="secondary" className="text-xs bg-primary/10 text-primary">
                            {objective}
                          </Badge>
                        ))}
                        {partner.objectives.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{partner.objectives.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {partner.availability && partner.availability.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Disponibilidade:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {partner.availability.slice(0, 2).map((time) => (
                          <Badge key={time} variant="outline" className="text-xs">
                            {time}
                          </Badge>
                        ))}
                        {partner.availability.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{partner.availability.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="text-xs text-muted-foreground">
                      Membro desde {new Date(partner.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConnect(partner.id)}
                        className="flex items-center gap-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <MessageCircle className="h-3 w-3" />
                        Conectar
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Heart className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Partners; 