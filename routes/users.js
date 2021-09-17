const router = require('express').Router();
const { validateUserInfo } = require('../middlewares/validation');
const { updateProfile, getMyUser } = require('../controllers/users');

router.get('/me', getMyUser);
router.patch('/me', validateUserInfo, updateProfile);

module.exports = router;
