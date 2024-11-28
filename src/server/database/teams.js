/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
async function addTeam(name, color) {
  try {
    const query = 'INSERT INTO Team (Name, Color) VALUES (?, ?)';
    const [result] = await this.connection.execute(query, [name, color]);
    return { success: true, error:null, data: result.insertId };
  }
  catch (err) {
    console.error('Error adding team:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function getTeams() {
  try {
    const query = `
    SELECT 
      t.ID AS id,
      t.Name AS name,
      t.Color AS color
    FROM Team t;`;
    const [teams] = await this.connection.execute(query);

    if (teams.length === 0) return { success: true, error:'No teams found', data: [] };

    return { success: true, error:null, data: teams };
  }
  catch (err) {
    console.error('Error getting teams:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function updateTeamById(id, name, color) {
  try {
    const query = 'UPDATE Team SET Name = ?, Color = ? WHERE ID = ?';
    const [result] = await this.connection.execute(query, [name, color, id]);
    return { success: true, error:null, data: result.affectedRows };
  }
  catch (err) {
    console.error('Error updating team:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function deleteTeamById(id, force) {
  try {
    if (!force) {
      const query = 'SELECT COUNT(*) AS count FROM Enrollment WHERE TeamID = ?';
      const [result] = await this.connection.execute(query, [id]);
      if (result[0].count > 0) {
        return { success: false, error:'Team has children', data: null };
      }
    } else {
      const query = 'UPDATE Enrollment SET TeamID = NULL WHERE TeamID = ?';
      await this.connection.execute(query, [id]);
    }

    const query = 'DELETE FROM Team WHERE ID = ?';
    const [result] = await this.connection.execute(query, [id]);
    return { success: true, error:null, data: result.affectedRows };
  }
  catch (err) {
    console.error('Error deleting team:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

module.exports = {
  addTeam,
  getTeams,
  updateTeamById,
  deleteTeamById
};