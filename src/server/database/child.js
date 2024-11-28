/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
async function getChildById(id) {
  if (!id) return { success: false, error:'Child ID not provided', data: null };

  try {
    // Query per ottenere le informazioni del bambino
    const getChildInfoQuery = `
    SELECT 
      c.ID AS id,
      c.Name AS name,
      c.Surname AS surname,
      c.Gender AS gender,
      c.BirthDate AS birthDate,
      c.BirthPlace AS birthPlace,
      a.City AS cityResidence,
      a.Street AS street,
      a.PostalCode AS zip,
      a.Country AS country
    FROM Child c
    JOIN Address a ON c.AddressID = a.ID  -- Unione con la tabella degli indirizzi
    WHERE c.ID = ?;`;

    const [children] = await this.connection.execute(getChildInfoQuery, [id]);

    if (children.length === 0) return { success: true, error:'No children found', data: [] };

    // Query per ottenere i genitori del bambino
    const getParentInfoQuery = `
    SELECT 
      p.ID AS id,
      p.Name AS name,
      p.Surname AS surname,
      p.Gender AS gender,
      p.PhoneNumber AS phone,
      p.Email AS email
    FROM Parent p
    JOIN Child_Parent pc ON p.ID = pc.ParentID
    WHERE pc.ChildID = ?;`;  // Usa il ChildID per trovare i genitori associati

    const [parents] = await this.connection.execute(getParentInfoQuery, [id]);

    const child = children[0];

    return {
      success: true, error:null, data: {
        child: {
          id: child.id,
          name: child.name,
          surname: child.surname,
          gender: child.gender,
          birthDate: child.birthDate,
          birthPlace: child.birthPlace,
          address: {
            city: child.cityResidence,
            street: child.street,
            zip: child.zip,
            country: child.country
          }
        }, parents
      }
    };
  }
  catch (err) {
    console.error('Error getting children:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function getChildrenByNameSurname(name, surname, limit, offset) {
  if (!name) name = '';
  if (!surname) surname = '';

  if (!limit) limit = 25;
  if (!offset) offset = 0;

  try {
    let getChildByNameSurnameQuery = `
    SELECT
      c.ID AS id,
      c.Name AS name,
      c.Surname AS surname,
      c.Gender AS gender,
      c.BirthDate AS birthDate,
      c.BirthPlace AS birthPlace,
      a.City AS cityResidence,
      a.Street AS street,
      a.PostalCode AS zip,
      a.Country AS country
    FROM Child c
    JOIN Address a ON c.AddressID = a.ID
    WHERE c.Name LIKE ? AND c.Surname LIKE ?`;

    const [total] = await this.connection.execute(`SELECT COUNT(*) AS total FROM (${getChildByNameSurnameQuery}) AS results`, [`%${name}%`, `${surname}%`]);

    getChildByNameSurnameQuery += ` ORDER BY ID DESC LIMIT ${limit} OFFSET ${offset}`;

    const [children] = await this.connection.execute(getChildByNameSurnameQuery, [`%${name}%`, `${surname}%`]);
    if (children.length === 0) return { success: true, error:'No children found', data: [] };

    const res = [];

    for (const child of children) {
      res.push({
        id: child.id,
        name: child.name,
        surname: child.surname,
        gender: child.gender,
        birthDate: child.birthDate,
        birthPlace: child.birthPlace,
        address: {
          city: child.cityResidence,
          street: child.street,
          zip: child.zip,
          country: child.country
        }
      });
    }

    return {
      success: true, error:null, data: res, total: total[0].total
    };
  }
  catch (err) {
    console.error('Error getting children:', err.message);
    console.error(err);
    return { success: false, error:err.message, data: null };
  }
}

async function updateChildById(id, name, surname, gender, birthDate, birthPlace) {
  if (!id) return { success: false, error:'Child ID not provided', data: null };
  if (!name) return { success: false, error:'Child name not provided', data: null };
  if (!surname) return { success: false, error:'Child surname not provided', data: null };
  if (!gender) return { success: false, error:'Child gender not provided', data: null };
  if (!birthDate) return { success: false, error:'Child birth date not provided', data: null };
  if (!birthPlace) return { success: false, error:'Child birth place not provided', data: null };

  try {
    const updateChildQuery = `UPDATE Child SET Name = ?, Surname = ?, Gender = ?, BirthDate = ?, BirthPlace = ? WHERE ID = ?;`;
    const [updateChildResult] = await this.connection.execute(updateChildQuery, [name, surname, gender, birthDate, birthPlace, id]);

    return { success: true, error:null, data: null };
  }
  catch (err) {
    console.error('Error updating child:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function updateChildResidenceById(id, country, city, street, zip) {
  if (!id) return { success: false, error:'Child ID not provided', data: null };
  if (!country) return { success: false, error:'Child country not provided', data: null };
  if (!city) return { success: false, error:'Child city not provided', data: null };
  if (!street) return { success: false, error:'Child street not provided', data: null };
  if (!zip) return { success: false, error:'Child zip not provided', data: null };

  try {
    const updateChildResidenceQuery = `UPDATE Address SET Country = ?, City = ?, Street = ?, PostalCode = ? WHERE ID = ?;`;
    const [updateChildResidenceResult] = await this.connection.execute(updateChildResidenceQuery, [country, city, street, zip, id]);

    return { success: true, error:null, data: null };
  }
  catch (err) {
    console.error('Error updating child residence:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

async function deleteChildById(id) {
  if (!id) return { success: false, error:'Child ID not provided', data: null };
  try {
    const deleteChildParentQuery = `DELETE FROM Child_Parent WHERE ChildID = ?;`;
    const [deleteChildParentResult] = await this.connection.execute(deleteChildParentQuery, [id]);

    const deleteChildQuery = `DELETE FROM Child WHERE ID = ?;`;
    const [deleteChildResult] = await this.connection.execute(deleteChildQuery, [id]);

    return { success: true, error:null, data: null };
  }
  catch (err) {
    console.error('Error deleting child:', err.message);
    return { success: false, error:err.message, data: null };
  }
}

module.exports = {
  getChildById,
  getChildrenByNameSurname,
  updateChildById,
  updateChildResidenceById,
  deleteChildById
}