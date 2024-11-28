/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
const mysql = require('mysql2/promise');

const config = require('../config/index');

const { createUser, login, getUser, logout, updateUserPassword, updateUserData, checkPassword, deleteAllSessions, getUserPermissionsByUserId, } = require('./user');
const { getFilteredPeople, createTree } = require('./people');
const { getParentsByNameSurname, deleteParentById, getParentById, updateParentById } = require('./parents');
const { getChildById, getChildrenByNameSurname, deleteChildById, updateChildById, updateChildResidenceById } = require('./child');
const { addEnrollment, getFilteredEnrollments, updateEnrollmentById, deleteEnrollmentById } = require('./enrollments');
const { getTeams, addTeam, updateTeamById, deleteTeamById } = require('./teams');
const { getAllWeeksByYear, getWeekByDate } = require('./weeks');
const { getAttendancesByDate, getMovementsOfChildByDate, addAttendance, updateAttendanceById, addMovementToAttendanceByChildId, updateMovementById, deleteMovementById } = require('./attendances');
const { getScores, getLeaderboard, updateScore, addScore, deleteScore } = require('./leaderboard');

class Database {
  constructor() {
    this.connection = null;
    this.databaseConfiguration = {
      host: config.MYSQL_HOST,
      user: config.MYSQL_USER,
      password: config.MYSQL_PASSWORD,
      database: config.MYSQL_DATABASE,
      port: config.MYSQL_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 3
    };
  }

  async init() {
    try {
      this.connection = await mysql.createConnection(this.databaseConfiguration);
      console.info('Database connection created successfully.');
    } catch (err) {
      console.error('Error creating database connection:', err.message);
      throw err; // Rilancia l'errore per gestirlo a livello superiore
    }
  }

  // Metodo per chiudere la connessione
  async close() {
    try {
      if (this.connection) {
        await this.connection.end();
        console.info('Database connection closed successfully.');
      }
    } catch (err) {
      console.error('Error closing database connection:', err.message);
      throw err;
    }
  }

  // Metodo per ottenere tutte le tabelle
  async getAllTables() {
    try {
      const [rows] = await this.connection.execute('SHOW TABLES');
      console.info('Retrieved all tables from the database.');
      return rows;
    } catch (err) {
      console.error('Error retrieving tables:', err.message);
      throw err;
    }
  }

  //! Manage user (staff)
  createUser = createUser;
  getUser = getUser;
  getUserPermissionsByUserId = getUserPermissionsByUserId;
  login = login;
  logout = logout;
  checkPassword = checkPassword;
  updateUserPassword = updateUserPassword;
  updateUserData = updateUserData;
  deleteAllSessions = deleteAllSessions;
  //* Delete user

  //! Manage people
  createTree = createTree;
  getFilteredPeople = getFilteredPeople;

  //! Manage parents
  //* Add parent
  getParentById = getParentById;
  getParentsByNameSurname = getParentsByNameSurname;
  updateParentById = updateParentById;
  deleteParentById = deleteParentById;

  //! Manage child
  //* Add child
  getChildById = getChildById;
  getChildrenByNameSurname = getChildrenByNameSurname;
  updateChildById = updateChildById;
  updateChildResidenceById = updateChildResidenceById;
  deleteChildById = deleteChildById;

  //! Manage enrollments
  addEnrollment = addEnrollment;
  getFilteredEnrollments = getFilteredEnrollments;
  updateEnrollmentById = updateEnrollmentById;
  deleteEnrollmentById = deleteEnrollmentById;

  //! Manage Teams
  addTeam = addTeam;
  getTeams = getTeams;
  //* Get Team by ID
  updateTeamById = updateTeamById;
  deleteTeamById = deleteTeamById;

  //! Weeks
  getAllWeeksByYear = getAllWeeksByYear;
  getWeekByDate = getWeekByDate;

  //! Attendances
  addAttendance = addAttendance;
  getAttendancesByDate = getAttendancesByDate;
  updateAttendanceById = updateAttendanceById;
  addMovementToAttendanceByChildId = addMovementToAttendanceByChildId;
  getMovementsOfChildByDate = getMovementsOfChildByDate;
  updateMovementById = updateMovementById;
  deleteMovementById = deleteMovementById;

  //! Leaderboard
  getLeaderboard = getLeaderboard;
  addScore = addScore;
  getScores = getScores;
  updateScore = updateScore;
  deleteScore = deleteScore;


  //! Shirts
  async getAllShirts() {
    try {
      // Esecuzione della query
      const qwery = `SELECT
        ID as id,
        SizeName as size,
        Width as width,
        Height as height,
        IsAvailable as avaiable
      FROM ShirtSize`;
      const [results] = await this.connection.execute(qwery);
      return { success: true, data: results };
    } catch (error) {
      console.error('Error fetching all shirts:', error.message);
      console.error(error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = Database;