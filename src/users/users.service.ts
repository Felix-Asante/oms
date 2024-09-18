import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { users } from './schema/user.schema';
import { HTTP_ERROR_CODE } from 'src/constants/errors.constants';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findUserById(id: string) {
    try {
      const user = await this.db.select().from(users).where(eq(users.id, id));
      if (user.length === 0) {
        throw new NotFoundException({
          message: `User with ID ${id} not found`,
          code: HTTP_ERROR_CODE.NOT_FOUND,
        });
      }
      return user[0];
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (user.length === 0) {
        throw new NotFoundException({
          message: `User with email ${email} not found`,
          code: HTTP_ERROR_CODE.NOT_FOUND,
        });
      }
      return user[0];
    } catch (error) {
      throw error;
    }
  }

  async createUser(data: any) {
    try {
      const existingUser = this.findUserByEmail(data.email);
      if (existingUser) {
        throw new ConflictException({
          message: `User with email ${data.email} already exists`,
          code: HTTP_ERROR_CODE.CONFLICT,
        });
      }
      return await this.db.insert(users).values(data);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, data: any) {
    try {
      await this.findUserById(id);
      return await this.db.update(users).set(data);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      await this.findUserById(id);
      return await this.db.delete(users).where(eq(users.id, id));
    } catch (error) {
      throw error;
    }
  }

  // Additional methods can be added here
}
