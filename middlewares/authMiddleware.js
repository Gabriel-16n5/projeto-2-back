exports.isAuthenticated = (req, res, next) => {
    // Se a sessão com o ID do usuário existe, ele está autenticado
    if (req.session.userId) {
        return next();
    }
    // Caso contrário, redireciona para a página de login
    res.redirect('/login');
};