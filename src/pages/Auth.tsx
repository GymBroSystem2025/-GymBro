import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPersonalLoading, setIsPersonalLoading] = useState(false);
  const [cref, setCref] = useState("");
  const [crefStatus, setCrefStatus] = useState<"idle" | "validando" | "ativo" | "invalido" | "erro">("idle");
  const [showEmailConfirmationDialog, setShowEmailConfirmationDialog] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const crefInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Função para reenviar e-mail de confirmação
  const resendConfirmationEmail = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "E-mail reenviado!",
        description: "Verifique sua caixa de entrada novamente.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao reenviar e-mail",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  // Verificar se o usuário já está logado
  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log('Verificando usuário atual...');
        const { data: { user }, error } = await supabase.auth.getUser();
        console.log('Usuário atual:', { user, error });
        if (user) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      }
    };
    checkUser();
  }, [navigate]);

  // Função para testar conexão com Supabase
  const testSupabaseConnection = async () => {
    try {
      console.log('Testando conexão com Supabase...');
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      console.log('Teste de conexão:', { data, error });
      
      if (error) {
        toast({
          title: "Erro de conexão",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Conexão OK",
          description: "Supabase está funcionando corretamente",
        });
      }
    } catch (error: any) {
      console.error('Erro no teste de conexão:', error);
      toast({
        title: "Erro de conexão",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Iniciando login...', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('Resposta do login:', { data, error });

      if (error) {
        console.error('Erro do login:', error);
        throw error;
      }

      if (data.user) {
        console.log('Login realizado com sucesso:', data.user);
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta ao GymBro",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Erro completo do login:', error);
      toast({
        title: "Erro no login",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }

    if (!nickname.trim()) {
      toast({
        title: "Erro",
        description: "Preencha o nome (apelido)",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Iniciando criação de conta...', { email });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { name: nickname },
        },
      });

      console.log('Resposta do Supabase:', { data, error });

      if (error) {
        console.error('Erro do Supabase:', error);
        throw error;
      }

      if (data.user) {
        console.log('Usuário criado com sucesso:', data.user);
        setUserEmail(email);
        setShowEmailConfirmationDialog(true);
        // Limpar formulário
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setNickname("");
      } else {
        console.log('Nenhum usuário retornado');
        setUserEmail(email);
        setShowEmailConfirmationDialog(true);
        // Limpar formulário
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setNickname("");
      }
    } catch (error: any) {
      console.error('Erro completo:', error);
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function validateCref(cref: string) {
    setCrefStatus("validando");
    try {
      // Por enquanto, vamos simular a validação do CREF
      // Em produção, você pode implementar uma API própria ou usar um serviço de proxy
      
      // Simular delay de validação
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validação básica do formato do CREF (número-letra/estado)
      const crefRegex = /^\d{6}-[A-Z]\/[A-Z]{2}$/;
      if (crefRegex.test(cref)) {
        setCrefStatus("ativo");
      } else {
        setCrefStatus("invalido");
      }
      
      // TODO: Implementar validação real do CREF
      // Opções:
      // 1. Criar uma API própria que consulta o CONFEF
      // 2. Usar um serviço de proxy CORS
      // 3. Implementar validação no backend
      
    } catch (err) {
      console.error('Erro ao validar CREF:', err);
      setCrefStatus("erro");
    }
  }

  const handlePersonalSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      });
      return;
    }
    if (!cref) {
      toast({
        title: "Erro",
        description: "Informe o número do CREF",
        variant: "destructive",
      });
      crefInputRef.current?.focus();
      return;
    }
    setIsPersonalLoading(true);
    await validateCref(cref);
    if (crefStatus !== "ativo") {
      toast({
        title: "CREF inválido ou inativo",
        description: "Só é possível cadastrar se o CREF estiver ativo.",
        variant: "destructive",
      });
      setIsPersonalLoading(false);
      return;
    }
    // Aqui segue o fluxo normal de cadastro, podendo salvar um campo extra 'is_personal: true' no perfil
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { cref, is_personal: true }
        },
      });
      if (error) throw error;
      if (data.user) {
        setUserEmail(email);
        setShowEmailConfirmationDialog(true);
        // Limpar formulário
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setNickname("");
        setCref("");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsPersonalLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 section-dark">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="GymBro Logo" className="w-20 h-20 rounded-2xl mx-auto mb-4 object-contain bg-white shadow-xl" />
          <h1 className="text-2xl font-bold text-gradient glow">Bem-vindo ao GymBro</h1>
          <p className="text-muted-foreground mt-2 text-white/80">Seu parceiro de treino te espera</p>
          
        </div>

        <Card className="border-primary/20 card-glow">
          <CardHeader className="text-center">
            <CardTitle className="text-gradient glow">Acesse sua conta</CardTitle>
            <CardDescription className="text-muted-foreground">Entre ou crie uma nova conta para começar</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur rounded-lg mb-4">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
                <TabsTrigger value="personal">Sou Personal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-gradient hover:opacity-90 transition-opacity shadow-xl" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-nickname">Nome (apelido)</Label>
                    <Input
                      id="signup-nickname"
                      type="text"
                      placeholder="Seu nome ou apelido"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Senha</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Digite a senha novamente"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full btn-gradient hover:opacity-90 transition-opacity shadow-xl" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="personal">
                <form onSubmit={handlePersonalSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="personal-email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="personal-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personal-password">Senha</Label>
                    <Input
                      id="personal-password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personal-confirm-password">Confirmar Senha</Label>
                    <Input
                      id="personal-confirm-password"
                      type="password"
                      placeholder="Digite a senha novamente"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cref">Número do CREF</Label>
                    <Input
                      id="cref"
                      ref={crefInputRef}
                      type="text"
                      placeholder="Ex: 123456-G/SP"
                      value={cref}
                      onChange={(e) => setCref(e.target.value)}
                      required
                    />
                    {crefStatus === "validando" && <span className="text-sm text-muted-foreground">Validando CREF no CONFEF...</span>}
                    {crefStatus === "ativo" && <span className="text-sm text-green-600">CREF ativo no CONFEF!</span>}
                    {crefStatus === "invalido" && <span className="text-sm text-red-600">CREF não encontrado ou inativo no CONFEF.</span>}
                    {crefStatus === "erro" && <span className="text-sm text-red-600">Erro ao consultar o CONFEF. Tente novamente.</span>}
                  </div>
                  <Button
                    type="submit"
                    className="w-full btn-gradient hover:opacity-90 transition-opacity shadow-xl"
                    disabled={isPersonalLoading}
                  >
                    {isPersonalLoading ? "Validando..." : "Cadastrar como Personal"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Dialog de Confirmação de E-mail */}
      <Dialog open={showEmailConfirmationDialog} onOpenChange={setShowEmailConfirmationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Conta criada com sucesso!
            </DialogTitle>
            <DialogDescription className="text-left">
              <div className="space-y-4">
                <p>
                  Enviamos um e-mail de confirmação para: <strong>{userEmail}</strong>
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">📧 E-mail de Confirmação</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    <strong>Remetente:</strong> noreply@sjwcpjfcpjeljosrkrfi.supabase.co
                  </p>
                  <p className="text-sm text-blue-700 mb-2">
                    <strong>Assunto:</strong> "Confirme seu e-mail para GymBro"
                  </p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Não encontrou o e-mail?</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Verifique sua <strong>caixa de spam</strong></li>
                    <li>• Verifique sua <strong>lixeira</strong></li>
                    <li>• Aguarde alguns minutos (pode demorar até 5 minutos)</li>
                    <li>• Verifique se digitou o e-mail corretamente</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">✅ Próximos Passos</h4>
                  <ol className="text-sm text-green-700 space-y-1">
                    <li>1. Abra o e-mail de confirmação</li>
                    <li>2. Clique no botão "Confirmar e-mail"</li>
                    <li>3. Você será redirecionado para completar seu perfil</li>
                  </ol>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEmailConfirmationDialog(false)}
            >
              Entendi
            </Button>
            <Button
              onClick={resendConfirmationEmail}
            >
              Reenviar E-mail
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
