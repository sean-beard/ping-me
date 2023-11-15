import bcrypt from "bcryptjs";
import type { UserRepository } from "@/repositories/types";
import type { User } from "./types";


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
}
