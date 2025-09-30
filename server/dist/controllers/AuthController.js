"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(req, res) {
        const { email, password } = req.body;
        const auth = await this.authService.login(email, password);
        res.status(200).json(auth);
    }
}
exports.AuthController = AuthController;
