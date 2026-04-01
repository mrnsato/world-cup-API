import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'worldcup.db');

// Criar conexão com o banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Erro ao conectar ao banco:', err);
  else console.log('✅ Conectado ao banco de dados');
});

// Habilita foreign keys
db.run('PRAGMA foreign_keys = ON');

export function initializeDatabase() {
  // Tabela de grupos
  db.run(`
    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phase TEXT NOT NULL DEFAULT 'group'
    )
  `);

  // Tabela de times
  db.run(`
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      group_id TEXT NOT NULL,
      played INTEGER DEFAULT 0,
      wins INTEGER DEFAULT 0,
      draws INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      goals_for INTEGER DEFAULT 0,
      goals_against INTEGER DEFAULT 0,
      points INTEGER DEFAULT 0,
      advanced BOOLEAN DEFAULT 0,
      FOREIGN KEY (group_id) REFERENCES groups(id)
    )
  `);

  // Tabela de jogos
  db.run(`
    CREATE TABLE IF NOT EXISTS games (
      id TEXT PRIMARY KEY,
      team1_id TEXT NOT NULL,
      team2_id TEXT NOT NULL,
      group_id TEXT,
      phase TEXT NOT NULL DEFAULT 'group',
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      team1_goals INTEGER,
      team2_goals INTEGER,
      played BOOLEAN DEFAULT 0,
      next_round_winner TEXT,
      FOREIGN KEY (team1_id) REFERENCES teams(id),
      FOREIGN KEY (team2_id) REFERENCES teams(id),
      FOREIGN KEY (group_id) REFERENCES groups(id)
    )
  `);

  // Tabela de fases
  db.run(`
    CREATE TABLE IF NOT EXISTS phases (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      round_number INTEGER NOT NULL,
      status TEXT DEFAULT 'pending'
    )
  `);

  console.log('📊 Database initialized successfully');
}

// Funções para grupos
export function getGroups() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM groups ORDER BY id', (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

export function createGroup(id, name) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO groups (id, name) VALUES (?, ?)', [id, name], function(err) {
      if (err) reject(err);
      else resolve({ id, name });
    });
  });
}

// Funções para times
export function getTeamsByGroup(groupId) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT * FROM teams 
      WHERE group_id = ? 
      ORDER BY points DESC, (goals_for - goals_against) DESC, goals_for DESC
    `, [groupId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

export function getTeam(teamId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM teams WHERE id = ?', [teamId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function createTeam(id, name, groupId) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO teams (id, name, group_id) VALUES (?, ?, ?)', [id, name, groupId], function(err) {
      if (err) reject(err);
      else resolve({ id, name, groupId });
    });
  });
}

export function updateTeamStats(teamId, stats) {
  return new Promise((resolve, reject) => {
    db.run(`
      UPDATE teams 
      SET played = ?, wins = ?, draws = ?, losses = ?, 
          goals_for = ?, goals_against = ?, points = ?
      WHERE id = ?
    `, [stats.played, stats.wins, stats.draws, stats.losses, 
        stats.goalsFor, stats.goalsAgainst, stats.points, teamId], function(err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function markTeamAdvanced(teamId) {
  return new Promise((resolve, reject) => {
    db.run('UPDATE teams SET advanced = 1 WHERE id = ?', [teamId], function(err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

// Funções para jogos
export function getGamesByPhase(phase) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT g.*, 
             t1.name as team1_name, t1.group_id as team1_group,
             t2.name as team2_name, t2.group_id as team2_group
      FROM games g
      JOIN teams t1 ON g.team1_id = t1.id
      JOIN teams t2 ON g.team2_id = t2.id
      WHERE g.phase = ?
      ORDER BY g.date, g.time
    `, [phase], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

export function getGamesByGroup(groupId) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT g.*,
             t1.name as team1_name,
             t2.name as team2_name
      FROM games g
      JOIN teams t1 ON g.team1_id = t1.id
      JOIN teams t2 ON g.team2_id = t2.id
      WHERE g.group_id = ?
      ORDER BY g.date, g.time
    `, [groupId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

export function getGame(gameId) {
  return new Promise((resolve, reject) => {
    db.get(`
      SELECT g.*,
             t1.name as team1_name,
             t2.name as team2_name
      FROM games g
      JOIN teams t1 ON g.team1_id = t1.id
      JOIN teams t2 ON g.team2_id = t2.id
      WHERE g.id = ?
    `, [gameId], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

export function createGame(id, team1Id, team2Id, groupId, phase, date, time) {
  return new Promise((resolve, reject) => {
    db.run(`
      INSERT INTO games (id, team1_id, team2_id, group_id, phase, date, time)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [id, team1Id, team2Id, groupId, phase, date, time], function(err) {
      if (err) reject(err);
      else resolve({ id, team1Id, team2Id, groupId, phase, date, time });
    });
  });
}

export function updateGameResult(gameId, team1Goals, team2Goals, nextRoundWinner = null) {
  return new Promise((resolve, reject) => {
    db.run(`
      UPDATE games
      SET team1_goals = ?, team2_goals = ?, played = 1, next_round_winner = ?
      WHERE id = ?
    `, [team1Goals, team2Goals, nextRoundWinner, gameId], function(err) {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function getStandings(groupId) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT * FROM teams
      WHERE group_id = ?
      ORDER BY points DESC, (goals_for - goals_against) DESC, goals_for DESC
    `, [groupId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

export function getAdvancedTeams() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM teams WHERE advanced = 1', (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

export function getAllGames() {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT g.*,
             t1.name as team1_name,
             t2.name as team2_name
      FROM games g
      JOIN teams t1 ON g.team1_id = t1.id
      JOIN teams t2 ON g.team2_id = t2.id
      ORDER BY g.date, g.time
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

export default db;
