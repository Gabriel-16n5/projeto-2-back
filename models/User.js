const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

// Configuração da conexão com o banco de dados SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite' // O banco será um arquivo na raiz do projeto
});

// Definição do Modelo User
const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    hooks: {
        // Antes de criar um usuário, criptografa a senha
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
});

// Método para validar a senha
User.prototype.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Exporta o modelo e a instância do sequelize
module.exports = { sequelize, User };