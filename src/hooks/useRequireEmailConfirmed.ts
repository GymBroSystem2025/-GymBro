import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useRequireEmailConfirmed() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      // Supabase v2: email_confirmed_at ou confirmed_at
      const isConfirmed = user.email_confirmed_at || user.confirmed_at;
      if (!isConfirmed) {
        toast({
          title: "Confirme seu e-mail",
          description: "Você precisa confirmar seu e-mail para acessar o sistema. Verifique sua caixa de entrada.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    })();
  }, [navigate, toast]);
} 