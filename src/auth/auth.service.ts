import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO, SignupDTO } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDTO) {
    return await this.users.createUser(dto);
  }

  async validateUser(dto: LoginDTO) {
    const user = await this.users.findOne(dto.email);
    if (!user) throw new UnauthorizedException('Credentials incorrect');
    const pwMatches = await argon.verify(user.hash, dto.password);

    if (user && pwMatches) {
      delete user.hash;
      return user;
    }

    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
