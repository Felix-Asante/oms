import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verifyHashedString } from 'src/common/helpers/security.helper';
import { UsersService } from 'src/users/users.service';
import { SigninDto } from './dtos/sigin.dto';
import { HTTP_ERROR_CODE } from 'src/constants/errors.constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async loginWithEmailPassword(payload: SigninDto) {
    try {
      const user = await this.userService.findUserByEmail(payload.email);
      if (verifyHashedString(user.password, payload.password)) {
        return {
          user,
          token: this.createJwtToken({
            sub: { id: user.id, email: user.email },
          }),
        };
      }

      throw new BadRequestException({
        code: HTTP_ERROR_CODE.BAD_REQUEST,
        message: 'Inccorect password',
      });
    } catch (error) {
      throw error;
    }
  }

  createJwtToken(payload: { sub: any }) {
    return this.jwtService.sign(payload);
  }
}
