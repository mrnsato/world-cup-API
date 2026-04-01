# 🎯 Quick Commands - World Cup 2026 API

## ⚡ Run Everything (Option A - Recommended)

```bash
# From root directory - runs backend + frontend together
npm run dev      # Development with auto-reload
npm start        # Production mode
```

Then open **http://localhost:8000** in your browser

---

## ⚡ Alternative: Run Services Separately (Option B)

### Terminal 1 - Backend
```bash
cd backend
npm install  # (first time only)
npm start    # or npm run dev for development
```

### Terminal 2 - Frontend  
```bash
cd frontend
npx http-server -p 8000
```

### Browser
```
http://localhost:8000
```

---

## 📊 Testes Rápidos da API

```bash
# Todos os grupos
curl http://localhost:3000/api/groups

# Times do Grupo A
curl http://localhost:3000/api/groups/A/teams

# Todos os jogos
curl http://localhost:3000/api/games

# Registrar resultado ⭐ (MAIN!)
curl -X PUT http://localhost:3000/api/games/game-1/result \
  -H "Content-Type: application/json" \
  -d '{"team1Goals": 2, "team2Goals": 1}'

# Ver classificação após registrar
curl http://localhost:3000/api/standings/A
```

---

## 🎮 Usar no Navegador (Console)

```javascript
// Registrar resultado de um jogo
updateGameResult('game-1', 3, 2);

// Recarregar tudo
loadGames();
loadStandings('A');
```

---

## 📝 Estrutura

```
backend/
├── server.js       ← API REST
├── database.js     ← SQLite
├── gameLogic.js    ← Pontuação
└── package.json

frontend/
├── index.html      ← Layout
├── main.js         ← Conecta API
├── style.css       ← Estilos  
└── assets/         ← Bandeiras
```

---

## ✅ Status

- ✅ 12 Grupos (A-L)
- ✅ 32 Times
- ✅ API RESTful funcionando
- ✅ Frontend conectado
- ✅ Atualização automática

---

## 🐛 Problemas?

**Porta 3000 em uso:**
```bash
pkill -f "node server.js"
```

**Ver logs do servidor:**
```bash
cd backend
npm start
```

**Limpar banco de dados:**
```bash
rm backend/worldcup.db
# Reinicie o servidor
```

---

Pronto! 🚀 A Copa está funcionando!
