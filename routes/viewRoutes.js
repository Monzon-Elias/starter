const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn); //adding this middleware here will make all the following routers visible only to logged in users
router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour); //no puse el '/' decue de 'tour' y me torturó hasta q lo encontré
router.get('/login', viewController.getLoginForm);

module.exports = router;
