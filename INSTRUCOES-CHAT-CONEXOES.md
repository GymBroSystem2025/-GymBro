# Instruções para Implementar Sistema de Chat e Conexões

## 1. Criar Tabelas no Supabase

Execute o script `create-connections-tables.sql` no SQL Editor do Supabase Dashboard:

1. Acesse o Supabase Dashboard
2. Vá para "SQL Editor"
3. Cole o conteúdo do arquivo `create-connections-tables.sql`
4. Clique em "Run"

## 2. Estrutura das Tabelas

### Tabela `connections`
- `id`: UUID único da conexão
- `user_id`: ID do usuário que iniciou a conexão
- `partner_id`: ID do parceiro de treino
- `status`: 'pending', 'accepted', 'rejected'
- `created_at`: Data de criação
- `updated_at`: Data da última atualização

### Tabela `messages`
- `id`: UUID único da mensagem
- `connection_id`: ID da conexão relacionada
- `sender_id`: ID do usuário que enviou a mensagem
- `content`: Conteúdo da mensagem
- `created_at`: Data de envio

## 3. Funcionalidades Implementadas

### Dashboard
- **Aba Conexões**: Lista de parceiros conectados e chat
- **Aba Estatísticas**: Informações do perfil e estatísticas
- **Chat em tempo real**: Interface de mensagens
- **Lista de conexões**: Parceiros aceitos e pendentes

### Header
- Mostra nome do perfil em vez do email
- Botão "Editar" ao lado do nome
- Botão "Sair" para logout

### Partners
- Botão "Conectar" em cada perfil
- Sistema de solicitações de conexão

## 4. Próximos Passos

### Implementar Conexões Reais
1. Descomente o código no `handleConnect` em `Partners.tsx`
2. Descomente o código no `fetchConnections` em `Dashboard.tsx`
3. Descomente o código no `fetchMessages` em `Dashboard.tsx`
4. Descomente o código no `sendMessage` em `Dashboard.tsx`

### Melhorias Futuras
- Notificações em tempo real
- Indicador de mensagens não lidas
- Histórico de treinos realizados
- Sistema de avaliações
- Filtros avançados no chat

## 5. Políticas de Segurança (RLS)

As tabelas já estão configuradas com Row Level Security:

- Usuários só veem suas próprias conexões
- Usuários só enviam mensagens para conexões aceitas
- Usuários só podem atualizar suas próprias conexões

## 6. Teste do Sistema

1. Crie dois usuários diferentes
2. Faça login com um usuário
3. Vá para "Parceiros(as)" e clique em "Conectar"
4. Faça login com o outro usuário
5. Vá para "Dashboard" e verifique a aba "Conexões"
6. Teste o chat entre os usuários

## 7. Estrutura de Arquivos Atualizada

```
src/
├── pages/
│   ├── Dashboard.tsx (completamente reformulado)
│   ├── Partners.tsx (atualizado com botão conectar)
│   └── ProfileEdit.tsx (mantido)
├── components/
│   └── Header.tsx (atualizado com nome do perfil)
└── create-connections-tables.sql (novo)
```

O sistema está pronto para uso com dados de exemplo. Para implementar completamente, siga os passos acima para descomentar o código real do Supabase. 