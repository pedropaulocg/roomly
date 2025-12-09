import { RoomRepository } from "../../src/repositories/RoomRepository";
import { IRoom } from "../../src/models/Room";
import { prisma } from "../../src/config/prisma";
import { resetMocks } from "../conftest";

jest.mock("../../src/config/prisma", () => ({
  prisma: {
    room: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("RoomRepository", () => {
  let repository: RoomRepository;

  beforeEach(() => {
    repository = new RoomRepository();
    resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
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
      (prisma.room.create as jest.Mock).mockResolvedValue(expectedRoom);

      const result = await repository.create(roomData);

      expect(result).toEqual(expectedRoom);
      expect(prisma.room.create).toHaveBeenCalledWith({ data: roomData });
    });

    it("deve lançar erro quando criação falha", async () => {
      const roomData: Omit<IRoom, "id" | "createdAt" | "updatedAt"> = {
        name: "Sala A",
        capacity: 10,
        location: "Andar 1",
        pricePerHour: 50.0,
        pricePerDay: 400.0,
        photo: null,
        ownerId: 1,
      };
      const error = new Error("Erro ao criar sala");
      (prisma.room.create as jest.Mock).mockRejectedValue(error);

      await expect(repository.create(roomData)).rejects.toThrow("Erro ao criar sala");
    });
  });

  describe("findAll", () => {
    it("deve retornar lista vazia quando não há salas", async () => {
      (prisma.room.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it("deve retornar todas as salas quando existem", async () => {
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
        {
          id: 2,
          name: "Sala B",
          capacity: 20,
          location: "Andar 2",
          pricePerHour: 80.0,
          pricePerDay: 600.0,
          photo: null,
          ownerId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      (prisma.room.findMany as jest.Mock).mockResolvedValue(rooms);

      const result = await repository.findAll();

      expect(result).toEqual(rooms);
      expect(result.length).toBe(2);
    });
  });

  describe("findById", () => {
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
      (prisma.room.findUnique as jest.Mock).mockResolvedValue(expectedRoom);

      const result = await repository.findById(id);

      expect(result).toEqual(expectedRoom);
      expect(prisma.room.findUnique).toHaveBeenCalledWith({ where: { id } });
    });

    it("deve retornar null quando ID não existe", async () => {
      const id = 999;
      (prisma.room.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById(id);

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
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
      (prisma.room.update as jest.Mock).mockResolvedValue(updatedRoom);

      const result = await repository.update(id, updateData);

      expect(result).toEqual(updatedRoom);
      expect(prisma.room.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
    });

    it("deve lançar erro quando ID não existe", async () => {
      const id = 999;
      const updateData: Omit<IRoom, "id" | "createdAt" | "updatedAt"> = {
        name: "Sala A",
        capacity: 10,
        location: "Andar 1",
        pricePerHour: 50.0,
        pricePerDay: 400.0,
        photo: null,
        ownerId: 1,
      };
      const error = new Error("Registro não encontrado");
      (prisma.room.update as jest.Mock).mockRejectedValue(error);

      await expect(repository.update(id, updateData)).rejects.toThrow(
        "Registro não encontrado"
      );
    });
  });

  describe("delete", () => {
    it("deve deletar sala quando ID existe", async () => {
      const id = 1;
      const deletedRoom: IRoom = {
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
      (prisma.room.delete as jest.Mock).mockResolvedValue(deletedRoom);

      await repository.delete(id);

      expect(prisma.room.delete).toHaveBeenCalledWith({ where: { id } });
    });

    it("deve lançar erro quando ID não existe", async () => {
      const id = 999;
      const error = new Error("Registro não encontrado");
      (prisma.room.delete as jest.Mock).mockRejectedValue(error);

      await expect(repository.delete(id)).rejects.toThrow("Registro não encontrado");
    });
  });
});

