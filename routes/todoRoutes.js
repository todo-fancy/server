const router = require('express').Router();
const { findByUser, findById, create, update, remove, finish } = require('../controllers/todoController');

router.get('/:userId', findByUser);
router.get('/:todoId/detail', findById);
router.post('/', create);
router.put('/:todoId', update);
router.put('/:todoId/finish', finish);
router.delete('/:todoId', remove);

module.exports = router;