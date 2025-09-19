import { TokenService } from "../helpers/TokenService";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";


export class AuthService {
  constructor(private readonly tokenService: TokenService, private readonly userRepository: UserRepository) {}

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = this.tokenService.generate({ id: user.id, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    };
  }
}