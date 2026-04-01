import { getTeam, updateTeamStats, getStandings, markTeamAdvanced } from './database.js';

export async function calculateTeamStats(teamId, goalsFor, goalsAgainst, result) {
  const team = await getTeam(teamId);
  
  let stats = {
    played: team.played + 1,
    wins: team.wins,
    draws: team.draws,
    losses: team.losses,
    goalsFor: team.goals_for + goalsFor,
    goalsAgainst: team.goals_against + goalsAgainst,
    points: team.points,
  };

  if (result === 'win') {
    stats.wins += 1;
    stats.points += 3;
  } else if (result === 'draw') {
    stats.draws += 1;
    stats.points += 1;
  } else if (result === 'loss') {
    stats.losses += 1;
  }

  await updateTeamStats(teamId, stats);
  return stats;
}

export async function updateGroupStandings(groupId) {
  const standings = await getStandings(groupId);
  
  // Os 2 primeiros times do grupo avançam
  for (const team of standings.slice(0, 2)) {
    await markTeamAdvanced(team.id);
  }

  return standings;
}

export function determineWinner(team1Goals, team2Goals) {
  if (team1Goals > team2Goals) return 'team1';
  if (team2Goals > team1Goals) return 'team2';
  return 'draw';
}
