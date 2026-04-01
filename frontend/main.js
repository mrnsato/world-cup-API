const API_URL = 'http://localhost:3000/api';

// ====== NAVEGAÇÃO ENTRE PÁGINAS ======
function setupNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active de todos os botões
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      // Remove active de todas as páginas
      document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
      
      // Adiciona active ao botão clicado
      button.classList.add('active');
      
      // Mostra a página correspondente
      const page = button.dataset.page;
      const pageElement = document.querySelector(`#${page}-page`);
      pageElement.classList.add('active');
      
      // Renderiza o conteúdo
      if (page === 'games') {
        renderGames();
      } else if (page === 'groups') {
        renderGroups();
      }
    });
  });
}

// ====== FUNÇÕES AUXILIARES ======
function createGame(player1, hour, player2, gameId = null) {
  const clickHandler = gameId ? `onclick="editGameModal('${gameId}')"` : '';
  
  return `
  <li ${clickHandler} style="cursor: ${gameId ? 'pointer' : 'default'}">
    <img src="./assets/icon-${player1}.svg" alt="Bandeira do ${player1}" />
    <strong>${hour}</strong>
    <img src="./assets/icon-${player2}.svg" alt="Bandeira da ${player2}" />
  </li>
  `;
}

function createCard(date, day, games) {
  return `
  <div class="card">
    <h2>${date} <span>${day}</span></h2>
    <ul id="cards">
      ${games}
    </ul>
  </div>
  `;
}

// ====== BUSCAR DADOS DA API ======
async function loadGames() {
  try {
    const response = await fetch(`${API_URL}/games`);
    if (!response.ok) throw new Error('Erro ao buscar jogos');
    
    const games = await response.json();
    return games;
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

async function loadGroups() {
  try {
    const response = await fetch(`${API_URL}/groups`);
    if (!response.ok) throw new Error('Erro ao buscar grupos');
    
    const groups = await response.json();
    return groups;
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

async function loadStandings(groupId) {
  try {
    const response = await fetch(`${API_URL}/standings/${groupId}`);
    if (!response.ok) throw new Error('Erro ao buscar classificação');
    
    const standings = await response.json();
    return standings;
  } catch (error) {
    console.error('Erro:', error);
    return [];
  }
}

// ====== RENDERIZAR PÁGINA DE JOGOS ======
async function renderGames() {
  const games = await loadGames();
  const container = document.querySelector("#games-content");
  
  if (games.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #e1e1e6;">Nenhum jogo registrado ainda.</p>';
    return;
  }

  // Agrupar jogos por data
  const gamesByDate = {};
  games.forEach(game => {
    if (!gamesByDate[game.date]) {
      gamesByDate[game.date] = [];
    }
    gamesByDate[game.date].push(game);
  });

  let cardsHTML = '<div id="cards">';
  
  Object.keys(gamesByDate).forEach(date => {
    const dayOfWeek = new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase();
    const gamesOfDate = gamesByDate[date]
      .map(game => {
        const result = game.played 
          ? `${game.team1_goals}x${game.team2_goals}`
          : game.time;
        return createGame(
          game.team1_id.toLowerCase(),
          result,
          game.team2_id.toLowerCase(),
          game.id
        );
      })
      .join('');
    
    cardsHTML += createCard(date, dayOfWeek, gamesOfDate);
  });

  cardsHTML += '</div>';
  container.innerHTML = cardsHTML;
}

// ====== RENDERIZAR PÁGINA DE GRUPOS ======
async function renderGroups() {
  const groups = await loadGroups();
  const container = document.querySelector("#groups-content");
  let standingsHTML = '<div class="standings-container">';

  for (const group of groups) {
    const standings = await loadStandings(group.id);
    
    standingsHTML += `
    <div class="group-standings">
      <h3>${group.name}</h3>
      <table class="standings-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Time</th>
            <th>J</th>
            <th>V</th>
            <th>E</th>
            <th>D</th>
            <th>GF</th>
            <th>GC</th>
            <th>SG</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
    `;

    standings.forEach((team, index) => {
      const saldo = team.goals_for - team.goals_against;
      const advancedClass = team.advanced ? 'advanced' : '';
      standingsHTML += `
        <tr>
          <td>${index + 1}</td>
          <td class="team-name ${advancedClass}">${team.name}</td>
          <td>${team.played}</td>
          <td>${team.wins}</td>
          <td>${team.draws}</td>
          <td>${team.losses}</td>
          <td>${team.goals_for}</td>
          <td>${team.goals_against}</td>
          <td>${saldo > 0 ? '+' : ''}${saldo}</td>
          <td><strong>${team.points}</strong></td>
        </tr>
      `;
    });

    standingsHTML += `
        </tbody>
      </table>
    </div>
    `;
  }

  standingsHTML += '</div>';
  container.innerHTML = standingsHTML;
}

// ====== FUNÇÃO PARA ATUALIZAR RESULTADO ======
async function updateGameResult(gameId, team1Goals, team2Goals) {
  try {
    const response = await fetch(`${API_URL}/games/${gameId}/result`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team1Goals, team2Goals })
    });

    if (!response.ok) throw new Error('Erro ao atualizar resultado');

    const result = await response.json();
    console.log('✅ Resultado atualizado:', result);
    
    // Re-renderiza os jogos e a classificação
    renderGames();
    renderGroups();
  } catch (error) {
    console.error('❌ Erro:', error);
    alert('Erro ao registrar resultado: ' + error.message);
  }
}

// ====== MODAL PARA EDITAR RESULTADO ======
function editGameModal(gameId) {
  const team1Goals = prompt('Gols do Time 1:');
  if (team1Goals === null) return;
  
  const team2Goals = prompt('Gols do Time 2:');
  if (team2Goals === null) return;
  
  updateGameResult(gameId, parseInt(team1Goals), parseInt(team2Goals));
}

// ====== INICIALIZAR ======
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  renderGames();
});

// Expor funções globais para console
window.updateGameResult = updateGameResult;
window.loadGames = renderGames;
window.loadStandings = renderGroups;
