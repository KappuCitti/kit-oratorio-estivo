/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
const { isAuthenticated, hasPermission } = require('../middlewares/auth');

module.exports = (router, base) => {
  //! Attendances
  // Add new attendance
  router.post(base + "/", isAuthenticated, hasPermission('attendance_update'), (req, res) => {
    const { enrollmentId, date, present, eatsAtOratory, eatsInBianco } = req.body;

    if (!enrollmentId || !date) return res.status(400).json({
      data: null,
      error: "Missing enrollmentId or date",
    });

    req.app.database.addAttendance(enrollmentId, date, present, eatsAtOratory, eatsInBianco)
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

  // Get attendances by date
  router.get(base + "/date/:date", isAuthenticated, hasPermission('attendance_get'), (req, res) => {
    const { date } = req.params;
    const { schoolType, classNumber } = req.query;

    if (!date) return res.status(400).json({
      data: null,
      error: "Missing date",
    });

    req.app.database.getAttendancesByDate(date, schoolType, classNumber)
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

  // Update attendance
  router.put(base + "/:id", isAuthenticated, hasPermission('attendance_update'), (req, res) => {
    const { id } = req.params;
    const { present, eatsAtOratory, eatsInBianco } = req.body;

    if (!id) return res.status(400).json({
      data: null,
      error: "Missing id",
    });

    req.app.database.updateAttendanceById(id, present, eatsAtOratory, eatsInBianco)
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

  //! Movements
  // Add movement
  router.post(base + "/:childId/movements", isAuthenticated, hasPermission('movement_add'), (req, res) => {
    const { childId } = req.params;
    const { type, time, notes } = req.body;

    if (!childId)
      return res.status(400).json({
        data: null,
        error: "Missing id",
      });

    if (!type)
      return res.status(400).json({
        data: null,
        error: "Missing type",
      });

    if (type !== "Join" && type !== "Left")
      return res.status(400).json({
        data: null,
        error: "Invalid type",
      });

    if (!time)
      return res.status(400).json({
        data: null,
        error: "Missing time",
      });
    if (isNaN(time) || Date.parse(time) == NaN)
      return res.status(400).json({
        data: null,
        error: "Invalid time",
      })

    const date = new Date(time);

    req.app.database.addMovementToAttendanceByChildId(childId, type, date, notes)
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

  // Get movements
  router.get(base + "/:childId/movements", isAuthenticated, hasPermission('movement_get'),(req, res) => {
    const { childId } = req.params;
    const { date } = req.query;

    if (!childId)
      return res.status(400).json({
        data: null,
        error: "Missing id",
      });

    req.app.database.getMovementsOfChildByDate(childId, date)
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

  // Update movement
  router.put(base + "/:childId/movements/:movementId", isAuthenticated, hasPermission('movement_update'),(req, res) => {
    const { childId, movementId } = req.params;
    const { type, time, notes } = req.body;

    if (!childId)
      return res.status(400).json({
        data: null,
        error: "Missing id",
      });

    if (!movementId)
      return res.status(400).json({
        data: null,
        error: "Missing movementId",
      });

    if (!type)
      return res.status(400).json({
        data: null,
        error: "Missing type",
      });

    if (type !== "Join" && type !== "Left")
      return res.status(400).json({
        data: null,
        error: "Invalid type",
      });

    if (!time)
      return res.status(400).json({
        data: null,
        error: "Missing time",
      });
    if (isNaN(time) || Date.parse(time) == NaN)
      return res.status(400).json({
        data: null,
        error: "Invalid time",
      })

    const date = new Date(time);

    req.app.database.updateMovementById(childId, movementId, type, date, notes)
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

  // delete movement
  router.delete(base + "/:childId/movements/:movementId", isAuthenticated, hasPermission('movement_delete'),(req, res) => {
    const { childId, movementId } = req.params;
    if (!childId)
      return res.status(400).json({
        data: null,
        error: "Missing id",
      });

    if (!movementId)
      return res.status(400).json({
        data: null,
        error: "Missing movementId",
      });

    req.app.database.deleteMovementById(childId, movementId)
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