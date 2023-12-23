import bcrypt from "bcryptjs";
import type { User } from "./types";
import type { PrismaUserRepository } from "@/repositories/PrismaUserRepository";

type UserRepository = PrismaUserRepository;

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(username: string, password: string): Promise<User | null> {
    const passwordHash = await bcrypt.hash(password, 10);

    return this.userRepository.createUser(username, passwordHash);
  }

  /**
   * @throws {Error} - User not found
   * @throws {Error} - Invalid password
   */
  async login(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.getUser(username);

    if (!user) {
      throw new Error("User not found");
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      throw new Error("Invalid password");
    }

    return user;
  }

  async getNotificationsEnabledPreference(userId: number): Promise<boolean> {
    return this.userRepository.getNotificationsEnabledPreference(userId);
  }

  async setNotificationsEnabledPreference(
    userId: number,
    enabled: boolean,
  ): Promise<void> {
    return this.userRepository.setNotificationsEnabledPreference(
      userId,
      enabled,
    );
  }
}
