const router = require('express').Router();

const { login, createUser } = require('../controllers/users');

const {
  validationSignIn,
  validationSignUp,
} = require('../middlewares/Validation');

router.post('/signin', validationSignIn, login);

router.post('/signup', validationSignUp, createUser);

module.exports = router;
