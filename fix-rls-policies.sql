-- Script para corrigir as políticas RLS da tabela profiles
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Remover a política restritiva que só permite ver o próprio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- 2. Criar nova política que permite que usuários autenticados vejam todos os perfis
CREATE POLICY "Users can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- 3. Manter as políticas de UPDATE e INSERT apenas para o próprio perfil
-- (Essas já existem e estão corretas)

-- 4. Verificar se as políticas foram aplicadas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Comentário: Esta correção permite que qualquer usuário autenticado veja todos os perfis
-- Isso é necessário para a funcionalidade de busca de parceiros de treino
-- As políticas de UPDATE e INSERT continuam restritas ao próprio usuário por segurança 