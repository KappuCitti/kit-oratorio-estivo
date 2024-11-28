/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
const { isAuthenticated, hasPermission } = require('../middlewares/auth');

module.exports = (router, base) => {
  // Add team
  router.post(base + "/", isAuthenticated, hasPermission('team_add'), (req, res) => {
    const { name, color } = req.body;

    if (!name) return res.status(400).json({
      data: null,
      error: "Missing team name",
    });
    if (!color) return res.status(400).json({
      data: null,
      error: "Missing team color",
    });

    req.app.database.addTeam(name, color)
      .then((result) => {
        if (result.success)
          return res.status(200).json({
            data: result.data,
            error: null,
          });
        else
          return res.status(400).json({
            data: null,
            error: "Something went wrong",
          });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        });
      });
  })

  // Get all teams
  router.get(base + "/", isAuthenticated, hasPermission('team_get'), (req, res) => {
    req.app.database.getTeams()
      .then((result) => {
        if (result.success)
          return res.status(200).json({
            data: result.data,
            error: null,
          });
        else
          return res.status(400).json({
            data: null,
            error: "Something went wrong",
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

  // Update team
  router.put(base + "/:id", isAuthenticated, hasPermission('team_update'), (req, res) => {
    const { id } = req.params;
    const { name, color } = req.body;

    if (!id) return res.status(400).json({
      data: null,
      error: "Missing team ID",
    });

    if (!name) return res.status(400).json({
      data: null,
      error: "Missing team name",
    });
    if (!color) return res.status(400).json({
      data: null,
      error: "Missing team color",
    });

    req.app.database.updateTeamById(id, name, color)
      .then((result) => {
        if (result.success)
          return res.status(200).json({
            data: result.data,
            error: null,
          });
        else
          return res.status(400).json({
            data: null,
            error: "Something went wrong",
          });
      })
      .catch((err) => { // Catch error
        console.error(err);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        });
      });
  });

  // Delete team
  router.delete(base + "/:id", isAuthenticated, hasPermission('team_delete'), (req, res) => {
    const { id } = req.params;
    const { force } = req.query;

    if (!id) return res.status(400).json({
      data: null,
      error: "Missing team ID",
    });

    req.app.database.deleteTeamById(id, force)
      .then((result) => {
        if (result.success)
          return res.status(200).json({
            data: result.data,
            error: null,
          });
        else
          return res.status(400).json({
            data: null,
            error: "Something went wrong",
          });
      })
      .catch((err) => { // Catch error
        console.error(err);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        });
      })
  })
};