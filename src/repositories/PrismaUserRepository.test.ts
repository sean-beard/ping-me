import { describe, expect, it, vi } from "vitest";
import { PrismaUserRepository } from "./PrismaUserRepository";
import type { PrismaClient } from "@prisma/client";

describe(PrismaUserRepository.name, () => {
  const mockUserId = 1;
  const mockUsername = "username";
  const mockPasswordHash = "passwordHash";

  describe("getUser", () => {
    it("should get a user", async () => {
      const client = {
        user: {
          findUnique: vi.fn().mockResolvedValue({
            id: mockUserId,
            password: {
              hash: mockPasswordHash,
            },
          }),
        },
      } as unknown as PrismaClient;

      const userRepository = new PrismaUserRepository(client);

      const user = await userRepository.getUser(mockUsername);

      expect(user).toEqual({
        id: mockUserId,
        username: mockUsername,
        passwordHash: mockPasswordHash,
      });
    });

    it("should return null if user is not found", async () => {
      const client = {
        user: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      } as unknown as PrismaClient;

      const userRepository = new PrismaUserRepository(client);

      const user = await userRepository.getUser("username");

      expect(user).toBeNull();
    });

    it("should return null if user password is not found", async () => {
      const client = {
        user: {
          findUnique: vi.fn().mockResolvedValue({
            id: 1,
            password: null,
          }),
        },
      } as unknown as PrismaClient;

      const userRepository = new PrismaUserRepository(client);

      const user = await userRepository.getUser("username");

      expect(user).toBeNull();
    });

    it("should handle errors when getting a user", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      const mockErrorMessage = "Error querying user by username";
      const client = {
        user: {
          findUnique: vi.fn().mockRejectedValue(new Error(mockErrorMessage)),
        },
      } as unknown as PrismaClient;

      const userRepository = new PrismaUserRepository(client);

      const user = await userRepository.getUser(mockUsername);

      expect(user).toBeNull();
      expect(consoleErrorSpy).toBeCalledWith({
        message: mockErrorMessage,
        username: mockUsername,
      });
    });
  });

  describe("createUser", () => {
    it("should create a user", async () => {
      const client = {
        user: {
          create: vi.fn().mockResolvedValue({ id: mockUserId }),
        },
      } as unknown as PrismaClient;

      const userRepository = new PrismaUserRepository(client);

      const user = await userRepository.createUser(
        mockUsername,
        mockPasswordHash,
      );

      expect(user).toEqual({
        id: mockUserId,
        username: mockUsername,
        passwordHash: mockPasswordHash,
      });
    });

    it("should handle errors when creating a user", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      const mockErrorMessage = "Error creating user";
      const mockError = new Error(mockErrorMessage);
      const client = {
        user: {
          create: vi.fn().mockRejectedValue(mockError),
        },
      } as unknown as PrismaClient;

      const userRepository = new PrismaUserRepository(client);

      const user = await userRepository.createUser(
        mockUsername,
        mockPasswordHash,
      );

      expect(user).toBeNull();
      expect(consoleErrorSpy).toBeCalledWith({
        message: mockErrorMessage,
        username: mockUsername,
        error: mockError,
      });
    });
  });

  describe("getNotificationsEnabledPreference", () => {
    it("should get notifications enabled preference", async () => {
      const client = {
        user: {
          findUnique: vi.fn().mockResolvedValue({ notificationsEnabled: true }),
        },
      } as unknown as PrismaClient;

      const userRepository = new PrismaUserRepository(client);

      const enabled = await userRepository.getNotificationsEnabledPreference(
        mockUserId,
      );

      expect(enabled).toBe(true);
    });

    it("should throw an error if user is not found", async () => {
      const client = {
        user: {
          findUnique: vi.fn().mockResolvedValue(null),
        },
      } as unknown as PrismaClient;

      const userRepository = new PrismaUserRepository(client);

      await expect(
        userRepository.getNotificationsEnabledPreference(mockUserId),
      ).rejects.toThrow("User not found");
    });

    it("should handle errors when getting notifications enabled preference", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      const mockErrorMessage = "Error getting notifications enabled preference";
      const mockError = new Error(mockErrorMessage);
      const client = {
        user: {
          findUnique: vi.fn().mockRejectedValue(mockError),
        },
      } as unknown as PrismaClient;

      const userRepository = new PrismaUserRepository(client);

      await expect(
        userRepository.getNotificationsEnabledPreference(mockUserId),
      ).rejects.toThrow(mockError);

      expect(consoleErrorSpy).toBeCalledWith({
        message: mockErrorMessage,
        userId: mockUserId,
        error: mockError,
      });
    });
  });

  describe("setNotificationsEnabledPreference", () => {
    it("should set notifications enabled preference", async () => {
      const client = {
        user: {
          update: vi.fn(),
        },
      } as unknown as PrismaClient;

      const mockEnabled = true;
      const userRepository = new PrismaUserRepository(client);

      await userRepository.setNotificationsEnabledPreference(
        mockUserId,
        mockEnabled,
      );

      expect(client.user.update).toBeCalledWith({
        where: { id: mockUserId },
        data: { notificationsEnabled: mockEnabled },
      });
    });

    it("should handle errors when setting notifications enabled preference", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error");

      const mockErrorMessage = "Error setting notifications enabled preference";
      const mockError = new Error(mockErrorMessage);
      const client = {
        user: {
          update: vi.fn().mockRejectedValue(mockError),
        },
      } as unknown as PrismaClient;

      const mockEnabled = true;
      const userRepository = new PrismaUserRepository(client);

      await expect(
        userRepository.setNotificationsEnabledPreference(
          mockUserId,
          mockEnabled,
        ),
      ).rejects.toThrow(mockError);

      expect(consoleErrorSpy).toBeCalledWith({
        message: mockErrorMessage,
        userId: mockUserId,
        enabled: mockEnabled,
        error: mockError,
      });
    });
  });
});
