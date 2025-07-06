# 🔗 Unificação do Perfil - ProfileCreate + Partners

## 🎯 Objetivo

Fazer com que o perfil criado na página inicial (ProfileCreate) seja o mesmo perfil usado na aba de parceiros(as), eliminando a necessidade de criar perfis separados.

## ✅ O que foi implementado

### 1. **Extensão da Tabela Profiles**
- ✅ Adicionados campos necessários para perfil completo
- ✅ Campos: bio, objectives, availability, experience_level, etc.
- ✅ Mantida compatibilidade com estrutura existente

### 2. **Atualização do ProfileCreate**
- ✅ Agora salva dados completos na tabela profiles
- ✅ Inclui: objetivos, disponibilidade, experiência, bio, etc.
- ✅ Usa upsert para atualizar perfil existente

### 3. **Atualização do Partners**
- ✅ Busca dados reais da tabela profiles
- ✅ Mostra dados de exemplo se campos não existirem
- ✅ Interface adaptada para todos os campos

## 🔧 Como Implementar

### Passo 1: Executar Script SQL no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login e acesse o projeto `sjwcpjfcpjeljosrkrfi`
3. Vá em **"SQL Editor"** → **"New query"**
4. Cole e execute o script do arquivo `extend-profiles-table.sql`:

```sql
-- Adicionar campos necessários para o perfil completo
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS name TEXT,
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS objectives TEXT[],
ADD COLUMN IF NOT EXISTS availability TEXT[],
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS experience_level TEXT,
ADD COLUMN IF NOT EXISTS gym TEXT,
ADD COLUMN IF NOT EXISTS images TEXT[],
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS fitness_goals TEXT[];
```

### Passo 2: Executar Script de Políticas RLS

Execute também o script do arquivo `fix-rls-policies.sql`:

```sql
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.role() = 'authenticated');
```

### Passo 3: Testar a Funcionalidade

1. **Criar perfil**: Acesse "Criar Perfil" e preencha todos os dados
2. **Verificar parceiros**: Acesse "Parceiros(as)" - deve mostrar dados reais
3. **Editar perfil**: Use "Editar Perfil" para atualizar informações

## 🎯 Resultado Esperado

### Antes:
- ❌ Perfil criado em ProfileCreate não aparecia em Partners
- ❌ Campos limitados na tabela profiles
- ❌ Dados de exemplo sempre mostrados

### Depois:
- ✅ Perfil único usado em toda aplicação
- ✅ Campos completos: bio, objetivos, disponibilidade, etc.
- ✅ Dados reais mostrados em Partners
- ✅ Interface rica com todas as informações

## 📋 Campos do Perfil Unificado

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| `full_name` | Nome completo | "João Silva" |
| `bio` | Descrição pessoal | "Apaixonado por musculação..." |
| `objectives` | Objetivos fitness | ["Hipertrofia", "Força"] |
| `availability` | Dias disponíveis | ["Manhã", "Tarde"] |
| `experience_level` | Nível de experiência | "Intermediário" |
| `gym` | Academia preferida | "Academia Fitness" |
| `age` | Idade | 25 |
| `images` | Fotos do perfil | ["url1", "url2"] |

## 🔄 Fluxo Completo

1. **Registro**: Usuário se registra → perfil básico criado automaticamente
2. **Criar Perfil**: Usuário acessa "Criar Perfil" → preenche dados completos
3. **Parceiros**: Usuário acessa "Parceiros(as)" → vê perfil completo e outros perfis
4. **Editar**: Usuário pode editar perfil a qualquer momento

## 🆘 Solução de Problemas

### Se ainda aparecer dados de exemplo:
1. Verifique se os scripts SQL foram executados
2. Confirme que há perfis com dados completos
3. Verifique as políticas RLS

### Se campos não aparecerem:
1. Execute o script `extend-profiles-table.sql`
2. Recrie o perfil com dados completos
3. Verifique se não há erros no console

---

**Nota**: Após executar os scripts SQL, o perfil criado inicialmente será automaticamente usado na aba de parceiros(as), eliminando a necessidade de criar perfis separados! 🎉 