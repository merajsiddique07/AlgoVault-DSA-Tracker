const express = require('express');
const router = express.Router();
const {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  markAsAccessed,
  toggleFavorite,
  getStats,
  seedProblems,
} = require('../controllers/problemController');

router.get('/stats', getStats);
router.post('/seed', seedProblems);

router.route('/')
  .get(getProblems)
  .post(createProblem);

router.route('/:id')
  .get(getProblemById)
  .put(updateProblem)
  .delete(deleteProblem);

router.patch('/:id/access', markAsAccessed);
router.patch('/:id/favorite', toggleFavorite);

module.exports = router;
