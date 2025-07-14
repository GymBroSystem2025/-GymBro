# 🔍 Guia de Debug - Erro na Criação de Conta

## 🚨 Problema Atual

O erro "failed to fetch" persiste na criação de conta. Vamos investigar passo a passo.

## 🔧 Passos para Debug

### 1. Verificar Console do Navegador

1. **Abra o navegador** e acesse `http://localhost:8080`
2. **Pressione F12** para abrir as ferramentas de desenvolvedor
3. **Vá para a aba "Console"**
4. **Recarregue a página** e observe os logs

### 2. Testar Conexão com Supabase

1. **Na página de login**, clique no botão **"Testar Conexão Supabase"**
2. **Observe o console** para ver os logs de conexão
3. **Verifique se aparece**:
   - "Supabase client configurado"
   - "Testando conexão com Supabase..."
   - "Teste de conexão: { data, error }"

### 3. Tentar Criar Conta

1. **Preencha o formulário** com dados válidos
2. **Clique em "Criar Conta"**
3. **Observe o console** para ver os logs:
   - "Iniciando criação de conta..."
   - "Resposta do Supabase: { data, error }"

## 📋 Logs Esperados

### Logs de Sucesso:
```
Supabase client configurado: { url: "https://...", hasKey: true, keyLength: 151 }
Verificando usuário atual...
Usuário atual: { user: null, error: null }
Iniciando criação de conta... { email: "teste@email.com" }
Resposta do Supabase: { data: { user: {...} }, error: null }
Usuário criado com sucesso: {...}
```

### Logs de Erro:
```
Erro do Supabase: { message: "...", status: 400 }
Erro completo: Error: ...
```

## 🔍 Possíveis Causas

### 1. Problema de Rede
- **Sintoma**: Erro de timeout ou "Network Error"
- **Solução**: Verificar conexão com internet

### 2. Configuração do Supabase
- **Sintoma**: "Invalid API key" ou "Unauthorized"
- **Solução**: Verificar URL e chave do Supabase

### 3. Políticas RLS
- **Sintoma**: "Row Level Security policy violation"
- **Solução**: Executar scripts SQL de correção

### 4. Problema de CORS
- **Sintoma**: "CORS error" ou "Access-Control-Allow-Origin"
- **Solução**: Verificar configurações do Supabase

## 🛠️ Comandos para Testar

### Verificar se o servidor está rodando:
```bash
npm run dev
```

### Verificar dependências:
```bash
npm install
```

### Limpar cache:
```bash
npm run build
```

## 📱 Teste em Diferentes Navegadores

1. **Chrome/Edge**: Teste principal
2. **Firefox**: Verificar se o problema é específico do navegador
3. **Modo incógnito**: Eliminar problemas de cache

## 🔧 Soluções Temporárias

### Se o problema persistir:

1. **Desabilitar validação de CREF**:
   - Comente a linha `await validateCref(cref);` no código
   - Teste criação de conta sem validação

2. **Usar dados de teste**:
   - Email: `teste@teste.com`
   - Senha: `123456`

3. **Verificar configurações do Supabase**:
   - Acesse o dashboard do Supabase
   - Verifique se o projeto está ativo
   - Confirme as configurações de autenticação

## 📞 Próximos Passos

Após executar os testes acima, informe:

1. **Quais logs aparecem no console**
2. **Se o botão "Testar Conexão Supabase" funciona**
3. **Qual erro específico aparece ao tentar criar conta**
4. **Se o problema ocorre em todos os navegadores**

Com essas informações, poderemos identificar e corrigir o problema específico.

---

**Nota**: Este guia foi criado para ajudar a identificar a causa raiz do problema. Execute os testes na ordem indicada e reporte os resultados. 