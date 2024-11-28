/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
const crypto = require('crypto');

function isAuthenticated(req, res, next) {
  // Get user token from cookie
  const token = req.cookies.user_token;

  if (!token) {
    return res.status(401).json({
      data: null,
      error: "Unauthorized",
    });
  }

  req.app.database.getUser(token)
    .then((result) => {
      if (result.success) {
        req.user = result.data;
        req.user.token = token;
        next();
      }
      else
        return res.status(401).json({
          data: null,
          error: "Unauthorized",
        });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        data: null,
        error: "Internal server error",
      });
    });
}

function isPasswordValid(req, res, next) {
  const { password } = req.body;

  if (!password) return res.status(400).json({
    data: null,
    error: "Missing password",
  });

  const cryptedPassword = crypto.createHash('sha256').update(password).digest('hex');

  req.app.database.checkPassword(req.user.id, cryptedPassword)
    .then((result) => {
      if (!result.success) {
        return res.status(401).json({
          data: null,
          error: "Invalid password",
        });
      }
      else next();
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({
        data: null,
        error: "Internal server error",
      });
    });
}

function hasPermission(requiredPermission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({
        data: null,
        error: "Forbidden: User not authenticated",
      });
    }

    req.app.database.getUserPermissionsByUserId(req.user.id).then((result) => {
      if (result.success) {
        req.user.permissions = result.data;

        if (!req.user.permissions.includes(requiredPermission)) {
          return res.status(403).json({
            data: null,
            error: `Forbidden: Missing required permission`,
          });
        }
        else next();

      }
      else {
        console.error(result.error);
        return res.status(500).json({
          data: null,
          error: "Internal server error",
        });
      }
    })
  };
}

module.exports = {
  isAuthenticated,
  isPasswordValid,
  hasPermission
};