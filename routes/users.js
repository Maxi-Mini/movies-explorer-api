const router = require('express').Router();

const { updateUser, getUser } = require('../controllers/users');

const { validationUser } = require('../middlewares/Validation');

router.get('/users/me', getUser);
router.patch('/users/me', validationUser, updateUser);

module.exports = router;
