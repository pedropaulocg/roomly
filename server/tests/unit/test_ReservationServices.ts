import { ReservationServices } from "../../src/services/ReservationServices";
import { ReservationRepository } from "../../src/repositories/ReservationRepository";
import { IReservation, ReservationType } from "../../src/models/Reservation";
import {
  createMockReservation,
  createMockReservationData,
  resetMocks,
} from "../conftest";

const mockFindConflicts = jest.fn();
const mockCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindById = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

jest.mock("../../src/repositories/ReservationRepository", () => {
  return {
    ReservationRepository: jest.fn().mockImplementation(() => ({
      findConflicts: mockFindConflicts,
      create: mockCreate,
      findAll: mockFindAll,
      findById: mockFindById,
      update: mockUpdate,
      delete: mockDelete,
    })),
  };
});

describe("ReservationServices", () => {
  let service: ReservationServices;

  beforeEach(() => {
    service = new ReservationServices();
    resetMocks();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createReservation", () => {
    it("deve criar reserva quando não há conflitos", async () => {
      const reservationData = createMockReservationData();
      const expectedReservation = createMockReservation();
      mockFindConflicts.mockResolvedValue([]);
      mockCreate.mockResolvedValue(expectedReservation);

      const result = await service.createReservation(reservationData);

      expect(result).toEqual(expectedReservation);
      expect(mockFindConflicts).toHaveBeenCalledWith(
        reservationData.roomId,
        reservationData.startDate,
        reservationData.endDate
      );
      expect(mockCreate).toHaveBeenCalledWith(reservationData);
    });

    it("deve lançar erro quando há conflito de datas", async () => {
      const reservationData = createMockReservationData();
      const conflictingReservation = createMockReservation({ id: 1 });
      mockFindConflicts.mockResolvedValue([conflictingReservation]);

      await expect(service.createReservation(reservationData)).rejects.toThrow(
        "Date conflict: room is already reserved for this period"
      );
      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("deve criar reserva do tipo DAILY", async () => {
      const reservationData = createMockReservationData({
        type: "DAILY" as ReservationType,
        totalPrice: 500.0,
      });
      const expectedReservation = createMockReservation({
        type: "DAILY" as ReservationType,
        totalPrice: 500.0,
      });
      mockFindConflicts.mockResolvedValue([]);
      mockCreate.mockResolvedValue(expectedReservation);

      const result = await service.createReservation(reservationData);

      expect(result.type).toBe("DAILY");
      expect(result.totalPrice).toBe(500.0);
    });
  });

  describe("getAllReservations", () => {
    it("deve retornar todas as reservas", async () => {
      const reservations = [
        createMockReservation({ id: 1 }),
        createMockReservation({ id: 2 }),
      ];
      mockFindAll.mockResolvedValue(reservations);

      const result = await service.getAllReservations();

      expect(result).toEqual(reservations);
      expect(mockFindAll).toHaveBeenCalledTimes(1);
    });

    it("deve retornar lista vazia quando não há reservas", async () => {
      mockFindAll.mockResolvedValue([]);

      const result = await service.getAllReservations();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe("getReservationById", () => {
    it("deve retornar reserva quando ID existe", async () => {
      const id = 1;
      const expectedReservation = createMockReservation({ id });
      mockFindById.mockResolvedValue(expectedReservation);

      const result = await service.getReservationById(id);

      expect(result).toEqual(expectedReservation);
      expect(mockFindById).toHaveBeenCalledWith(id);
    });

    it("deve retornar null quando ID não existe", async () => {
      const id = 999;
      mockFindById.mockResolvedValue(null);

      const result = await service.getReservationById(id);

      expect(result).toBeNull();
    });
  });

  describe("updateReservation", () => {
    it("deve atualizar reserva quando não há conflitos", async () => {
      const id = 1;
      const updateData = createMockReservationData({ totalPrice: 200.0 });
      const updatedReservation = createMockReservation({ id, ...updateData });
      mockFindConflicts.mockResolvedValue([]);
      mockUpdate.mockResolvedValue(updatedReservation);

      const result = await service.updateReservation(id, updateData);

      expect(result).toEqual(updatedReservation);
      expect(mockFindConflicts).toHaveBeenCalledWith(
        updateData.roomId,
        updateData.startDate,
        updateData.endDate
      );
      expect(mockUpdate).toHaveBeenCalledWith(id, updateData);
    });

    it("deve atualizar reserva quando conflito é apenas da própria reserva", async () => {
      const id = 1;
      const updateData = createMockReservationData();
      const updatedReservation = createMockReservation({ id, ...updateData });
      const ownReservation = createMockReservation({ id });
      mockFindConflicts.mockResolvedValue([ownReservation]);
      mockUpdate.mockResolvedValue(updatedReservation);

      const result = await service.updateReservation(id, updateData);

      expect(result).toEqual(updatedReservation);
      expect(mockUpdate).toHaveBeenCalledWith(id, updateData);
    });

    it("deve lançar erro quando há conflito com outra reserva", async () => {
      const id = 1;
      const updateData = createMockReservationData();
      const conflictingReservation = createMockReservation({ id: 2 });
      mockFindConflicts.mockResolvedValue([conflictingReservation]);

      await expect(service.updateReservation(id, updateData)).rejects.toThrow(
        "Date conflict: room is already reserved for this period"
      );
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe("deleteReservation", () => {
    it("deve deletar reserva quando ID existe", async () => {
      const id = 1;
      mockDelete.mockResolvedValue(undefined);

      await service.deleteReservation(id);

      expect(mockDelete).toHaveBeenCalledWith(id);
    });

    it("deve lançar erro quando ID não existe", async () => {
      const id = 999;
      const error = new Error("Registro não encontrado");
      mockDelete.mockRejectedValue(error);

      await expect(service.deleteReservation(id)).rejects.toThrow(
        "Registro não encontrado"
      );
    });
  });
});

