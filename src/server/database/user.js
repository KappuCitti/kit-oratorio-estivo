/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
const { v4 } = require('uuid');

async function createUser(name, surname, password, email, theme) {
  try {
    const query = 'INSERT INTO User (Name, Surname, Password, Email, Theme) VALUES (?, ?, ?, ?, ?)';
    const [result] = await this.connection.execute(query, [name, surname, password, email, theme]);
    console.info(`User ${name} ${surname} created successfully with ID: ${result.insertId}`);

    return result.insertId;
  } catch (err) {
    console.error('Error creating user:', err.message);
    throw err;
  }
}

async function login(username, password) {
  try {
    if (!password) return false;

    if (!username) return false;
    if (username.indexOf('.') === -1) return false;
    const [surname, name] = username.split('.');

    const searchUserQuery = 'SELECT * FROM User WHERE Surname = ? AND Name = ? AND Password = ?';
    const [rows] = await this.connection.execute(searchUserQuery, [surname, name, password]);

    if (rows.length === 0) return { success: false, error: 'Username or password invalid', data: null };
    const user = rows[0];
    const token = v4();
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const addTokenQuery = 'INSERT INTO Session (Token, Expires, UserID) VALUES (?, ?, ?)';
    await this.connection.execute(addTokenQuery, [token, expires, user.ID]);



    return { success: true, error: null, data: { token, expires, theme: user.Theme } };
  } catch (err) {
    console.error('Error logging in:', err.message);
    return { success: false, error: err.message, data: null };
  }
}

async function logout(token) {
  if (!token) return { success: false, error: 'Token not provided', data: null };

  try {
    const deleteTokenQuery = 'DELETE FROM Session WHERE Token = ?';
    await this.connection.execute(deleteTokenQuery, [token]);
    return { success: true, error: null, data: null };
  } catch (err) {
    console.error('Error logging out:', err.message);
    return { success: false, error: err.message, data: null };
  }
}

async function getUser(token) {
  if (!token) return { success: false, error: 'Token not provided', data: null };

  try {
    const [rows] = await this.connection.execute('SELECT * FROM Session WHERE Token = ?', [token]);
    if (rows.length === 0) return { success: false, error: 'Invalid token', data: null };
    const [user] = await this.connection.execute('SELECT ID as id, Name as name, Surname as surname, Email as email, Theme as theme FROM User WHERE ID = ?', [rows[0].UserID]);
    return { success: true, error: null, data: user[0] };
  } catch (err) {
    console.error('Error getting user:', err.message);
    return { success: false, error: err.message, data: null };
  }
}

async function getUserPermissionsByUserId(id) {
  if (!id) return { success: false, error: 'User ID not provided', data: null };

  try {
    const [permissions] = await this.connection.execute(
      `SELECT p.ID AS PermissionID, p.Name AS PermissionName, p.Description AS PermissionDescription
      FROM Permission p
      JOIN RolePermission rp ON p.ID = rp.PermissionID
      WHERE rp.RoleID = ?
      `,
      [id]
    );

    const userPermissions = permissions.map(p => (p.PermissionName));

    return { success: true, error: null, data: userPermissions };
  } catch (err) {
    console.error('Error getting user permissions:', err.message);
    return { success: false, error: err.message, data: null };
  }
}

async function checkPassword(id, password) {
  if (!id) return { success: false, error: 'User ID not provided', data: null };
  if (!password) return { success: false, error: 'Password not provided', data: null };

  try {
    const query = 'SELECT * FROM User WHERE ID = ? AND Password = ?';
    const [rows] = await this.connection.execute(query, [id, password]);
    return { success: true, error: null, data: rows.length > 0 };
  } catch (err) {
    console.error('Error checking password:', err.message);
    return { success: false, error: err.message, data: null };
  }
}

async function updateUserData(id, password, name, surname, email, theme) {
  if (!id) return { success: false, error: 'User ID not provided', data: null };
  if (!password) return { success: false, error: 'Password not provided', data: null };
  if (!name) name = null;
  if (!surname) surname = null;
  if (!email) email = null;
  if (!theme) theme = null;

  let params = [];
  let queryData = []

  try {
    let query = `UPDATE User SET `;

    if (name) {
      queryData.push(`Name = ?`);
      params.push(name);
    };
    if (surname) {
      queryData.push(`Surname = ?`);
      params.push(surname);
    };
    if (email) {
      queryData.push(`Email = ?`);
      params.push(email);
    };
    if (theme) {
      queryData.push(`Theme = ?`);
      params.push(theme);
    };

    query += queryData.join(', ') + ` WHERE ID = ? AND Password = ?;`;

    const [result] = await this.connection.execute(query, [...params, id, password]);
    return { success: true, error: null, data: null };
  } catch (err) {
    console.error('Error updating user data:', err.message);
    return { success: false, error: err.message, data: null };
  }
}

async function updateUserPassword(id, oldPassword, newPassword) {
  if (!id) return { success: false, error: 'User ID not provided', data: null };
  if (!oldPassword) return { success: false, error: 'Old password not provided', data: null };
  if (!newPassword) return { success: false, error: 'New password not provided', data: null };

  try {
    const isPasswordValid = await this.checkPassword(id, oldPassword);
    if (!isPasswordValid) return { success: false, error: 'Invalid old password', data: null };

    const query = 'UPDATE User SET Password = ? WHERE ID = ? AND Password = ?';
    const [result] = await this.connection.execute(query, [newPassword, id, oldPassword]);

    return { success: true, error: null, data: null };
  } catch (err) {
    console.error('Error updating user password:', err.message);
    return { success: false, error: err.message, data: null };
  }
}

async function deleteAllSessions(id, exceptToken) {
  if (!id) return { success: false, error: 'User ID not provided', data: null };
  if (!exceptToken) exceptToken = null;

  try {
    let query = 'DELETE FROM Session WHERE UserID = ?';
    if (exceptToken) query += ' AND Token != ?';

    const [result] = await this.connection.execute(query, !exceptToken ? [id] : [id, exceptToken]);
    return { success: true, error: null, data: null };
  } catch (err) {
    console.error('Error deleting all sessions:', err.message);
    return { success: false, error: err.message, data: null };
  }
}

module.exports = {
  createUser,
  login,
  logout,
  getUser,
  getUserPermissionsByUserId,
  checkPassword,
  updateUserPassword,
  updateUserData,
  deleteAllSessions
}