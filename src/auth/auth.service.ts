import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  createHashedString,
  verifyHashedString,
} from 'src/common/helpers/security.helper';
import { HTTP_ERROR_CODE } from 'src/constants/errors.constants';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { users } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninDto } from './dtos/sigin.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
    @Inject(DRIZZLE)
    private readonly db: DrizzleDB,
  ) {}

  async loginWithEmailPassword(payload: SigninDto) {
    try {
      const user = await this.userService.findUserByEmail(payload.email, false);
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

  async createUser(payload: CreateUserDto) {
    try {
      const { email, password, first_name, last_name } = payload;
      await this.userService.findUserByEmail(email, false);
      const hashedPassword = await createHashedString(password);

      const [newUser] = await this.db
        .insert(users)
        .values({
          email,
          password: hashedPassword,
          first_name,
          last_name,
        })
        .returning();

      return {
        user: newUser,
        token: this.createJwtToken({
          sub: { id: newUser.id, email: newUser.email },
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  createJwtToken(payload: { sub: any }) {
    return this.jwtService.sign(payload);
  }
}
