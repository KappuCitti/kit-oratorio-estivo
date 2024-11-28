/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
async function getLeaderboard(year) {
  if (!year) year = new Date().getFullYear();
  try {
    let query = `
      SELECT r.TeamID as teamId, r.Points as points, t.Name as teamName, t.Color as teamColor
      FROM Ranking r
      JOIN Team t ON r.TeamID = t.ID
      WHERE 1 = 1
    `;
    const filters = [];

    if (year) {
      filters.push(year);
      query += ' AND YEAR(r.Date) = ?';
    }

    const [results] = await this.connection.execute(query, filters);

    const scoreboard = results.reduce((acc, row) => {
      const teamId = row.teamId;
      const points = row.points;  // Punteggio della squadra
      const teamName = row.teamName;
      const teamColor = row.teamColor;

      if (!acc[teamId]) {
        acc[teamId] = {
          team: {
            id: teamId,
            name: teamName,
            color: teamColor,
          },
          points: 0
        };
      }

      acc[teamId].points += points;

      return acc;
    }, {});

    return { success: true, data: Object.values(scoreboard).sort((a, b) => b.points - a.points), error: null };
  } catch (error) {
    console.error('Error getting leaderboard:', error.message);
    return { success: false, data: null, error: error.message };
  }
}

async function addScore(teamId, date, points, reason, userId) {
  if (!teamId || !date || !points || !userId) {
    return { success: false, data: null, error: 'Missing required fields' };
  }
  if (!reason) reason = null;

  try {
    const [result] = await this.connection.execute('INSERT INTO Ranking (TeamID, Date, Points, Reason, UserID) VALUES (?, ?, ?, ?, ?)', [teamId, date, points, reason, userId]);
    return { success: true, data: result, error: null };
  } catch (error) {
    console.error('Error adding score:', error.message);
    return { success: false, data: null, error: error.message };
  }

}

async function getScores(year, limit, offset) {
  if (!year) year = new Date().getFullYear();
  if (!limit) limit = 25;
  if (!offset) offset = 0;

  try {
    let query = `
      SELECT r.ID as id, r.Date as date, r.Points as points, r.Reason as reason,
             t.ID as teamId, t.Name as teamName, t.Color as teamColor,
             u.ID as userId, u.Name as userName, u.Surname as userSurname
      FROM Ranking r
      JOIN Team t ON r.TeamID = t.ID
      LEFT JOIN User u ON r.UserID = u.ID
      WHERE 1 = 1
    `;
    const filters = [];

    if (year) {
      filters.push(year);
      query += ' AND YEAR(r.Date) = ?';
    }

    const [total] = await this.connection.execute(`SELECT COUNT(*) AS total FROM (${query}) AS results`, filters);

    query += ` ORDER BY ID DESC LIMIT ${limit} OFFSET ${offset}`;
    const [results] = await this.connection.execute(query, filters);

    const leaderboard = results.map(row => ({
      id: row.id,
      team: {
        id: row.teamId,
        name: row.teamName,
        color: row.teamColor
      },
      points: row.points,
      date: row.date,
      reason: row.reason,
      user: row.userId ? {
        id: row.userId,
        name: row.userName,
        surname: row.userSurname
      } : null
    }));

    return { success: true, data: leaderboard, error: null, total: total[0].total };
  } catch (err) {
    console.error('Error fetching leaderboard:', err.message);
    return { success: false, error: err.message, data: null };
  }
}

async function updateScore(id, teamId, date, points, reason, userId) {
  if (!id) return { success: false, data: null, error: 'Missing score ID' };
  if (!teamId && !date && !points && !userId) return { success: false, data: null, error: 'Missing required fields' };
  if (!reason) reason = null;

  try {
    const query = [];
    const params = []

    if (teamId) {
      query.push('TeamID = ?');
      params.push(teamId);
    }
    if (date) {
      query.push('Date = ?');
      params.push(date);
    }
    if (points) {
      query.push('Points = ?');
      params.push(points);
    }
    if (reason) {
      query.push('Reason = ?');
      params.push(reason);
    }
    if (userId) {
      query.push('UserID = ?');
      params.push(userId);
    }

    const [result] = await this.connection.execute(`UPDATE Ranking SET ${query.join(', ')} WHERE ID = ?`, [teamId, date, points, reason, userId, id]);
    return { success: true, data: result, error: null };
  } catch (error) {
    console.error('Error updating score:', error.message);
    return { success: false, data: null, error: error.message };
  }
}

async function deleteScore(id) {
  if (!id) {
    return { success: false, data: null, error: 'Missing required fields' };
  }

  try {
    const [result] = await this.connection.execute('DELETE FROM Ranking WHERE ID = ?', [id]);
    return { success: true, data: result, error: null };
  } catch (error) {
    console.error('Error deleting score:', error.message);
    return { success: false, data: null, error: error.message };
  }
}

module.exports = {
  getLeaderboard,
  addScore,
  getScores,
  updateScore,
  deleteScore
}