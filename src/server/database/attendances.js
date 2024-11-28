/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
async function addAttendance(enrollmentId, date, present, eatsAtOratory, eatsInBianco) {
  if (!enrollmentId || !date) return { success: false, error:'Child ID or date not provided', data: null };
  if (!present) present = false;
  if (!eatsAtOratory) eatsAtOratory = false;
  if (!eatsInBianco) eatsInBianco = false;

  try {
    const insertAttendanceQuery = `
    INSERT INTO Attendance (EnrollmentID, Date, Present, EatsAtOratory, EatsInBianco)
    VALUES (?, ?, ?, ?, ?);
    `;

    await this.connection.execute(insertAttendanceQuery, [enrollmentId, date, present, eatsAtOratory, eatsInBianco]);
    return { success: true, error:null, data: null };
  } catch (err) {
    console.error('Error adding attendance:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function getAttendancesByDate(date, schoolType, classNumber) {
  if (!date) return { success: false, error:'Date not provided', data: null };

  let queryParams = [date, date, date];

  try {
    let getAttendancesByDateQuery = `
    SELECT
      c.ID AS childId,
      c.Name AS name,
      c.Surname AS surname,
      c.Gender AS gender,

      e.ID AS enrollmentId,
      
      a.ID AS attendanceId,
      a.Present AS present,
      a.EatsAtOratory AS eatsAtOratory,
      a.EatsInBianco AS eatsInBianco

    FROM Enrollment e
    JOIN Child c ON e.ChildID = c.ID
    LEFT JOIN Attendance a ON e.ID = a.EnrollmentID AND DATE(a.Date) = ?
    JOIN EnrollmentWeeks ew ON e.ID = ew.EnrollmentID
    JOIN Week w ON ew.WeekID = w.ID
    WHERE w.StartDate <= ? AND w.EndDate >= ?
    `;

    if (schoolType) {
      getAttendancesByDateQuery += ' AND e.SchoolType = ?';
      queryParams.push(schoolType);
    }
    if (classNumber) {
      getAttendancesByDateQuery += ' AND e.Class = ?';
      queryParams.push(classNumber);
    }

    const [attendances] = await this.connection.execute(getAttendancesByDateQuery, queryParams);

    if (attendances.length === 0) return { success: true, error:'No attendances found', data: [] };

    const children = {};

    const movementsPromises = attendances.map(async (row) => {
      const childId = row.childId;

      // Se non esiste già l'oggetto bambino, crealo
      if (!children[childId]) {
        children[childId] = {
          childId: childId,
          enrollmentId: row.enrollmentId,
          name: row.name,
          surname: row.surname,
          gender: row.gender,
          attendance: row.attendanceId ? {
            id: row.attendanceId,
            present: row.present,
            eatsAtOratory: row.eatsAtOratory,
            eatsInBianco: row.eatsInBianco,
            movements: []
          } : {
            // Se non esiste la presenza, ritorna un oggetto vuoto
            eatsAtOratory: false,
            eatsInBianco: false,
            present: false,
            movements: []
          }
        };
      }

      const movements = await this.getMovementsOfChildByDate(childId, date);

      if (movements.success && movements.data) {
        children[childId].attendance.movements = movements.data;
      }
    });

    await Promise.all(movementsPromises);

    return { success: true, error:null, data: Object.values(children) };

  } catch (err) {
    console.error('Error getting attendances:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function updateAttendanceById(attendanceId, present, eatsAtOratory, eatsInBianco) {
  if (!attendanceId) return { success: false, error:'Attendance ID not provided', data: null };
  if (!present) present = false;
  if (!eatsAtOratory) eatsAtOratory = false;
  if (!eatsInBianco) eatsInBianco = false;

  try {
    const updateAttendanceQuery = `
    UPDATE Attendance
    SET Present = ?, EatsAtOratory = ?, EatsInBianco = ?
    WHERE ID = ?;
    `;

    await this.connection.execute(updateAttendanceQuery, [present, eatsAtOratory, eatsInBianco, attendanceId]);
    return { success: true, error:null, data: null };
  } catch (err) {
    console.error('Error updating attendance:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function addMovementToAttendanceByChildId(childId, type, time, notes) {
  if (!childId) return { success: false, error:'Attendance ID not provided', data: null };
  if (!type) return { success: false, error:'Movement type not provided', data: null };
  if (!time) return { success: false, error:'Movement time not provided', data: null };

  try {
    const insertMovementQuery = `
    INSERT INTO Attendance_Details (childId, Type, Time, Notes)
    VALUES (?, ?, ?, ?);
    `;

    await this.connection.execute(insertMovementQuery, [childId, type, time, notes]);
    return { success: true, error:null, data: null };
  } catch (err) {
    console.error('Error adding movement:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function getMovementsOfChildByDate(childId, date) {
  if (!childId) return { success: false, error:'Child ID or date not provided', data: null };
  if (!date) date = null;

  try {
    let getMovementsOfChildByDateQueryParams = [childId];
    let getMovementsOfChildByDateQuery = `
    SELECT
      m.ID AS id,
      m.Type AS type,
      m.Time AS time,
      m.Notes AS notes
    FROM Attendance_Details m
    WHERE m.ChildID = ?`;

    if (date !== null) {
      getMovementsOfChildByDateQuery += ` AND DATE(m.Time) = ?`;
      getMovementsOfChildByDateQueryParams.push(date);
    }

    const [movements] = await this.connection.execute(getMovementsOfChildByDateQuery, getMovementsOfChildByDateQueryParams);
    if (movements.length === 0) return { success: true, error:'No movements found', data: [] };

    return { success: true, error:null, data: movements };
  } catch (err) {
    console.error('Error getting movements:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function updateMovementById(childId, movementId, type, time, notes) {
  if (!childId) return { success: false, error:'Child ID not provided', data: null };
  if (!movementId) return { success: false, error:'Movement ID not provided', data: null };
  if (!type) return { success: false, error:'Movement type not provided', data: null };
  if (!time) return { success: false, error:'Movement time not provided', data: null };
  if (!notes) notes = null;

  try {
    const updateMovementQuery = `
      UPDATE Attendance_Details
      SET Type = ?, Time = ?, Notes = ?
      WHERE ID = ?`;

    await this.connection.execute(updateMovementQuery, [type, time, notes, movementId]);
    return { success: true, error:null, data: null };
  } catch (err) {
    console.error('Error updating movement:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function deleteMovementById(childId, movementId) {
  if (!childId) return { success: false, error:'Child ID not provided', data: null };
  if (!movementId) return { success: false, error:'Movement ID not provided', data: null };

  try {
    const deleteMovementQuery = `
      DELETE FROM Attendance_Details
      WHERE ID = ?`;

    await this.connection.execute(deleteMovementQuery, [movementId]);
    return { success: true, error:null, data: null };
  } catch (err) {
    console.error('Error deleting movement:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

module.exports = {
  addAttendance,
  getAttendancesByDate,
  updateAttendanceById,

  addMovementToAttendanceByChildId,
  getMovementsOfChildByDate,
  updateMovementById,
  deleteMovementById
};