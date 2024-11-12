// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const connectDB = require('./connect/db');
const productsRouter = require('./routes/products'); // Verifique se este arquivo existe
const errorHandler = require('./middleware/errorHandler'); // Verifique se este arquivo existe

require('dotenv').config();

const app = express();

// Função para configurar middlewares
function setupMiddlewares(app) {
    app.use(helmet({
        contentSecurityPolicy: false,
    }));
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
}

// Conectar ao MongoDB
async function startServer() {
    try {
        await connectDB();
        console.log('Conectado ao MongoDB');
        
        // Configurar middlewares
        setupMiddlewares(app);

        // Usar o roteador de produtos
        app.use('/api/products', productsRouter); // Verifique se productsRouter é uma função de middleware

        // Middleware para tratamento de rotas não encontradas
        app.use((req, res) => {
            res.status(404).json({ msg: 'Rota não encontrada' });
        });

        // Middleware de tratamento de erros
        app.use(errorHandler); // Verifique se errorHandler é uma função de middleware
            
        // Inicia o servidor
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1);
    }
}

// Iniciar o servidor
startServer();