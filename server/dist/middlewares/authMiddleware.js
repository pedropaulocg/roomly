"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const TokenService_1 = require("../helpers/TokenService");
const tokenService = new TokenService_1.TokenService(process.env.JWT_SECRET || "default_secret");
class AuthMiddleware {
    constructor() { }
    handle = (req, res, next) => {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ message: "Token não fornecido" });
        }
        const [, token] = authHeader.split(" ");
        if (!token) {
            return res.status(401).json({ message: "Token não fornecido" });
        }
        try {
            const payload = tokenService.verify(token);
            req.user = { id: payload.sub, role: payload.role };
            return next();
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({
                    message: "Token expirado",
                    code: "TOKEN_EXPIRED",
                });
            }
            if (error.name === "JsonWebTokenError") {
                return res.status(401).json({
                    message: "Token inválido",
                    code: "TOKEN_INVALID",
                });
            }
            return res.status(401).json({
                message: "Erro ao verificar token",
                code: "TOKEN_ERROR",
            });
        }
    };
}
exports.AuthMiddleware = AuthMiddleware;
