/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
const crypto = require('crypto');
const { isAuthenticated, isPasswordValid, hasPermission } = require('../middlewares/auth');

module.exports = (router, base) => {
  // Login
  router.post(base + "/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        data: null,
        error: "Missing username or password",
      });
    }

    const cryptedPassword = crypto.createHash('sha256').update(password).digest('hex');

    req.app.database.login(username, cryptedPassword)
      .then((result) => {
        if (result.success) {
          return res
            .status(200)
            .cookie("user_token", result.data.token, {
              httpOnly: false,
              sameSite: "strict",
              secure: false,
              expires: result.data.expires,
            })
            .cookie("user_theme", result.data.theme, {
              httpOnly: false,
              sameSite: "strict",
              secure: false,
              expires: result.data.expires,
            })
            .json({
              data: "OK",
              error: null,
            });
        } else {
          return res.status(401).json({
            data: null,
            error: "Invalid username or password",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        });
      });
  });

  // Logout
  router.get(base + "/logout", isAuthenticated, (req, res) => {
    const token = req.user.token;

    req.app.database.logout(token)
      .then((result) => {
        if (result.success) {
          return res.status(200).clearCookie("user_token").clearCookie("user_theme").json({
            data: "OK",
            error: null,
          });
        } else {
          return res.status(401).json({
            data: null,
            error: "Invalid token",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        });
      });
  });

  // Register new user

  // Get personal user
  router.get(base + "/", isAuthenticated, hasPermission('staff_self'), (req, res) => {

    if (req.user) {
      delete req.user.token;

      return res.status(200).json({
        data: req.user,
        error: null,
      });
    }
    else {
      return res.status(401).json({
        data: null,
        error: "Unauthorized",
      });
    }
  });

  // Update personal user data
  router.put(base + "/", isAuthenticated, isPasswordValid, hasPermission('staff_self'), (req, res) => {
    const { password, name, surname, email, theme } = req.body;

    //! Password was controlled in middleware isPasswordValid

    if (!name || !surname) {
      return res.status(400).json({
        data: null,
        error: "Missing name, surname or theme",
      });
    }

    const cryptedPassword = crypto.createHash('sha256').update(password).digest('hex');

    req.app.database.updateUserData(req.user.id, cryptedPassword, name, surname, email, theme)
      .then((result) => {
        if (result.success) {
          return res.status(200).cookie("user_theme", theme).json({
            data: "OK",
            error: null,
          });
        } else {
          return res.status(500).json({
            data: null,
            error: "Internal server error",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        });
      });
  });


  // Update personal user password
  router.put(base + "/password", isAuthenticated, isPasswordValid, hasPermission('staff_self'), (req, res) => {
    const { password, newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        data: null,
        error: "Missing new password",
      });
    }

    const cryptedOldPassword = crypto.createHash('sha256').update(password).digest('hex');
    const cryptedNewPassword = crypto.createHash('sha256').update(newPassword).digest('hex');

    req.app.database.updateUserPassword(req.user.id, cryptedOldPassword, cryptedNewPassword)
      .then((result) => {
        if (result.success) {

          req.app.database.deleteAllSessions(req.user.id, req.user.token);

          return res.status(200).json({
            data: "OK",
            error: null,
          });
        } else {
          return res.status(500).json({
            data: null,
            error: "Internal server error",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        });
      });
  })


  // Delete user
};