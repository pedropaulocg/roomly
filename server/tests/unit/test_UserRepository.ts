import { UserRepository } from "../../src/repositories/UserRepository";
import { IUser, UserRole } from "../../src/models/User";
import { prisma } from "../../src/config/prisma";
import { resetMocks } from "../conftest";

jest.mock("../../src/config/prisma", () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe("UserRepository", () => {
  let repository: UserRepository;

  beforeEach(() => {
    repository = new UserRepository();
    resetMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("deve criar usuário sem relacionamentos", async () => {
      const userData = {
        name: "João Silva",
        email: "joao@example.com",
        password: "hashedPassword",
        role: "CLIENT" as UserRole,
      };
      const expectedUser: IUser = {
        ...userData,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.user.create as jest.Mock).mockResolvedValue(expectedUser);

      const result = await repository.create(userData);

      expect(result).toEqual(expectedUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: userData,
        include: undefined,
      });
    });

    it("deve criar usuário com relacionamentos quando solicitado", async () => {
      const userData = {
        name: "João Silva",
        email: "joao@example.com",
        password: "hashedPassword",
        role: "CLIENT" as UserRole,
      };
      const expectedUser: IUser = {
        ...userData,
        id: 1,
        rooms: [],
        reservations: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.user.create as jest.Mock).mockResolvedValue(expectedUser);

      const result = await repository.create(userData, {
        includeRooms: true,
        includeReservations: true,
      });

      expect(result).toEqual(expectedUser);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: userData,
        include: { rooms: true, reservations: true },
      });
    });
  });

  describe("findAll", () => {
    it("deve retornar lista vazia quando não há usuários", async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findAll();

      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result).toEqual([]);
      }
    });

    it("deve retornar todos os usuários sem relacionamentos", async () => {
      const users: IUser[] = [
        {
          id: 1,
          name: "João",
          email: "joao@example.com",
          password: "hash",
          role: "CLIENT" as UserRole,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(users);

      const result = await repository.findAll();

      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result).toEqual(users);
      }
    });

    it("deve retornar resultado paginado quando page e limit são fornecidos", async () => {
      const users: IUser[] = [
        {
          id: 1,
          name: "João",
          email: "joao@example.com",
          password: "hash",
          role: "CLIENT" as UserRole,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      (prisma.user.findMany as jest.Mock).mockResolvedValue(users);
      (prisma.user.count as jest.Mock).mockResolvedValue(10);

      const result = await repository.findAll({ page: 1, limit: 10 });

      expect(result).toHaveProperty("data");
      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("page");
      expect(result).toHaveProperty("limit");
      if (!Array.isArray(result)) {
        expect(result.data).toEqual(users);
        expect(result.total).toBe(10);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(10);
      }
    });
  });

  describe("findById", () => {
    it("deve retornar usuário quando ID existe", async () => {
      const id = 1;
      const expectedUser: IUser = {
        id,
        name: "João",
        email: "joao@example.com",
        password: "hash",
        role: "CLIENT" as UserRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(expectedUser);

      const result = await repository.findById(id);

      expect(result).toEqual(expectedUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id },
        include: undefined,
      });
    });

    it("deve usar select quando useSelect é true", async () => {
      const id = 1;
      const expectedUser: Partial<IUser> = {
        id,
        name: "João",
        email: "joao@example.com",
        role: "CLIENT" as UserRole,
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(expectedUser);

      await repository.findById(id, { useSelect: true });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id },
        select: expect.objectContaining({
          id: true,
          name: true,
          email: true,
          role: true,
        }),
      });
    });

    it("deve usar select com includeRooms quando useSelect e includeRooms são true", async () => {
      const id = 1;
      const expectedUser: Partial<IUser> = {
        id,
        name: "João",
        email: "joao@example.com",
        role: "CLIENT" as UserRole,
        rooms: [],
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(expectedUser);

      await repository.findById(id, { useSelect: true, includeRooms: true });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id },
        select: expect.objectContaining({
          rooms: expect.objectContaining({
            select: expect.any(Object),
          }),
        }),
      });
    });

    it("deve usar select com includeReservations quando useSelect e includeReservations são true", async () => {
      const id = 1;
      const expectedUser: Partial<IUser> = {
        id,
        name: "João",
        email: "joao@example.com",
        role: "CLIENT" as UserRole,
        reservations: [],
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(expectedUser);

      await repository.findById(id, {
        useSelect: true,
        includeReservations: true,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id },
        select: expect.objectContaining({
          reservations: expect.objectContaining({
            select: expect.any(Object),
          }),
        }),
      });
    });

    it("deve usar select com ambos includeRooms e includeReservations quando useSelect é true", async () => {
      const id = 1;
      const expectedUser: Partial<IUser> = {
        id,
        name: "João",
        email: "joao@example.com",
        role: "CLIENT" as UserRole,
        rooms: [],
        reservations: [],
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(expectedUser);

      await repository.findById(id, {
        useSelect: true,
        includeRooms: true,
        includeReservations: true,
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id },
        select: expect.objectContaining({
          rooms: expect.objectContaining({
            select: expect.any(Object),
          }),
          reservations: expect.objectContaining({
            select: expect.any(Object),
          }),
        }),
      });
    });

    it("deve retornar null quando ID não existe", async () => {
      const id = 999;
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById(id);

      expect(result).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("deve retornar usuário quando email existe", async () => {
      const email = "joao@example.com";
      const expectedUser: IUser = {
        id: 1,
        name: "João",
        email,
        password: "hash",
        role: "CLIENT" as UserRole,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(expectedUser);

      const result = await repository.findByEmail(email);

      expect(result).toEqual(expectedUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        include: undefined,
      });
    });

    it("deve retornar usuário com relacionamentos quando solicitado", async () => {
      const email = "joao@example.com";
      const expectedUser: IUser = {
        id: 1,
        name: "João",
        email,
        password: "hash",
        role: "CLIENT" as UserRole,
        rooms: [],
        reservations: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(expectedUser);

      const result = await repository.findByEmail(email, {
        includeRooms: true,
        includeReservations: true,
      });

      expect(result).toEqual(expectedUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
        include: { rooms: true, reservations: true },
      });
    });

    it("deve retornar null quando email não existe", async () => {
      const email = "naoexiste@example.com";
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("deve atualizar usuário com dados válidos", async () => {
      const id = 1;
      const updateData = {
        name: "João Atualizado",
        email: "joao@example.com",
        password: "newHash",
        role: "OWNER" as UserRole,
      };
      const updatedUser: IUser = {
        id,
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await repository.update(id, updateData);

      expect(result).toEqual(updatedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
        include: undefined,
      });
    });

    it("deve atualizar usuário com relacionamentos quando solicitado", async () => {
      const id = 1;
      const updateData = {
        name: "João Atualizado",
        email: "joao@example.com",
        password: "newHash",
        role: "OWNER" as UserRole,
      };
      const updatedUser: IUser = {
        id,
        ...updateData,
        rooms: [],
        reservations: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (prisma.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await repository.update(id, updateData, {
        includeRooms: true,
        includeReservations: true,
      });

      expect(result).toEqual(updatedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id },
        data: updateData,
        include: { rooms: true, reservations: true },
      });
    });
  });

  describe("delete", () => {
    it("deve deletar usuário quando ID existe", async () => {
      const id = 1;
      (prisma.user.delete as jest.Mock).mockResolvedValue({} as IUser);

      await repository.delete(id);

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id } });
    });
  });
});

