/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
const { isAuthenticated, hasPermission } = require('../middlewares/auth');

module.exports = (router, base) => {
  // Search poeple
  router.get(base + "/", isAuthenticated, hasPermission('contact_get'), (req, res) => {
    const { name, surname, context, limit, offset } = req.query;


    req.app.database.getFilteredPeople(name, surname, context, limit, offset)
      .then((result) => {
        if (result.success)
          return res.status(200).json({
            data: result.data,
            error: null,
            total: result.total
          });
        else
          return res.status(400).json({
            data: null,
            error: result.error,
          });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        });
      });
  });


  // Create new tree
  router.post(base + "/tree", isAuthenticated, hasPermission('tree_add'), (req, res) => {

    // Recupera i dati dal body della richiesta (che potrebbero contenere i dati di iscrizione)
    const child = req.body.child;
    const parents = req.body.parents;
    if (!child || !parents) {
      return res.status(400).json({
        data: null,
        error: "Missing child or parents",
      });
    }
    if (parents.length < 2) {
      return res.status(400).json({
        data: null,
        error: "Missing parents",
      });
    }

    const address = child.address;
    if (!address) {
      return res.status(400).json({
        data: null,
        error: "Missing address",
      });
    }

    req.app.database.createTree({ child, parents, address })
      .then((result) => {
        if (result.success)
          return res.status(200).json({
            data: result.data,
            error: null,
          });
        else
          return res.status(400).json({
            data: null,
            error: result.error,
          });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        });
      });
  });
};