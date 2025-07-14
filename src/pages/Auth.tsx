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

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cref, setCref] = useState("");
  const [isPersonalLoading, setIsPersonalLoading] = useState(false);
  const [crefStatus, setCrefStatus] = useState<string|null>(null);
  const crefInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verificar se o usuário já está logado
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo de volta ao GymBro",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message,
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

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu email para confirmar a conta",
        });
        navigate("/profile/create");
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function validateCref(cref: string) {
    setCrefStatus("validando");
    try {
      // Consulta real ao site do CONFEF
      const response = await fetch(`https://confef.org.br/confef/registrados/?registro=${encodeURIComponent(cref)}`);
      const html = await response.text();
      // Verifica se o número do CREF aparece na tabela de resultados
      if (html.includes(cref)) {
        setCrefStatus("ativo");
      } else {
        setCrefStatus("invalido");
      }
    } catch (err) {
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
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu email para confirmar a conta",
        });
        navigate("/profile/create");
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
    </div>
  );
};

export default Auth;
