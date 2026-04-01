# 🏆 World Cup 2026 API

Uma plataforma completa para gerenciar a Copa do Mundo de 2026 com **12 grupos (A-L)**, **API RESTful** e **atualização automática de resultados**.

## 🎯 Recursos

✅ **Backend Robusto**
- Node.js + Express
- Banco de dados SQLite
- API RESTful com CORS
- 12 Grupos com 4 times cada
- Atualização automática de pontuação e avanços

✅ **Frontend Dinâmico**  
- Calendário de jogos por data
- Classificações em tempo real
- Atualização automática ao registrar resultados
- Interface limpa e responsiva

## 📁 Estrutura do Projeto

```
world-cup-API/
├── backend/              
│   ├── server.js         (API RESTful)
│   ├── database.js       (SQLite)
│   ├── gameLogic.js      (Lógica de pontuação)
│   ├── seed.js           (Dados iniciais)
│   └── package.json
│
└── frontend/              
    ├── index.html        (Layout)
    ├── main.js           (Consome API)
    ├── style.css         (Estilos)
    └── assets/           (Bandeiras, logos)
```

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
npm install
npm start
```

Servidor rodando: `http://localhost:3000`

### 2. Frontend (novo terminal)

```bash
cd frontend
npx http-server
# ou
python3 -m http.server 8000
```

Abra: `http://localhost:8000`

## 📊 API Endpoints

### Grupos
```bash
GET    /api/groups               # Listar todos
POST   /api/groups               # Criar novo
```

### Times
```bash
GET    /api/groups/:groupId/teams   # Listar por grupo
POST   /api/teams                   # Criar novo
```

### Jogos
```bash
GET    /api/games                   # Listar todos
GET    /api/games/:gameId           # Detalhes
PUT    /api/games/:gameId/result    # Registrar resultado ⭐
GET    /api/groups/:groupId/games   # Jogos por grupo
```

### Classificações
```bash
GET    /api/standings/:groupId       # Classificação
GET    /api/advanced-teams           # Times que avançaram
```

## 🧪 Testando

```bash
# Listar todos os grupos
curl http://localhost:3000/api/groups

# Listar times do Grupo A
curl http://localhost:3000/api/groups/A/teams

# Registrar resultado
curl -X PUT http://localhost:3000/api/games/game-1/result \
  -H "Content-Type: application/json" \
  -d '{"team1Goals": 2, "team2Goals": 1}'

# Ver classificação
curl http://localhost:3000/api/standings/A
```

## 🎮 Como Usar o Frontend

O frontend conecta automaticamente na API e exibe:
- 📅 Jogos agrupados por data
- 🏆 Classificações dos grupos
- ⚡ Atualização em tempo real

Use no console do navegador:
```javascript
// Registrar resultado de um jogo
updateGameResult('game-1', 2, 1);

// Recarregar dados
loadGames();
loadStandings('A');
```

## 🛠️ Tecnologias

**Backend:**
- Node.js 24+
- Express.js 4.18
- SQLite 3
- CORS habilitado

**Frontend:**
- HTML5
- CSS3
- JavaScript ES6+
- Fetch API

## 📚 Documentação Completa

Ver [SETUP.md](./SETUP.md) para guia detalhado e troubleshooting.

## 🎯 Melhorias Futuras

- [ ] Fases eliminatórias (Round of 16, Quartas, etc)
- [ ] Interface para registrar resultados  
- [ ] WebSocket para atualizações em tempo real
- [ ] Autenticação de usuários
- [ ] Histórico de jogos
- [ ] Notificações push

## 📄 Licença

MIT

---

Made with ⚽ for Copa 2026

Feito por mim!
