/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
const { isAuthenticated, hasPermission } = require('../middlewares/auth');

module.exports = (router, base) => {
  // Get week data by year
  router.get(base + "/year/:year", isAuthenticated, hasPermission('week_get'), (req, res) => {
    const { year } = req.params;

    if (!year) {
      return res.status(400).json({
        data: null,
        error: "Missing year",
      });
    }

    req.app.database.getAllWeeksByYear(year)
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

  // Get week data by date
  router.get(base + "/date/:date", isAuthenticated, hasPermission('week_get'), (req, res) => {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({
        data: null,
        error: "Missing date",
      });
    }

    // Check if date is date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        data: null,
        error: "Invalid date format (YYYY-MM-DD)",
      });
    }

    req.app.database.getWeekByDate(date)
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
};