"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomServices = void 0;
const RoomRepository_1 = require("../repositories/RoomRepository");
class RoomServices {
    roomRepository;
    constructor() {
        this.roomRepository = new RoomRepository_1.RoomRepository();
    }
    async createRoom(room) {
        return this.roomRepository.create(room);
    }
    async getAllRooms() {
        return this.roomRepository.findAll();
    }
    async getRoomById(id) {
        return this.roomRepository.findById(id);
    }
    async updateRoom(id, room) {
        return this.roomRepository.update(id, room);
    }
    async deleteRoom(id) {
        await this.roomRepository.delete(id);
    }
}
exports.RoomServices = RoomServices;
