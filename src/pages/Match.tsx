import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { useRequireEmailConfirmed } from "@/hooks/useRequireEmailConfirmed";
import { Switch } from "@/components/ui/switch";

const DEFAULT_RADIUS = 5; // km

// Mock de perfis para demonstração
const mockProfiles = [
  {
    id: 1,
    name: "João Silva",
    age: 25,
    bio: "Curto musculação, corrida e um bom papo!",
    distance: 1.2,
    gym: "SmartFit Centro",
    location: "Duque de Caxias",
    verified: true,
    avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
    objectives: ["Hipertrofia", "Cardio"],
    availableDays: ["Segunda-feira", "Quarta-feira", "Sexta-feira"],
    timePreference: "morning",
    lookingFor: "both",
  },
  {
    id: 2,
    name: "Maria Souza",
    age: 28,
    bio: "Amo yoga, pilates e fazer novas amizades!",
    distance: 2.8,
    gym: "BodyTech Barra",
    location: "Barra da Tijuca",
    verified: false,
    avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
    objectives: ["Flexibilidade", "Bem-estar"],
    availableDays: ["Terça-feira", "Quinta-feira"],
    timePreference: "evening",
    lookingFor: "partners",
  },
  {
    id: 3,
    name: "Pedro Costa",
    age: 31,
    bio: "Buscando parceiros para treinar pesado!",
    distance: 4.5,
    gym: "Academia TopFit",
    location: "Copacabana",
    verified: true,
    avatar_url: "https://randomuser.me/api/portraits/men/65.jpg",
    objectives: ["Força", "Hipertrofia"],
    availableDays: ["Sábado", "Domingo"],
    timePreference: "afternoon",
    lookingFor: "trainers",
  },
];

// Função para traduzir timePreference
const timePrefText = {
  morning: "Manhã (6h-12h)",
  afternoon: "Tarde (12h-18h)",
  evening: "Noite (18h-22h)",
  flexible: "Flexível",
};
// Função para traduzir lookingFor
const lookingForText = {
  both: "Parceiros e Personal Trainers",
  partners: "Apenas Parceiros de Treino",
  trainers: "Apenas Personal Trainers",
};

const Match = () => {
  useRequireEmailConfirmed();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [showFarProfiles, setShowFarProfiles] = useState(false);
  const [extraRadius, setExtraRadius] = useState(50);
  const { toast } = useToast();

  // Verifica o status da geolocalização
  const checkGeolocationStatus = () => {
    if (!navigator.geolocation) {
      toast({ 
        title: "Navegador não suportado", 
        description: "Seu navegador não suporta geolocalização.", 
        variant: "destructive" 
      });
      return;
    }

    // Verifica se a permissão já foi concedida
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'denied') {
          setPermissionDenied(true);
        }
      });
    }
  };

  // Verifica status da geolocalização ao carregar a página
  useEffect(() => {
    checkGeolocationStatus();
  }, []);

  // Função para usar localização padrão (Rio de Janeiro)
  const useDefaultLocation = () => {
    setLocation({ lat: -22.9068, lng: -43.1729 }); // Coordenadas do Rio de Janeiro
    toast({ 
      title: "Localização definida", 
      description: "Usando localização padrão (Rio de Janeiro)." 
    });
  };

  // Solicita localização do usuário
  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast({ 
        title: "Erro", 
        description: "Geolocalização não suportada pelo seu navegador.", 
        variant: "destructive" 
      });
      return;
    }
    
    setLoading(true);
    
    // Configurações para melhor precisão
    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 segundos
      maximumAge: 300000 // 5 minutos
    };
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
        toast({ 
          title: "Localização obtida!", 
          description: "Agora você pode encontrar parceiros próximos." 
        });
      },
      (err) => {
        setLoading(false);
        let errorMessage = "Erro ao obter localização";
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Permissão de localização negada. Por favor, permita o acesso à localização nas configurações do seu navegador.";
            setPermissionDenied(true);
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Informação de localização indisponível. Verifique se o GPS está ativado.";
            break;
          case err.TIMEOUT:
            errorMessage = "Tempo limite excedido. Verifique sua conexão com a internet.";
            break;
          default:
            errorMessage = "Erro desconhecido ao obter localização.";
        }
        
        toast({ 
          title: "Erro ao obter localização", 
          description: errorMessage, 
          variant: "destructive" 
        });
      },
      options
    );
  };

  // Busca perfis próximos (mock)
  useEffect(() => {
    if (!location) return;
    setProfiles(mockProfiles.filter(u => u.distance <= radius));
    setCurrent(0);
  }, [location, radius]);

  const handleMatch = () => {
    toast({ title: "Bora treinar!", description: `Você demonstrou interesse em treinar com ${profile.name}.` });
    setCurrent((prev) => prev + 1);
  };
  const handlePass = () => {
    setCurrent((prev) => prev + 1);
  };

  const profile = profiles[current];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="w-full max-w-sm">
        {!location ? (
          permissionDenied ? (
            <div className="text-center space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <h3 className="font-semibold text-destructive mb-2">Permissão de Localização Negada</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Para encontrar parceiros próximos, precisamos da sua localização.
                </p>
                <div className="text-left text-sm space-y-2">
                  <p><strong>Como permitir:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Toque no ícone de localização na barra de endereços</li>
                    <li>Selecione "Permitir" ou "Permitir sempre"</li>
                    <li>Ou vá em Configurações do navegador → Privacidade → Localização</li>
                  </ul>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setPermissionDenied(false);
                  requestLocation();
                }} 
                className="w-full"
              >
                Tentar Novamente
              </Button>
              <Button 
                onClick={useDefaultLocation} 
                variant="outline" 
                className="w-full"
              >
                Usar Localização Padrão
              </Button>
            </div>
          ) : (
            <Button onClick={requestLocation} disabled={loading} className="mb-4 w-full">
              {loading ? "Obtendo localização..." : "Permitir Localização"}
            </Button>
          )
        ) : profiles.length === 0 ? (
          <div className="text-center mt-12 text-muted-foreground">Nenhum parceiro encontrado nesse raio.</div>
        ) : profile ? (
          <Card className="overflow-hidden shadow-xl">
            <div className="relative">
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-full h-72 object-cover object-center"
                style={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
              />
              {profile.verified && (
                <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full shadow">Perfil verificado</span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-lg truncate max-w-[180px]">{profile.name}</span>
                <span className="text-lg text-muted-foreground">{profile.age}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>🏠 {profile.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span>📍 {profile.gym}</span>
                <span>•</span>
                <span>{profile.distance < 1 ? "menos de um quilômetro de distância" : `${profile.distance} km de distância`}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {profile.objectives.map((obj: string) => (
                  <Badge key={obj} variant="secondary" className="text-xs">{obj}</Badge>
                ))}
              </div>
              <div className="mb-2">
                <span className="font-semibold">Sobre {profile.name}</span>
                <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Objetivos Fitness</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.objectives.map((obj: string) => (
                    <Badge key={obj} variant="secondary" className="text-xs">{obj}</Badge>
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Dias Disponíveis</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {profile.availableDays && profile.availableDays.length > 0 ? (
                    profile.availableDays.map((day: string) => (
                      <Badge key={day} variant="outline" className="text-xs">{day}</Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">Não informado</span>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold">Horário Preferido</span>
                <div className="mt-1 text-xs text-muted-foreground">
                  {timePrefText[profile.timePreference] || "Não informado"}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold">O que você está procurando</span>
                <div className="mt-1 text-xs text-muted-foreground">
                  {lookingForText[profile.lookingFor] || "Não informado"}
                </div>
              </div>
              <div className="flex gap-4 mt-4 justify-center">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-full shadow" onClick={handleMatch}>
                  Bora treinar
                </Button>
                <Button size="lg" variant="outline" className="border-destructive text-destructive font-bold px-6 py-2 rounded-full" onClick={handlePass}>
                  Deixar para próxima
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <div className="text-center mt-12 text-muted-foreground">Acabaram os perfis por hoje!</div>
        )}
      </div>
      {location && (
        <div className="w-full max-w-md mx-auto mt-8 p-6 bg-card rounded-xl shadow flex flex-col gap-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="block font-semibold text-lg">Distância máxima</span>
            </div>
            <span className="font-semibold text-primary text-lg">{radius} km</span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={radius}
            onChange={e => setRadius(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">Mostrar pessoas mais longe de mim se eu ficar sem perfis pra ver.</span>
            <Switch
              checked={showFarProfiles}
              onCheckedChange={setShowFarProfiles}
              aria-label="Mostrar pessoas mais longe"
            />
          </div>
          {showFarProfiles && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="block font-semibold text-sm">Novo limite de distância</span>
                <span className="font-semibold text-primary text-sm">{extraRadius} km</span>
              </div>
              <input
                type="range"
                min={radius + 1}
                max={200}
                step={1}
                value={extraRadius}
                onChange={e => setExtraRadius(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Match; 