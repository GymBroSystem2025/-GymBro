-- Script para criar tabelas de conexões e mensagens
-- Execute este script no SQL Editor do Supabase Dashboard

-- Tabela de conexões entre usuários
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  partner_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Garantir que não há conexões duplicadas
  UNIQUE(user_id, partner_id)
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id UUID REFERENCES public.connections(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS nas tabelas
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Políticas para connections
CREATE POLICY "Users can view their connections" 
  ON public.connections 
  FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() = partner_id);

CREATE POLICY "Users can create connections" 
  ON public.connections 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their connections" 
  ON public.connections 
  FOR UPDATE 
  USING (auth.uid() = user_id OR auth.uid() = partner_id);

-- Políticas para messages
CREATE POLICY "Users can view messages from their connections" 
  ON public.messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.connections 
      WHERE id = connection_id 
      AND (user_id = auth.uid() OR partner_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages to their connections" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.connections 
      WHERE id = connection_id 
      AND (user_id = auth.uid() OR partner_id = auth.uid())
      AND status = 'accepted'
    )
  );

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_connections_updated_at
  BEFORE UPDATE ON public.connections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verificar se as tabelas foram criadas
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name IN ('connections', 'messages')
ORDER BY table_name, ordinal_position;

-- Comentário: Estas tabelas permitem o sistema de chat e conexões entre usuários 