-- Adicionar política para permitir que usuários autenticados vejam todos os perfis
CREATE POLICY "Users can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Comentário: Esta política permite que qualquer usuário autenticado veja todos os perfis
-- Isso é necessário para a funcionalidade de busca de parceiros de treino 