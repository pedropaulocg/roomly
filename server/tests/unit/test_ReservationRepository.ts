import { ReservationRepository } from "../../src/repositories/ReservationRepository";
import { IReservation, ReservationType } from "../../src/models/Reservation";
import { prisma } from "../../src/config/prisma";
import {
  createMockReservation,
  createMockReservationData,
  resetMocks,
} from "../conftest";

jest.mock("../../src/config/prisma", () => ({
  prisma: {
    reservation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("ReservationRepository", () => {
  let repository: ReservationRepository;

  beforeEach(() => {
    repository = new ReservationRepository();
    resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("deve criar uma reserva com dados válidos", async () => {
      const reservationData = createMockReservationData();
      const expectedReservation = createMockReservation();
      (prisma.reservation.create as jest.Mock).mockResolvedValue(
        expectedReservation
      );

      const result = await repository.create(reservationData);

      expect(result).toEqual(expectedReservation);
      expect(prisma.reservation.create).toHaveBeenCalledTimes(1);
      expect(prisma.reservation.create).toHaveBeenCalledWith({
        data: reservationData,
      });
      expect(result.id).toBeDefined();
      expect(result.startDate).toEqual(reservationData.startDate);
      expect(result.endDate).toEqual(reservationData.endDate);
    });

    it("deve criar uma reserva do tipo DAILY", async () => {
      const reservationData = createMockReservationData({
        type: "DAILY" as ReservationType,
        totalPrice: 500.0,
      });
      const expectedReservation = createMockReservation({
        type: "DAILY" as ReservationType,
        totalPrice: 500.0,
      });
      (prisma.reservation.create as jest.Mock).mockResolvedValue(
        expectedReservation
      );

      const result = await repository.create(reservationData);

      expect(result.type).toBe("DAILY");
      expect(result.totalPrice).toBe(500.0);
      expect(prisma.reservation.create).toHaveBeenCalledWith({
        data: reservationData,
      });
    });

    it("deve lançar erro quando criação falha", async () => {
      const reservationData = createMockReservationData();
      const error = new Error("Erro ao criar reserva");
      (prisma.reservation.create as jest.Mock).mockRejectedValue(error);

      await expect(repository.create(reservationData)).rejects.toThrow(
        "Erro ao criar reserva"
      );
      expect(prisma.reservation.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("findAll", () => {
    it("deve retornar lista vazia quando não há reservas", async () => {
      (prisma.reservation.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
      expect(prisma.reservation.findMany).toHaveBeenCalledTimes(1);
    });

    it("deve retornar todas as reservas quando existem", async () => {
      const reservations = [
        createMockReservation({ id: 1 }),
        createMockReservation({ id: 2, roomId: 2 }),
        createMockReservation({ id: 3, clientId: 2 }),
      ];
      (prisma.reservation.findMany as jest.Mock).mockResolvedValue(
        reservations
      );

      const result = await repository.findAll();

      expect(result).toEqual(reservations);
      expect(result.length).toBe(3);
      expect(prisma.reservation.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("findById", () => {
    it("deve retornar reserva quando ID existe", async () => {
      const id = 1;
      const expectedReservation = createMockReservation({ id });
      (prisma.reservation.findUnique as jest.Mock).mockResolvedValue(
        expectedReservation
      );

      const result = await repository.findById(id);

      expect(result).toEqual(expectedReservation);
      expect(result?.id).toBe(id);
      expect(prisma.reservation.findUnique).toHaveBeenCalledTimes(1);
      expect(prisma.reservation.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it("deve retornar null quando ID não existe", async () => {
      const id = 999;
      (prisma.reservation.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById(id);

      expect(result).toBeNull();
      expect(prisma.reservation.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it("deve lidar com ID zero (edge case)", async () => {
      const id = 0;
      (prisma.reservation.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById(id);

      expect(result).toBeNull();
      expect(prisma.reservation.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe("findConflicts", () => {
    it("deve encontrar conflitos quando há sobreposição de datas", async () => {
      const roomId = 1;
      const startDate = new Date("2024-01-01T11:00:00Z");
      const endDate = new Date("2024-01-01T13:00:00Z");
      const conflictingReservation = createMockReservation({
        id: 1,
        roomId,
        startDate: new Date("2024-01-01T10:00:00Z"),
        endDate: new Date("2024-01-01T12:00:00Z"),
      });
      (prisma.reservation.findMany as jest.Mock).mockResolvedValue([
        conflictingReservation,
      ]);

      const result = await repository.findConflicts(roomId, startDate, endDate);

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe(1);
      expect(prisma.reservation.findMany).toHaveBeenCalledWith({
        where: {
          roomId,
          AND: [{ startDate: { lt: endDate } }, { endDate: { gt: startDate } }],
        },
      });
    });

    it("deve retornar lista vazia quando não há conflitos", async () => {
      const roomId = 1;
      const startDate = new Date("2024-01-01T14:00:00Z");
      const endDate = new Date("2024-01-01T16:00:00Z");
      (prisma.reservation.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findConflicts(roomId, startDate, endDate);

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it("deve encontrar múltiplos conflitos", async () => {
      const roomId = 1;
      const startDate = new Date("2024-01-01T11:00:00Z");
      const endDate = new Date("2024-01-01T15:00:00Z");
      const conflicts = [
        createMockReservation({
          id: 1,
          roomId,
          startDate: new Date("2024-01-01T10:00:00Z"),
          endDate: new Date("2024-01-01T12:00:00Z"),
        }),
        createMockReservation({
          id: 2,
          roomId,
          startDate: new Date("2024-01-01T14:00:00Z"),
          endDate: new Date("2024-01-01T16:00:00Z"),
        }),
      ];
      (prisma.reservation.findMany as jest.Mock).mockResolvedValue(conflicts);

      const result = await repository.findConflicts(roomId, startDate, endDate);

      expect(result).toHaveLength(2);
      expect(result[0]?.id).toBe(1);
      expect(result[1]?.id).toBe(2);
    });

    it("deve verificar conflitos apenas para a sala especificada", async () => {
      const roomId = 1;
      const startDate = new Date("2024-01-01T11:00:00Z");
      const endDate = new Date("2024-01-01T13:00:00Z");
      (prisma.reservation.findMany as jest.Mock).mockResolvedValue([]);

      await repository.findConflicts(roomId, startDate, endDate);

      expect(prisma.reservation.findMany).toHaveBeenCalledWith({
        where: {
          roomId: 1,
          AND: [{ startDate: { lt: endDate } }, { endDate: { gt: startDate } }],
        },
      });
    });
  });

  describe("update", () => {
    it("deve atualizar reserva com dados válidos", async () => {
      const id = 1;
      const updateData = createMockReservationData({
        totalPrice: 200.0,
        type: "DAILY" as ReservationType,
      });
      const updatedReservation = createMockReservation({
        id,
        ...updateData,
      });
      (prisma.reservation.update as jest.Mock).mockResolvedValue(
        updatedReservation
      );

      const result = await repository.update(id, updateData);

      expect(result).toEqual(updatedReservation);
      expect(result.totalPrice).toBe(200.0);
      expect(result.type).toBe("DAILY");
      expect(prisma.reservation.update).toHaveBeenCalledTimes(1);
      expect(prisma.reservation.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
    });

    it("deve lançar erro quando ID não existe na atualização", async () => {
      const id = 999;
      const updateData = createMockReservationData();
      const error = new Error("Registro não encontrado");
      (prisma.reservation.update as jest.Mock).mockRejectedValue(error);

      await expect(repository.update(id, updateData)).rejects.toThrow(
        "Registro não encontrado"
      );
      expect(prisma.reservation.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
      });
    });
  });

  describe("delete", () => {
    it("deve deletar reserva quando ID existe", async () => {
      const id = 1;
      const deletedReservation = createMockReservation({ id });
      (prisma.reservation.delete as jest.Mock).mockResolvedValue(
        deletedReservation
      );

      await repository.delete(id);

      expect(prisma.reservation.delete).toHaveBeenCalledTimes(1);
      expect(prisma.reservation.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it("deve lançar erro quando ID não existe na deleção", async () => {
      const id = 999;
      const error = new Error("Registro não encontrado");
      (prisma.reservation.delete as jest.Mock).mockRejectedValue(error);

      await expect(repository.delete(id)).rejects.toThrow(
        "Registro não encontrado"
      );
      expect(prisma.reservation.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
