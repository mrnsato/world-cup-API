# 🏆 World Cup 2026 API - Guia de Setup

## 📁 Estrutura do Projeto

```
world-cup-API/
├── backend/                (Node.js + API)
│   ├── server.js          (servidor principal)
│   ├── database.js        (gerenciamento de dados)
│   ├── gameLogic.js       (lógica de pontuação)
│   ├── package.json
│   ├── seed.js            (popular dados)
│   └── worldcup.db        (banco SQLite)
│
├── frontend/              (HTML + CSS + JS)
│   ├── index.html
│   ├── main.js            (consome API)
│   ├── style.css
│   └── assets/
│
└── README.md
```

## 🚀 Instalação Rápida

### 1. Instalar dependências do backend

```bash
cd backend
npm install
```

### 2. Iniciar o servidor

```bash
npm start
```

Você verá:
```
📊 Database initialized successfully
🚀 Server running at http://localhost:3000
📊 API ready for World Cup 2026
📱 Grupos: A-L
✅ Conectado ao banco de dados
✅ Database seeded successfully
```

### 3. Em outro terminal, servir o frontend

```bash
cd frontend
npx http-server
```

Ou com Python:
```bash
python3 -m http.server 8000
```

### 4. Abrir no navegador

Acesse: `http://localhost:8000`

---

## 🧪 Testando a API

### Listar grupos
```bash
curl http://localhost:3000/api/groups
```

### Listar times de um grupo
```bash
curl http://localhost:3000/api/groups/A/teams
```

### Registrar resultado de um jogo
```bash
curl -X PUT http://localhost:3000/api/games/game-1/result \
  -H "Content-Type: application/json" \
  -d '{"team1Goals": 2, "team2Goals": 1}'
```

### Obter classificação de um grupo
```bash
curl http://localhost:3000/api/standings/A
```

---

## 📱 Usando o Frontend

O frontend:
- ✅ Conecta automaticamente na API (porta 3000)
- ✅ Exibe jogos em cards por data
- ✅ Mostra classificações dos grupos em tabelas
- ✅ Recarrega quando um resultado é atualizado

### Funções disponíveis no console:
```javascript
// Atualizar resultado
updateGameResult('game-1', 2, 1);

// Carregar todos os jogos
loadGames();

// Carregar classificação
loadStandings('A');
```

---

## 🎯 Próximos Passos

- [ ] Adicionar fases eliminatórias (Round of 16, Quartas, etc)
- [ ] Criar interface para registrar resultados
- [ ] Adicionar autenticação
- [ ] Expandir para todos os 12 grupos com times reais
- [ ] Adicionar notificações em tempo real (WebSocket)

---

## 🆘 Troubleshooting

**Erro: "Port 3000 already in use"**
```bash
lsof -i :3000 | grep -v COMMAND | awk '{print $2}' | xargs kill -9
```

**Erro: "CORS error"**
Certifique-se de que:
- Backend rodando em `http://localhost:3000`
- Frontend em `http://localhost:8000` (ou outra porta)

**Erro: "Cannot find module..."**
```bash
cd backend
npm install
```

---

## 📚 API Endpoints Completos

### Grupos
- `GET /api/groups` - Listar todos
- `POST /api/groups` - Criar novo

### Times  
- `GET /api/groups/:groupId/teams` - Listar por grupo
- `POST /api/teams` - Criar novo

### Jogos
- `GET /api/games` - Listar todos
- `GET /api/games/:gameId` - Detalhes
- `GET /api/games/phase/:phase` - Por fase
- `GET /api/groups/:groupId/games` - Por grupo
- `POST /api/games` - Criar novo
- `PUT /api/games/:gameId/result` - Atualizar resultado

### Classificações
- `GET /api/standings/:groupId` - Classificação
- `GET /api/advanced-teams` - Times avançados

---

Divirta-se! ⚽🎉
