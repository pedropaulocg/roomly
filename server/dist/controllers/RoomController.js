"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const RoomServices_1 = require("../services/RoomServices");
class RoomController {
    roomServices;
    constructor() {
        this.roomServices = new RoomServices_1.RoomServices();
    }
    async createRoom(req, res) {
        const data = req.body;
        const room = await this.roomServices.createRoom({
            ...data,
            photo: data.photo || null,
        });
        res.status(201).json(room);
    }
    async getAllRooms(req, res) {
        const rooms = await this.roomServices.getAllRooms();
        res.status(200).json(rooms);
    }
    async getRoomById(req, res) {
        const { id } = req.params;
        const room = await this.roomServices.getRoomById(Number(id));
        res.status(200).json(room);
    }
    async updateRoom(req, res) {
        const { id } = req.params;
        const data = req.body;
        const room = await this.roomServices.updateRoom(Number(id), {
            ...data,
            photo: data.photo || null,
        });
        res.status(200).json(room);
    }
    async deleteRoom(req, res) {
        const { id } = req.params;
        await this.roomServices.deleteRoom(Number(id));
        res.status(200).json({ message: "Room deleted successfully" });
    }
}
exports.RoomController = RoomController;
