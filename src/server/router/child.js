/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
const { isAuthenticated, hasPermission } = require('../middlewares/auth');

module.exports = (router, base) => {
  // Search child by name or surname
  router.get(base + "/", isAuthenticated, hasPermission('contact_get'), (req, res) => {
    const { name, surname, limit, offset } = req.query;

    req.app.database.getChildrenByNameSurname(name, surname, limit, offset)
      .then((result) => {
        if (result.success) {
          return res.status(200).json({
            data: result.data,
            error: null,
            total: result.total
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

  // Get child by ID
  router.get(base + "/:id", isAuthenticated, hasPermission('contact_get'), (req, res) => {
    // Recupera i dati dal body della richiesta (che potrebbero contenere i dati di iscrizione)
    const { id } = req.params;
    if (!id) return res.status(400).json({
      data: null,
      error: "Missing child ID",
    });

    req.app.database.getChildById(id) // Get child by ID  
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

  // Update child by id
  router.put(base + "/:id", isAuthenticated, hasPermission('contact_update'), (req, res) => {
    // Recupera i dati dal body della richiesta (che potrebbero contenere i dati di iscrizione)
    const { id } = req.params;
    const { name, surname, gender, birthDate, birthPlace } = req.body;
    if (!id) return res.status(400).json({
      data: null,
      error: "Missing child ID",
    });

    req.app.database.updateChildById(id, name, surname, gender, birthDate, birthPlace) // Update child by ID
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

  // Update child residence by child id
  router.put(base + "/:id/residence", isAuthenticated, hasPermission('contact_update'), (req, res) => {
    const { id } = req.params;
    const { country, city, street, zip } = req.body;

    if (!id) return res.status(400).json({
      data: null,
      error: "Missing child ID",
    });
    if (!country || !city || !street || !zip) return res.status(400).json({
      data: null,
      error: "Missing residence data",
    });

    req.app.database.updateChildResidenceById(id, country, city, street, zip) // Update child residence by ID
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

  // Delete child by id
  router.delete(base + "/:id", isAuthenticated, hasPermission('contact_delete'), (req, res) => {
    // Recupera i dati dal body della richiesta (che potrebbero contenere i dati di iscrizione)
    const { id } = req.params;
    if (!id) return res.status(400).json({
      data: null,
      error: "Missing child ID",
    });

    req.app.database.deleteChildById(id) // Delete child by ID
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