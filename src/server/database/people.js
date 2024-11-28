/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
async function createTree(tree) {
  if (!tree) return { success: false, error:'Tree not provided', data: null };
  try {
    // Query for add address
    const addAddressQuery = `
    INSERT INTO Address (Street, City, PostalCode, Country)
    VALUES (?, ?, ?, ?);
    `;
    const [addressResult] = await this.connection.execute(addAddressQuery, [tree.address.street, tree.address.city, tree.address.zip, tree.address.country]);
    const addressId = addressResult.insertId;

    // Query add child
    const addChildQuery = `
    INSERT INTO Child (Name, Surname, Gender, BirthDate, BirthPlace, AddressId)
    VALUES (?, ?, ?, ?, ?, ?);
    `;
    const [childResult] = await this.connection.execute(addChildQuery, [tree.child.name, tree.child.surname, tree.child.gender, tree.child.birthDate, tree.child.birthPlace, addressId]);
    const childId = childResult.insertId;

    // Query add parent
    let parentsIds = [];
    const addParentQuery = `
    INSERT INTO Parent (Name, Surname, Gender, PhoneNumber, Email)
    VALUES (?, ?, ?, ?, ?);
    `;
    for (const parent of tree.parents) {
      if (!parent.phone) parent.phone = null;
      if (!parent.email) parent.email = null;
      const [parentResult] = await this.connection.execute(addParentQuery, [parent.name, parent.surname, parent.gender, parent.phone, parent.email]);
      parentsIds.push(parentResult.insertId);
    }
    // Add child and parents in Child_Parent
    const addParentChildQuery = `
    INSERT INTO Child_Parent (ParentId, ChildId)
    VALUES (?, ?);
    `;
    for (const parentId of parentsIds) {
      await this.connection.execute(addParentChildQuery, [parentId, childId]);
    }

    return { success: true, data: null };
  } catch (error) {
    console.error('Error creating tree:', error.message);
    console.error(error);
    return { success: false, error: error.message };
  }
}

async function getFilteredPeople(name, surname, context, limit, offset) {
  if (!name) name = null;
  if (!surname) surname = null;
  if (!context) context = null;
  if (!limit) limit = 25;
  if (!offset) offset = 0;

  try {
    // Costruzione della query dinamica
    let baseQuery = `
      SELECT * FROM (
        SELECT ID as id, Name AS name, Surname AS surname, Gender AS gender, 'Parent' AS context FROM Parent
        UNION
        SELECT ID as id, Name AS name, Surname AS surname, Gender AS gender, 'Child' AS context FROM Child
      ) AS results
      WHERE 1 = 1
    `;

    // Array per memorizzare i valori dei filtri
    const filters = [];

    // Aggiunta del filtro per il nome se fornito
    if (name) {
      baseQuery += ` AND results.name LIKE ?`;
      filters.push(`%${name}%`);
    }

    // Aggiunta del filtro per il cognome se fornito
    if (surname) {
      baseQuery += ` AND results.surname LIKE ?`;
      filters.push(`%${surname}%`);
    }

    // Aggiunta del filtro per il contesto (Parent o Child) se fornito
    if (context === 'Parent') {
      baseQuery += ` AND results.context = 'Parent'`;
    } else if (context === 'Child') {
      baseQuery += ` AND results.context = 'Child'`;
    }

    // Calcolo del totale di risultati
    const [total] = await this.connection.execute(`SELECT COUNT(*) AS total FROM (${baseQuery}) AS results`);
    // Limit e paginazione direttamente nella query
    baseQuery += ` ORDER BY ID DESC LIMIT ${limit} OFFSET ${offset}`;

    // Esecuzione della query
    const [results] = await this.connection.execute(baseQuery, filters);

    return { success: true, data: results, total: total[0].total };

  } catch (error) {
    console.error('Error fetching filtered results:', error.message);
    console.error(error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  createTree,
  getFilteredPeople
}