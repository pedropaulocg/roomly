import { IRoom } from "../models/Room";
import { RoomRepository } from "../repositories/RoomRepository";

export class RoomServices {
  private roomRepository: RoomRepository;

  constructor() {
    this.roomRepository = new RoomRepository();
  }

  async createRoom(room: Omit<IRoom, "id" | "createdAt" | "updatedAt">): Promise<IRoom> {
    return this.roomRepository.create(room);
  }

  async getAllRooms(): Promise<IRoom[]> {
    return this.roomRepository.findAll();
  }

  async getRoomById(id: number): Promise<IRoom | null> {
    return this.roomRepository.findById(id);
  }

  async updateRoom(id: number, room: Omit<IRoom, "id" | "createdAt" | "updatedAt">): Promise<IRoom> {
    return this.roomRepository.update(id, room);
  }

  async deleteRoom(id: number): Promise<void> {
    await this.roomRepository.delete(id);
  }
}
