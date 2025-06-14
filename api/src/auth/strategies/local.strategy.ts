import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'generated/prisma';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(username: string, password: string): Promise<User> {
    const user = this.authService.verifyUser(username, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
