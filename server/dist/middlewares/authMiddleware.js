"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const TokenService_1 = require("../helpers/TokenService");
const tokenService = new TokenService_1.TokenService(process.env.JWT_SECRET || "default_secret");
class AuthMiddleware {
    constructor() { }
    handle = (req, res, next) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }
        const [, token] = authHeader.split(' ');
        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido' });
        }
        try {
            const payload = tokenService.verify(token);
            req.user = { id: payload.sub, role: payload.role };
            return next();
        }
        catch {
            return res.status(401).json({ message: 'Token inválido ou expirado' });
        }
    };
}
exports.AuthMiddleware = AuthMiddleware;
