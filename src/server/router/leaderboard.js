/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
const { isAuthenticated } = require('../middlewares/auth');

module.exports = (router, base) => {
  // add score
  router.post(base + "/scores", isAuthenticated, (req, res) => {
    let { teamId, date, points, reason, userId } = req.body;

    if (!teamId || !date || !points) return res.status(400).json({
      data: null,
      error: "Missing required fields",
    });

    if (!userId) userId = req.user.id;

    req.app.database.addScore(teamId, date, points, reason, userId)
      .then((result) => {
        if (result.success)
          return res.status(200).json({
            data: result.data,
            error: null,
          })
        else
          return res.status(400).json({
            data: null,
            error: "Something went wrong",
          })
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        })
      });
  });

  // Get leaderboard
  router.get(base + "/", isAuthenticated, (req, res) => {
    req.app.database.getLeaderboard()
      .then((result) => {
        if (result.success)
          return res.status(200).json({
            data: result.data,
            error: null,
          })
        else
          return res.status(400).json({
            data: null,
            error: "Something went wrong",
          })
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        })
      });
  });

  router.get(base + "/scores", isAuthenticated, (req, res) => {
    let { year, limit, offset } = req.query;

    if (!year) year = new Date().getFullYear();
    if (!limit) limit = 25;
    if (!offset) offset = 0;

    req.app.database.getScores(year, limit, offset)
      .then((result) => {
        if (result.success)
          return res.status(200).json({
            data: result.data,
            error: null,
            total: result.total
          })
        else
          return res.status(400).json({
            data: null,
            error: "Something went wrong",
          })
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        })
      });
  });

  router.get(base + "/scores/:id", isAuthenticated, (req, res) => {
    const { id } = req.params;

    req.app.database.getScore(id)
      .then((result) => {
        if (result.success)
          return res.status(200).json({
            data: result.data,
            error: null,
          })
        else
          return res.status(400).json({
            data: null,
            error: "Something went wrong",
          })
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        })
      });
  });

  // update
  router.put(base + "/scores/:id", isAuthenticated, (req, res) => {
    const { id } = req.params;
    const { teamId, date, points, reason, userId } = req.body;

    if (!id) return res.status(400).json({
      data: null,
      error: "Missing score ID",
    });

    if (!teamId && !date && !points && !userId) return res.status(400).json({
      data: null,
      error: "Missing required fields",
    });

    req.app.database.updateScore(id, teamId, date, points, reason, userId)
      .then((result) => {
        if (result.success)
          return res.status(200).json({
            data: result.data,
            error: null,
          })
        else
          return res.status(400).json({
            data: null,
            error: "Something went wrong",
          })
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        })
      });
  });

  // delete
  router.delete(base + "/scores/:id", isAuthenticated, (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).json({
      data: null,
      error: "Missing score ID",
    });

    req.app.database.deleteScore(id)
      .then((result) => {
        if (result.success)
          return res.status(200).json({
            data: result.data,
            error: null,
          })
        else
          return res.status(400).json({
            data: null,
            error: "Something went wrong",
          })
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        })
      });
  })
};