/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
const { isAuthenticated, hasPermission } = require('../middlewares/auth');

module.exports = (router, base) => {
  // Get parent by id
  router.get(base + "/:id", isAuthenticated, hasPermission('contact_get'), (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({
      data: null,
      error: "Missing Parent ID",
    });

    req.app.database.getParentById(id)
      .then((result) => {
        if (result.success) {
          return res.status(200).json({
            data: result.data,
            error: null,
          });
        } else {
          return res.status(400).json({
            data: null,
            error: result.error,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: err.message,
        });
      });
  })

  // Update parent by id
  router.put(base + "/:id", isAuthenticated, hasPermission('contact_update'), (req, res) => {
    // Recupera i dati dal body della richiesta (che potrebbero contenere i dati di iscrizione)
    const { id } = req.params;
    const { name, surname, gender, email, phone } = req.body;
    if (!id) return res.status(400).json({
      data: null,
      error: "Missing Parent ID",
    });
    if (!name) return res.status(400).json({
      data: null,
      error: "Missing Parent Name",
    });
    if (!gender) return res.status(400).json({
      data: null,
      error: "Missing Parent Gender",
    });
    if (!surname) return res.status(400).json({
      data: null,
      error: "Missing Parent Surname",
    });
    if (!email) return res.status(400).json({
      data: null,
      error: "Missing Parent Email",
    });
    if (!phone) phone = null;

    req.app.database.updateParentById(id, name, surname, gender, email, phone)
      .then((result) => {
        if (result.success) {
          return res.status(200).json({
            data: result.data,
            error: null,
          });
        } else {
          return res.status(400).json({
            data: null,
            error: result.error,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: err.message,
        });
      });
  })

  // Delete parent by id
  router.delete(base + "/:id", isAuthenticated, hasPermission('contact_delete'), (req, res) => {
    // Recupera i dati dal body della richiesta (che potrebbero contenere i dati di iscrizione)
    const { id } = req.params;
    if (!id) return res.status(400).json({
      data: null,
      error: "Missing Parent ID",
    });

    req.app.database.deleteParentById(id) // Delete Parent by ID
      .then((result) => {
        if (result.success) {
          return res.status(200).json({
            data: result.data,
            error: null,
          });
        } else {
          return res.status(400).json({
            data: null,
            error: result.error,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: err.message,
        });
      });
  });
};