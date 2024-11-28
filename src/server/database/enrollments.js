/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
// Add enrollment
async function addEnrollment({ childId, schoolType, classNumber, section, dataProcessingConsent, exitAuthorization, teamId, shirtId, parentNotes, managerNotes, year, weeks }) {
  if (!childId) return { success: false, error:'Child ID not provided', data: null };
  if (!schoolType || !classNumber || !section || !year) return { success: false, error:'Enrollment data not provided', data: null };
  if (dataProcessingConsent == undefined || dataProcessingConsent == null || exitAuthorization == undefined || exitAuthorization == null) return { success: false, error:'Enrollment data not provided', data: null };

  if (!teamId) teamId = null;
  if (!parentNotes) parentNotes = null;
  if (!managerNotes) managerNotes = null;
  if (!weeks) weeks = [];
  if (!shirtId) shirtId = null;
  dataProcessingConsent = dataProcessingConsent == 'true';
  exitAuthorization = exitAuthorization == 'true';

  try {
    const insertEnrollmentQuery = `
      INSERT INTO Enrollment
      (ChildID, SchoolType, Class, Section, DataProcessingConsent, ExitAuthorization, ShirtSizeID, ParentNotes, ManagerNotes, Year, Timestamp, TeamID)
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const [enrollmentRes] = await this.connection.execute(insertEnrollmentQuery, [childId, schoolType, classNumber, section, dataProcessingConsent, exitAuthorization, shirtId, parentNotes, managerNotes, year, new Date().toISOString().slice(0, 19).replace('T', ' '), teamId]);
    const enrollmentId = enrollmentRes.insertId;

    const insertEnrollmentWeekQuery = `
      INSERT INTO EnrollmentWeeks
      (EnrollmentID, WeekID, IsPaid)
      VALUES
      (?, ?, ?);
    `;
    for (const week of weeks) {
      week.isPaid = week.isPaid == 'true';
      await this.connection.execute(insertEnrollmentWeekQuery, [enrollmentId, week.id, week.isPaid]);
    }

    return { success: true, error:null, data: null };
  } catch (err) {
    console.error('Error creating enrollment:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

// Get enrollments
async function getFilteredEnrollments(year, name, surname, schoolType, classNumber, section, payment, week, id, limit, offset) {
  if (!year) year = new Date().getFullYear();
  if (!name) name = null;
  if (!surname) surname = null;
  if (!schoolType) schoolType = null;
  if (!classNumber) classNumber = null;
  if (!section) section = null;
  if (!payment) payment = null;
  if (!week) week = null;
  if (!id) id = null;

  if (!limit) limit = 25;
  if (!offset) offset = 0;

  try {
    let enrollmentQuery = `
    SELECT 
        e.ID AS enrollmentId,
        e.ChildID AS childId,
        e.SchoolType AS schoolType,
        e.Class AS classNumber,
        e.Section AS section,
        e.DataProcessingConsent AS dataProcessingConsent,
        e.ExitAuthorization AS exitAuthorization,
        e.Year AS year,
        e.Timestamp AS timestamp,
        e.ParentNotes AS parentNotes,
        e.ManagerNotes AS managerNotes,
        e.TeamID AS teamId,
        ss.SizeName AS tShirtSize,
        ss.ID AS tShirtSizeId
    FROM Enrollment e
    JOIN Child c ON e.ChildID = c.ID
    LEFT JOIN ShirtSize ss ON e.ShirtSizeID = ss.ID
    WHERE e.Year = ?`;

    let queryParams = [year];

    if (name) {
      enrollmentQuery += ` AND c.Name LIKE ?`;
      queryParams.push(`%${name}%`);
    }
    if (surname) {
      enrollmentQuery += ` AND c.Surname LIKE ?`;
      queryParams.push(`%${surname}%`);
    }
    if (schoolType) {
      enrollmentQuery += ` AND e.SchoolType = ?`;
      queryParams.push(schoolType);
    }
    if (classNumber) {
      enrollmentQuery += ` AND e.Class = ?`;
      queryParams.push(classNumber);
    }
    if (section) {
      enrollmentQuery += ` AND e.Section = ?`;
      queryParams.push(section);
    }
    if (id) {
      enrollmentQuery += ` AND e.ID = ?`;
      queryParams.push(id);
    }

    const [total] = await this.connection.execute(`SELECT COUNT(*) AS total FROM (${enrollmentQuery}) AS results`, queryParams);
    enrollmentQuery += ` ORDER BY e.ID DESC LIMIT ${limit} OFFSET ${offset}`;

    const [enrollments] = await this.connection.execute(enrollmentQuery, queryParams);

    if (enrollments.length === 0) return { success: true, error:null, data: [] };
    const enrollmentIds = enrollments.map(e => e.enrollmentId);

    let weeksQuery = `
    SELECT 
        w.ID AS weekId,
        w.StartDate AS weekStartDate,
        w.EndDate AS weekEndDate,
        IF(ew.EnrollmentID IS NOT NULL, 1, 0) AS enrolled, -- 1 se iscritto, 0 se non iscritto
        ew.IsPaid AS isPaid,
        ew.EnrollmentID AS enrollmentId
    FROM Week w`;

    if (week) {
      weeksQuery += `
        INNER JOIN EnrollmentWeeks ew ON w.ID = ew.WeekID AND ew.EnrollmentID IN (${enrollmentIds.join(',')})
        WHERE w.ID = ? AND YEAR(w.StartDate) = ?`;
      queryParams = [week, year];
    } else {
      weeksQuery += `
        LEFT JOIN EnrollmentWeeks ew ON w.ID = ew.WeekID AND ew.EnrollmentID IN (${enrollmentIds.join(',')})
        WHERE YEAR(w.StartDate) = ?`;
      queryParams = [year];
    }


    const [weeks] = await this.connection.execute(weeksQuery, queryParams);

    const teamsQuery = await this.getTeams();
    const teams = await teamsQuery.data;

    const result = await Promise.all(enrollments.map(async enrollment => {
      const uniqueWeeks = {};

      weeks.forEach(week => {
        if (!uniqueWeeks[week.weekId]) {
          uniqueWeeks[week.weekId] = {
            id: week.weekId,
            start: week.weekStartDate,
            end: week.weekEndDate,
            payed: false,
            enrolled: false
          };
        }

        if (week.enrollmentId === enrollment.enrollmentId) {
          uniqueWeeks[week.weekId].payed = week.isPaid == 1;
          uniqueWeeks[week.weekId].enrolled = true;
        }
      });

      const relatedTeam = teams.find(team => team.id === enrollment.teamId) || { name: null, color: null, id: null };

      const child = await this.getChildById(enrollment.childId);

      if (week && !Object.values(uniqueWeeks).some(w => w.enrolled)) {
        return null;
      }

      return {
        id: enrollment.enrollmentId,
        name: enrollment.childName,
        surname: enrollment.chilSurname,
        birthdate: enrollment.birthDate,
        place: enrollment.birthPlace,
        schoolType: enrollment.schoolType,
        classNumber: enrollment.classNumber,
        section: enrollment.section,
        dataProcessingConsent: enrollment.dataProcessingConsent == 1,
        exitAuthorization: enrollment.exitAuthorization == 1,
        year: enrollment.year,
        timestamp: enrollment.timestamp,
        shirt: {
          id: enrollment.tShirtSizeId,
          size: enrollment.tShirtSize
        },
        notes: {
          parent: enrollment.parentNotes,
          manager: enrollment.managerNotes
        },
        team: {
          id: relatedTeam.id,
          name: relatedTeam.name,
          color: relatedTeam.color
        },
        weeks: Object.values(uniqueWeeks),
        tree: child.data,
      };
    }));

    return { success: true, error:null, data: result.filter(r => r !== null), total: total[0].total };
  }
  catch (err) {
    console.error('Error getting enrollments:', err.message);
    console.error(err);
    return { success: false, error:err.message, data: null };
  }
}

// Update an enrollment
async function updateEnrollmentById({ id, schoolType, classNumber, section, dataProcessingConsent, exitAuthorization, teamId, shirtId, parentNotes, managerNotes }) {
  if (!id) return { success: false, error:'Enrollment ID not provided', data: null };

  if (!schoolType || !classNumber || !section || dataProcessingConsent == undefined || dataProcessingConsent == null || exitAuthorization == undefined || exitAuthorization == null) return { success: false, error:'Enrollment data not provided', data: null };
  dataProcessingConsent = dataProcessingConsent == 'true';
  exitAuthorization = exitAuthorization == 'true';

  if (!teamId) teamId = null;
  if (!shirtId) shirtId = null;
  if (!parentNotes) parentNotes = null;
  if (!managerNotes) managerNotes = null;

  try {
    const updateEnrollmentQuery = `
      UPDATE Enrollment
      SET
        SchoolType = ?,
        Class = ?,
        Section = ?,
        DataProcessingConsent = ?,
        ExitAuthorization = ?,
        ShirtSizeID = ?,
        ParentNotes = ?,
        ManagerNotes = ?,
        TeamID = ?
      WHERE ID = ?;
    `;
    await this.connection.execute(updateEnrollmentQuery, [schoolType, classNumber, section, dataProcessingConsent, exitAuthorization, shirtId, parentNotes, managerNotes, teamId, id]);

    return { success: true, error:null, data: null };

  } catch (err) {
    console.error('Error updating enrollment:', err.message);
    return { success: false, error:err.message, data: null };
  }
}


// Delete enrollment by id
async function deleteEnrollmentById(id) {
  if (!id) return { success: false, error:'Enrollment ID not provided', data: null };

  try {
    // delete EnrollmentWeeks
    const deleteEnrollmentWeekQuery = `
      DELETE FROM EnrollmentWeeks
      WHERE EnrollmentID = ?;
    `;
    await this.connection.execute(deleteEnrollmentWeekQuery, [id]);

    // delete enrollment
    const deleteEnrollmentQuery = `
      DELETE FROM Enrollment
      WHERE ID = ?;
    `;
    await this.connection.execute(deleteEnrollmentQuery, [id]);
    return { success: true, error:null, data: null };
  } catch (err) {
    console.error('Error deleting enrollment:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

module.exports = {
  addEnrollment,
  getFilteredEnrollments,
  updateEnrollmentById,
  deleteEnrollmentById
}