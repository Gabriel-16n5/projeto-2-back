const { User } = require('../models/User');

// Mostra a página de login
exports.showLoginPage = (req, res) => {
    res.render('login', { error: null });
};

// Processa o formulário de login
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('login', { error: 'Por favor, preencha todos os campos.' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.isValidPassword(password))) {
        return res.render('login', { error: 'Email ou senha inválidos.' });
    }

    // Se o login for bem-sucedido, cria a sessão
    req.session.userId = user.id;
    res.redirect('/protegida');
};

// Mostra a página protegida
exports.showProtectedPage = (req, res) => {
    res.render('protegida');
};

// Faz logout do usuário
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/protegida');
        }
        res.clearCookie('connect.sid');
        res.redirect('/login');
    });
};