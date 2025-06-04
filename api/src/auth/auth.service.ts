import { ConflictException, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';
import { RegisterUserResponse } from './types/register-response.type';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(user: RegisterUserDto): Promise<RegisterUserResponse> {
    const existingUser = await this.userService.findOne({
      email: user.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const newUser = await this.userService.create(user);
    const payload = { sub: newUser.id };
    const token = this.jwtService.sign(payload);
    return {
      message: 'User registered successfully',
      accessToken: token,
    };
  }
}
