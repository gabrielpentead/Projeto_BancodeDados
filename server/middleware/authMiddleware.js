const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Supondo que você tenha um modelo de usuário

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.user; // Obtendo o token do cookie

    if (!token) {
        return res.status(401).json({ msg: 'Acesso não autorizado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica o token
        req.user = await User.findById(decoded.id); // Busca o usuário no banco de dados
        if (!req.user) {
            return res.status(401).json({ msg: 'Usuário não encontrado' });
        }
        next(); // Chama o próximo middleware
    } catch (error) {
        return res.status(403).json({ msg: 'Token inválido' });
    }
};

module.exports = authMiddleware;