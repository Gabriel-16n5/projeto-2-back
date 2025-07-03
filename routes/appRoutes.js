const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Rota principal redireciona para o login
router.get('/', (req, res) => res.redirect('/login'));

// Rotas de Autenticação
router.get('/login', authController.showLoginPage);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Rota Protegida (usa o middleware)
router.get('/protegida', isAuthenticated, authController.showProtectedPage);

module.exports = router;