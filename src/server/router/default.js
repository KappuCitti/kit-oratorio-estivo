/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
module.exports = (router, base) => {
  router.get(base + "/", (req, res) => {
    const data = {
      version: "0.0.1",
      name: "Server API per la comunicazione tra l'interfaccia web ed il database",
      authors: ['KappuCitti'],
    }

    res.status(200).json(data);
  });
};