import { RoomServices } from "../../src/services/RoomServices";
import { RoomRepository } from "../../src/repositories/RoomRepository";
import { IRoom } from "../../src/models/Room";
import { resetMocks } from "../conftest";

const mockCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindById = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

jest.mock("../../src/repositories/RoomRepository", () => {
  return {
    RoomRepository: jest.fn().mockImplementation(() => ({
      create: mockCreate,
      findAll: mockFindAll,
      findById: mockFindById,
      update: mockUpdate,
      delete: mockDelete,
    })),
  };
});

describe("RoomServices", () => {
  let service: RoomServices;

  beforeEach(() => {
    service = new RoomServices();
    resetMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createRoom", () => {
    it("deve criar uma sala com dados válidos", async () => {
      const roomData: Omit<IRoom, "id" | "createdAt" | "updatedAt"> = {
        name: "Sala A",
        capacity: 10,
        location: "Andar 1",
        pricePerHour: 50.0,
        pricePerDay: 400.0,
        photo: null,
        ownerId: 1,
      };
      const expectedRoom: IRoom = {
        ...roomData,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockCreate.mockResolvedValue(expectedRoom);

      const result = await service.createRoom(roomData);

      expect(result).toEqual(expectedRoom);
      expect(mockCreate).toHaveBeenCalledWith(roomData);
    });
  });

  describe("getAllRooms", () => {
    it("deve retornar todas as salas", async () => {
      const rooms: IRoom[] = [
        {
          id: 1,
          name: "Sala A",
          capacity: 10,
          location: "Andar 1",
          pricePerHour: 50.0,
          pricePerDay: 400.0,
          photo: null,
          ownerId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockFindAll.mockResolvedValue(rooms);

      const result = await service.getAllRooms();

      expect(result).toEqual(rooms);
      expect(mockFindAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("getRoomById", () => {
    it("deve retornar sala quando ID existe", async () => {
      const id = 1;
      const expectedRoom: IRoom = {
        id,
        name: "Sala A",
        capacity: 10,
        location: "Andar 1",
        pricePerHour: 50.0,
        pricePerDay: 400.0,
        photo: null,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockFindById.mockResolvedValue(expectedRoom);

      const result = await service.getRoomById(id);

      expect(result).toEqual(expectedRoom);
      expect(mockFindById).toHaveBeenCalledWith(id);
    });

    it("deve retornar null quando ID não existe", async () => {
      const id = 999;
      mockFindById.mockResolvedValue(null);

      const result = await service.getRoomById(id);

      expect(result).toBeNull();
    });
  });

  describe("updateRoom", () => {
    it("deve atualizar sala com dados válidos", async () => {
      const id = 1;
      const updateData: Omit<IRoom, "id" | "createdAt" | "updatedAt"> = {
        name: "Sala A Atualizada",
        capacity: 15,
        location: "Andar 1",
        pricePerHour: 60.0,
        pricePerDay: 450.0,
        photo: null,
        ownerId: 1,
      };
      const updatedRoom: IRoom = {
        id,
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockUpdate.mockResolvedValue(updatedRoom);

      const result = await service.updateRoom(id, updateData);

      expect(result).toEqual(updatedRoom);
      expect(mockUpdate).toHaveBeenCalledWith(id, updateData);
    });
  });

  describe("deleteRoom", () => {
    it("deve deletar sala quando ID existe", async () => {
      const id = 1;
      mockDelete.mockResolvedValue(undefined);

      await service.deleteRoom(id);

      expect(mockDelete).toHaveBeenCalledWith(id);
    });
  });
});

