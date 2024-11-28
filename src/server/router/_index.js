/*
 *   Copyright (c) 2024 KappuCitti.
 *   All rights reserved.
 *
 *   Licensed under the MIT License.
 *   See LICENSE file in the project root for full license information.
 */
const { Router } = require('express');
const router = Router();

const def = require('./default');
const user = require('./user');
const enrollments = require('./enrollments');
const teams = require('./teams');
const weeks = require('./weeks');
const people = require('./people');
const shirts = require('./shirts');
const child = require('./child');
const parent = require('./parent');
const attendances = require('./attendances');
const leaderboard = require('./leaderboard');

module.exports = () => {
  def(router, '/api/v1');
  user(router, '/api/v1/user');
  enrollments(router, '/api/v1/enrollments');
  teams(router, '/api/v1/teams');
  weeks(router, '/api/v1/weeks');
  people(router, '/api/v1/people');
  child(router, '/api/v1/people/child');
  parent(router, '/api/v1/people/parent');
  shirts(router, '/api/v1/shirts');
  attendances(router, '/api/v1/attendances');
  leaderboard(router, '/api/v1/leaderboard');

  router.get('*', (req, res) => {
    res.redirect('/api/v1');
  });

  return router;
};