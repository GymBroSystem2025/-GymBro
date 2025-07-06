import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  Flame, 
  TrendingUp, 
  Dumbbell, 
  Activity, 
  MessageCircle, 
  Users, 
  Send,
  Heart,
  MapPin,
  Target
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Connection {
  id: string;
  partner_id: string;
  partner_name: string;
  partner_avatar?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  last_message?: string;
  last_message_time?: string;
}

interface Message {
  id: string;
  connection_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

const Chat = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchProfile();
        fetchConnections();
      }
    };
    getUser();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (!error && data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  const fetchConnections = async () => {
    try {
      setLoading(true);
      
      // Por enquanto, vamos usar dados de exemplo
      // Quando implementar a tabela de conexões, substituir por:
      // const { data, error } = await supabase
      //   .from('connections')
      //   .select('*')
      //   .or(`user_id.eq.${user?.id},partner_id.eq.${user?.id}`)
      //   .eq('status', 'accepted');

      const mockConnections: Connection[] = [
        {
          id: '1',
          partner_id: 'partner1',
          partner_name: 'João Silva',
          partner_avatar: null,
          status: 'accepted',
          created_at: new Date().toISOString(),
          last_message: 'Vamos treinar amanhã às 8h?',
          last_message_time: new Date().toISOString()
        },
        {
          id: '2',
          partner_id: 'partner2',
          partner_name: 'Maria Santos',
          partner_avatar: null,
          status: 'accepted',
          created_at: new Date().toISOString(),
          last_message: 'Perfeito! Combinado então.',
          last_message_time: new Date().toISOString()
        },
        {
          id: '3',
          partner_id: 'partner3',
          partner_name: 'Pedro Costa',
          partner_avatar: null,
          status: 'pending',
          created_at: new Date().toISOString(),
          last_message: 'Oi! Vi seu perfil e gostaria de treinar junto.',
          last_message_time: new Date().toISOString()
        }
      ];

      setConnections(mockConnections);
    } catch (error) {
      console.error('Erro ao buscar conexões:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as conexões",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (connectionId: string) => {
    try {
      // Por enquanto, dados de exemplo
      // Quando implementar a tabela de mensagens, substituir por:
      // const { data, error } = await supabase
      //   .from('messages')
      //   .select('*')
      //   .eq('connection_id', connectionId)
      //   .order('created_at', { ascending: true });

      const mockMessages: Message[] = [
        {
          id: '1',
          connection_id: connectionId,
          sender_id: 'partner1',
          content: 'Oi! Vi seu perfil e gostaria de treinar junto.',
          created_at: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: '2',
          connection_id: connectionId,
          sender_id: user?.id,
          content: 'Oi! Que legal! Qual seu objetivo de treino?',
          created_at: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: '3',
          connection_id: connectionId,
          sender_id: 'partner1',
          content: 'Foco em hipertrofia e força. E você?',
          created_at: new Date(Date.now() - 900000).toISOString()
        },
        {
          id: '4',
          connection_id: connectionId,
          sender_id: user?.id,
          content: 'Perfeito! Mesmo objetivo. Vamos treinar amanhã às 8h?',
          created_at: new Date().toISOString()
        }
      ];

      setMessages(mockMessages);
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConnection) return;

    try {
      const message: Message = {
        id: Date.now().toString(),
        connection_id: selectedConnection.id,
        sender_id: user?.id,
        content: newMessage,
        created_at: new Date().toISOString()
      };

      // Adicionar mensagem à lista local
      setMessages(prev => [...prev, message]);
      
      // Atualizar última mensagem na conexão
      setConnections(prev => prev.map(conn => 
        conn.id === selectedConnection.id 
          ? { ...conn, last_message: newMessage, last_message_time: new Date().toISOString() }
          : conn
      ));

      setNewMessage("");

      // Aqui você implementaria o envio real para o Supabase
      // const { error } = await supabase
      //   .from('messages')
      //   .insert(message);

    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem",
        variant: "destructive",
      });
    }
  };

  const handleConnectionSelect = (connection: Connection) => {
    setSelectedConnection(connection);
    fetchMessages(connection.id);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Faça login para ver seu chat</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">Chat de Treinos</h1>
        <p className="text-muted-foreground">Gerencie suas conexões e converse com seus parceiros de treino</p>
      </div>

      <Tabs defaultValue="connections" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Conexões
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Estatísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Conexões */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Parceiros de Treino
                  </CardTitle>
                  <CardDescription>
                    Pessoas que aceitaram treinar com você
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : connections.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Nenhuma conexão ainda</p>
                      <p className="text-sm text-muted-foreground">Conecte-se com parceiros na aba Parceiros(as)</p>
                    </div>
                  ) : (
                    connections.map((connection) => (
                      <div
                        key={connection.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedConnection?.id === connection.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleConnectionSelect(connection)}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={connection.partner_avatar} />
                            <AvatarFallback>
                              {connection.partner_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm truncate">
                                {connection.partner_name}
                              </p>
                              <Badge 
                                variant={connection.status === 'accepted' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {connection.status === 'accepted' ? 'Conectado' : 'Pendente'}
                              </Badge>
                            </div>
                            {connection.last_message && (
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {connection.last_message}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Chat */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Chat
                    {selectedConnection && (
                      <span className="text-sm font-normal text-muted-foreground">
                        com {selectedConnection.partner_name}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {!selectedConnection ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Selecione uma conexão para começar a conversar</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Mensagens */}
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-4 bg-muted/20 rounded-lg">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                message.sender_id === user?.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-background border'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {new Date(message.created_at).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Input de mensagem */}
                      <div className="flex gap-2">
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conexões Ativas</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {connections.filter(c => c.status === 'accepted').length}
                </div>
                <p className="text-xs text-muted-foreground">Parceiros conectados</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Solicitações</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {connections.filter(c => c.status === 'pending').length}
                </div>
                <p className="text-xs text-muted-foreground">Aguardando resposta</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Treinos Realizados</CardTitle>
                <Dumbbell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tempo Total</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18h</div>
                <p className="text-xs text-muted-foreground">Este mês</p>
              </CardContent>
            </Card>
          </div>

          {/* Informações do Perfil */}
          {profile && (
            <Card>
              <CardHeader>
                <CardTitle>Seu Perfil</CardTitle>
                <CardDescription>Informações que aparecem para outros usuários</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Nome</h4>
                      <p className="text-muted-foreground">{profile.full_name || profile.name || 'Não informado'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Bio</h4>
                      <p className="text-muted-foreground">{profile.bio || 'Não informado'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Localização</h4>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {profile.location || profile.gym || 'Não informado'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Objetivos</h4>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {profile.objectives?.map((obj: string) => (
                          <Badge key={obj} variant="secondary" className="text-xs">
                            {obj}
                          </Badge>
                        )) || <span className="text-muted-foreground">Não informado</span>}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">Nível de Experiência</h4>
                      <p className="text-muted-foreground">{profile.experience_level || 'Não informado'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Disponibilidade</h4>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {profile.availability?.map((time: string) => (
                          <Badge key={time} variant="outline" className="text-xs">
                            {time}
                          </Badge>
                        )) || <span className="text-muted-foreground">Não informado</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Chat; 