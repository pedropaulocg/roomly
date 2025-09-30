"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const roomRoutes_1 = __importDefault(require("./roomRoutes"));
const reservationRoutes_1 = __importDefault(require("./reservationRoutes"));
const router = (0, express_1.Router)();
router.use('/users', userRoutes_1.default);
router.use('/auth', authRoutes_1.default);
router.use('/rooms', roomRoutes_1.default);
router.use('/reservations', reservationRoutes_1.default);
exports.default = router;
