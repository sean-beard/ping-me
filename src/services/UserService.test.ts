import { describe, expect, it, vi } from "vitest";
import bcrypt from "bcryptjs";
import { UserService } from "./UserService";
import type { PrismaUserRepository } from "@/repositories/PrismaUserRepository";

type Bcrypt = {
  compare: (s: string, hash: string) => Promise<boolean>;
};

describe(UserService.name, () => {
  it("should create a user", async () => {
    const userRepository = {
      createUser: vi.fn(),
    } as unknown as PrismaUserRepository;

    const userService = new UserService(userRepository);

    await userService.createUser("username", "password");

    expect(userRepository.createUser).toBeCalledWith(
      "username",
      expect.any(String),
    );
  });

  it("should login a user", async () => {
    vi.spyOn(bcrypt as Bcrypt, "compare").mockResolvedValue(true);

    const userRepository = {
      getUser: vi.fn().mockReturnValue({
        id: 1,
        username: "username",
        passwordHash: "passwordHash",
      }),
    } as unknown as PrismaUserRepository;

    const userService = new UserService(userRepository);

    await userService.login("username", "password");

    expect(userRepository.getUser).toBeCalledWith("username");
  });

  it("should get notifications enabled preference", async () => {
    const userRepository = {
      getNotificationsEnabledPreference: vi.fn(),
    } as unknown as PrismaUserRepository;

    const mockUserId = 1;
    const userService = new UserService(userRepository);

    await userService.getNotificationsEnabledPreference(mockUserId);

    expect(userRepository.getNotificationsEnabledPreference).toBeCalledWith(
      mockUserId,
    );
  });

  it("should set notifications enabled preference", async () => {
    const userRepository = {
      setNotificationsEnabledPreference: vi.fn(),
    } as unknown as PrismaUserRepository;

    const mockUserId = 1;
    const mockEnabled = true;
    const userService = new UserService(userRepository);

    await userService.setNotificationsEnabledPreference(
      mockUserId,
      mockEnabled,
    );

    expect(userRepository.setNotificationsEnabledPreference).toBeCalledWith(
      mockUserId,
      mockEnabled,
    );
  });
});
