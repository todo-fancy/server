const router = require('express').Router();
const { signin, signup, fbSignIn, googleSignIn, checkLogin } = require('../controllers/userController');

router.get('/checklogin', checkLogin);
router.post('/signin', signin);
router.post('/signup', signup);
router.post('/signin/fb', fbSignIn);
router.post('/signin/google', googleSignIn);

module.exports = router;