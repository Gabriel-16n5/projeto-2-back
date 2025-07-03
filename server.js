const express = require('express');
const session = require('express-session');
const path = require('path');
const routes = require('./routes/appRoutes');
const sequelize = require('./models/User').sequelize; // Import sequelize from a model
const User = require('./models/User').User;

// Inicialização do App
const app = express();
const PORT = 3000;

// Configuração de Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do View Engine (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Configuração da Sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'uma-chave-padrao-de-seguranca',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 dia
    }
}));

// Rotas
app.use('/', routes);

// Sincroniza o banco de dados e inicia o servidor
sequelize.sync({ force: false }).then(async () => {
    console.log("Banco de dados sincronizado.");

    // Cria um usuário padrão se não existir
    const userCount = await User.count();
    if (userCount === 0) {
        await User.create({
            email: 'admin@email.com',
            password: '123'
        });
        console.log("Usuário padrão criado: admin@email.com / senha: 123");
    }

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}).catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
});