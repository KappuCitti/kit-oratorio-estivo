/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
const { isAuthenticated, hasPermission } = require('../middlewares/auth');

module.exports = (router, base) => {
  // Add new enrollment
  router.post(base + "/", isAuthenticated, hasPermission('enrollment_add'), (req, res) => {
    // Recupera i dati dal body della richiesta (che potrebbero contenere i dati di iscrizione)
    const enrollmentData = req.body;

    let { childId, schoolType, classNumber, section, dataProcessingConsent, exitAuthorization, teamId, shirtId, parentNotes, managerNotes, year, weeks } = enrollmentData;

    if (!childId || !year || !schoolType || !classNumber || !section) {
      return res.status(400).json({
        data: null,
        error: "Missing childId or year or weeks",
      });
    }
    if (dataProcessingConsent == undefined || dataProcessingConsent == null || exitAuthorization == undefined || exitAuthorization == null) {
      return res.status(400).json({
        data: null,
        error: "Missing dataProcessingConsent or exitAuthorization",
      });
    }

    req.app.database.addEnrollment({ childId, schoolType, classNumber, section, dataProcessingConsent, exitAuthorization, teamId, shirtId, parentNotes, managerNotes, year, weeks })
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

  // Search ernrollment
  router.get(base + "/", isAuthenticated, hasPermission('enrollment_get'), (req, res) => {
    let { year, name, surname, schoolType, classNumber, section, payment, week, limit, offset } = req.query || req.body;
    if (!year) year = null;
    if (!name) name = null;
    if (!surname) surname = null;
    if (!schoolType) schoolType = null;
    if (!classNumber) classNumber = null;
    if (!section) section = null;
    if (!payment) payment = null;
    if (!week) week = null;

    req.app.database.getFilteredEnrollments(year, name, surname, schoolType, classNumber, section, payment, week, null, limit, offset)
      .then((result) => {
        if (result.success)
          return res.status(200).json({
            data: result.data,
            error: null,
            total: result.total,
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

  // Get single enrollment
  router.get(base + "/:id", isAuthenticated, hasPermission('enrollment_get'), (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        data: null,
        error: "Missing id",
      });
    }

    req.app.database.getFilteredEnrollments(null, null, null, null, null, null, null, null, id, null, null)
      .then((result) => {
        if (result.success && result.data.length > 0)
          return res.status(200).json({
            data: result.data[0],
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

  // Update enrollment
  router.put(base + "/:id", isAuthenticated, hasPermission('enrollment_update'), (req, res) => {
    const { id } = req.params;
    const { schoolType, classNumber, section, dataProcessingConsent, exitAuthorization, teamId, shirtId, parentNotes, managerNotes } = req.body;

    if (!id) {
      return res.status(400).json({
        data: null,
        error: "Missing id",
      });
    }

    if (!schoolType || !classNumber || !section || dataProcessingConsent == undefined || dataProcessingConsent == null || exitAuthorization == undefined || exitAuthorization == null) {
      return res.status(400).json({
        data: null,
        error: "Missing enrollment data",
      });
    }

    req.app.database.updateEnrollmentById({ id, schoolType, classNumber, section, dataProcessingConsent, exitAuthorization, teamId, shirtId, parentNotes, managerNotes })
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

  // Delete enrollment
  router.delete(base + "/:id", isAuthenticated, hasPermission('enrollment_delete'), (req, res) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        data: null,
        error: "Missing id",
      });
    }

    req.app.database.deleteEnrollmentById(id)
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