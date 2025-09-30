"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class TokenService {
    secret;
    constructor(secret) {
        this.secret = secret;
    }
    generate(payload, expiresIn = '5h') {
        const options = { expiresIn };
        return (0, jsonwebtoken_1.sign)(payload, this.secret, options);
    }
    verify(token) {
        return (0, jsonwebtoken_1.verify)(token, this.secret);
    }
}
exports.TokenService = TokenService;
