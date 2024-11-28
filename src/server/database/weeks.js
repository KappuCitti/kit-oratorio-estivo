/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
async function getAllWeeksByYear(year) {
  if (!year) return { success: false, error:'Year not provided', data: null };

  try {
    const getWeeksByYearQuery = `
    SELECT
      w.ID AS id,
      w.startDate AS start,
      w.endDate AS end
    FROM Week w
    WHERE YEAR(w.startDate) = ?;`;

    const [weeks] = await this.connection.execute(getWeeksByYearQuery, [year]);
    if (weeks.length === 0) return { success: true, error:'No weeks found', data: [] };
    return {
      success: true, error:null, data: weeks
    };
  }
  catch (err) {
    console.error('Error getting weeks:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function getWeekByDate(date) {
  if (!date) return { success: false, error:'Date not provided', data: null };

  try {
    const getWeekByDateQuery = `
    SELECT
      w.ID AS id,
      w.startDate AS start,
      w.endDate AS end
    FROM Week w
    WHERE w.startDate <= ? AND w.endDate >= ?;`;

    const [weeks] = await this.connection.execute(getWeekByDateQuery, [date, date]);
    if (weeks.length === 0) return { success: true, error:'No weeks found', data: [] };

    if (weeks.length > 1) {
      return {
        success: true, error:'More than one week found', data: weeks
      };
    }
    return {
      success: true, error:null, data: weeks
    };
  }
  catch (err) {
    console.error('Error getting weeks:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

module.exports = {
  getAllWeeksByYear,
  getWeekByDate
}