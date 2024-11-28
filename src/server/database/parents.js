/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
async function getParentById(id) {
  if (!id) return { success: false, error:'Parent ID not provided', data: null };

  try {
    const getParentQuery = `
    SELECT
      p.ID AS id,
      p.Name AS name,
      p.Surname AS surname,
      p.Gender AS gender,
      p.PhoneNumber AS phone,
      p.Email AS email
    FROM Parent p
    WHERE p.ID = ?;`;

    const [parent] = await this.connection.execute(getParentQuery, [id]);
    if (parent.length === 0) return { success: true, error:'No parent found', data: null };
    return { success: true, error:null, data: parent[0] };
  }
  catch (err) {
    console.error('Error getting parent:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function getParentsByNameSurname(name, surname) {
  if (!name) return { success: false, error:'Parent name not provided', data: null };
  if (!surname) return { success: false, error:'Parent surname not provided', data: null };

  try {
    const getParentByNameSurnameQuery = `
    SELECT
      p.ID AS id,
      p.Name AS name,
      p.Surname AS surname,
      p.Gender AS gender,
      p.PhoneNumber AS phone,
      p.Email AS email
    FROM Parent p
    WHERE p.Name LIKE ? AND p.Surname LIKE ?;`;
    const [parents] = await this.connection.execute(getParentByNameSurnameQuery, [`${name}%`, `${surname}%`]);
    if (parents.length === 0) return { success: true, error:'No parents found', data: [] };
    return {
      success: true, error:null, data: {
        parents
      }
    };
  }
  catch (err) {
    console.error('Error getting parents:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function updateParentById(id, name, surname, gender, email, phone) {
  if (!id) return { success: false, error:'Parent ID not provided', data: null };
  if (!name) return { success: false, error:'Parent name not provided', data: null };
  if (!surname) return { success: false, error:'Parent surname not provided', data: null };
  if (!gender) return { success: false, error:'Parent gender not provided', data: null };
  if (!email) return { success: false, error:'Parent email not provided', data: null };
  if (!phone) phone = null;

  try {
    const updateParentQuery = `
    UPDATE Parent
    SET Name = ?, Surname = ?, Gender = ?, Email = ?, PhoneNumber = ?
    WHERE ID = ?;`;
    const [updateParentResult] = await this.connection.execute(updateParentQuery, [name, surname, gender, email, phone, id]);

    return { success: true, error:null, data: null };
  }
  catch (err) {
    console.error('Error updating parent:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function deleteParentById(id) {
  if (!id) return { success: false, error:'Parent ID not provided', data: null };
  try {
    const deleteParentParentQuery = `
    DELETE FROM Child_Parent WHERE ParentID = ?;`;
    const [deleteParentParentResult] = await this.connection.execute(deleteParentParentQuery, [id]);

    const deleteParentQuery = `
    DELETE FROM Parent WHERE ID = ?;`;
    const [deleteParentResult] = await this.connection.execute(deleteParentQuery, [id]);

    return { success: true, error:null, data: null };
  }
  catch (err) {
    console.error('Error deleting parent:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

module.exports = {
  getParentById,
  getParentsByNameSurname,
  updateParentById,
  deleteParentById
};