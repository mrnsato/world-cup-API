import express from 'express';
import cors from 'cors';
import {
  initializeDatabase,
  getGroups,
  createGroup,
  getTeamsByGroup,
  createTeam,
  getGamesByPhase,
  getGamesByGroup,
  createGame,
  updateGameResult,
  getGame,
  getStandings,
  getAdvancedTeams,
  getAllGames,
} from './database.js';
import { calculateTeamStats, updateGroupStandings, determineWinner } from './gameLogic.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Inicializar banco de dados
initializeDatabase();

// Seed do banco de dados com grupos A-L e times
async function seedDatabase() {
  const groupsData = [
    { id: 'A', name: 'Grupo A' },
    { id: 'B', name: 'Grupo B' },
    { id: 'C', name: 'Grupo C' },
    { id: 'D', name: 'Grupo D' },
    { id: 'E', name: 'Grupo E' },
    { id: 'F', name: 'Grupo F' },
    { id: 'G', name: 'Grupo G' },
    { id: 'H', name: 'Grupo H' },
    { id: 'I', name: 'Grupo I' },
    { id: 'J', name: 'Grupo J' },
    { id: 'K', name: 'Grupo K' },
    { id: 'L', name: 'Grupo L' },
  ];

  const teamsData = [
    // Grupo A
    { id: 'qatar', name: 'Qatar', group: 'A' },
    { id: 'ecuador', name: 'Equador', group: 'A' },
    { id: 'senegal', name: 'Senegal', group: 'A' },
    { id: 'netherlands', name: 'Holanda', group: 'A' },
    
    // Grupo B
    { id: 'england', name: 'Inglaterra', group: 'B' },
    { id: 'iran', name: 'Irã', group: 'B' },
    { id: 'unitedstates', name: 'EUA', group: 'B' },
    { id: 'wales', name: 'País de Gales', group: 'B' },
    
    // Grupo C
    { id: 'argentina', name: 'Argentina', group: 'C' },
    { id: 'saudiarab', name: 'Arábia Saudita', group: 'C' },
    { id: 'mexico', name: 'México', group: 'C' },
    { id: 'poland', name: 'Polônia', group: 'C' },
    
    // Grupo D
    { id: 'france', name: 'França', group: 'D' },
    { id: 'australia', name: 'Austrália', group: 'D' },
    { id: 'denmark', name: 'Dinamarca', group: 'D' },
    { id: 'tunisia', name: 'Tunísia', group: 'D' },
    
    // Grupo E
    { id: 'spain', name: 'Espanha', group: 'E' },
    { id: 'costarica', name: 'Costa Rica', group: 'E' },
    { id: 'germany', name: 'Alemanha', group: 'E' },
    { id: 'japan', name: 'Japão', group: 'E' },
    
    // Grupo F
    { id: 'belgium', name: 'Bélgica', group: 'F' },
    { id: 'canada', name: 'Canadá', group: 'F' },
    { id: 'morroco', name: 'Marrocos', group: 'F' },
    { id: 'croatia', name: 'Croácia', group: 'F' },
    
    // Grupo G
    { id: 'brazil', name: 'Brasil', group: 'G' },
    { id: 'serbia', name: 'Sérvia', group: 'G' },
    { id: 'switzerland', name: 'Suíça', group: 'G' },
    { id: 'cameroon', name: 'Camarões', group: 'G' },
    
    // Grupo H
    { id: 'portugal', name: 'Portugal', group: 'H' },
    { id: 'ghana', name: 'Gana', group: 'H' },
    { id: 'uruguay', name: 'Uruguai', group: 'H' },
    { id: 'southkorea', name: 'Coreia do Sul', group: 'H' },
  ];

  try {
    // Criar grupos
    for (const group of groupsData) {
      try {
        await createGroup(group.id, group.name);
      } catch (e) {
        // Grupo já existe
      }
    }

    // Criar times
    for (const team of teamsData) {
      try {
        await createTeam(team.id, team.name, team.group);
      } catch (e) {
        // Time já existe
      }
    }

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Seed do banco ao iniciar
seedDatabase();

// ====== ROTAS PARA GRUPOS ======
app.get('/api/groups', async (req, res) => {
  try {
    const groups = await getGroups();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/groups', async (req, res) => {
  try {
    const { id, name } = req.body;
    await createGroup(id, name);
    res.status(201).json({ id, name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====== ROTAS PARA TIMES ======
app.get('/api/groups/:groupId/teams', async (req, res) => {
  try {
    const { groupId } = req.params;
    const teams = await getTeamsByGroup(groupId);
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/teams', async (req, res) => {
  try {
    const { id, name, groupId } = req.body;
    await createTeam(id, name, groupId);
    res.status(201).json({ id, name, groupId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====== ROTAS PARA JOGOS ======
app.get('/api/games', async (req, res) => {
  try {
    const games = await getAllGames();
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/games/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const game = await getGame(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/games/phase/:phase', async (req, res) => {
  try {
    const { phase } = req.params;
    const games = await getGamesByPhase(phase);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/groups/:groupId/games', async (req, res) => {
  try {
    const { groupId } = req.params;
    const games = await getGamesByGroup(groupId);
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/games', async (req, res) => {
  try {
    const { id, team1Id, team2Id, groupId, phase, date, time } = req.body;
    await createGame(id, team1Id, team2Id, groupId, phase, date, time);
    res.status(201).json({ id, team1Id, team2Id, groupId, phase, date, time });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/games/:gameId/result', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { team1Goals, team2Goals } = req.body;

    const game = await getGame(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Jogo não encontrado' });
    }

    // Determinar resultado
    const result = determineWinner(team1Goals, team2Goals);

    // Atualizar stats dos times
    if (result === 'team1') {
      await calculateTeamStats(game.team1_id, team1Goals, team2Goals, 'win');
      await calculateTeamStats(game.team2_id, team2Goals, team1Goals, 'loss');
    } else if (result === 'team2') {
      await calculateTeamStats(game.team1_id, team1Goals, team2Goals, 'loss');
      await calculateTeamStats(game.team2_id, team2Goals, team1Goals, 'win');
    } else {
      await calculateTeamStats(game.team1_id, team1Goals, team2Goals, 'draw');
      await calculateTeamStats(game.team2_id, team2Goals, team1Goals, 'draw');
    }

    // Atualizar resultado do jogo
    await updateGameResult(gameId, team1Goals, team2Goals);

    // Se for fase de grupos, atualizar classificação
    if (game.group_id) {
      await updateGroupStandings(game.group_id);
    }

    res.json({
      message: 'Resultado atualizado com sucesso',
      gameId,
      team1Goals,
      team2Goals,
      result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====== ROTAS PARA CLASSIFICAÇÕES ======
app.get('/api/standings/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const standings = await getStandings(groupId);
    res.json(standings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====== ROTAS PARA TIMES AVANÇADOS ======
app.get('/api/advanced-teams', async (req, res) => {
  try {
    const teams = await getAdvancedTeams();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 API ready for World Cup 2026`);
  console.log(`📱 Grupos: A-L`);
});
