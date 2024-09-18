import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { users } from './schema/user.schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findUserById(id: string) {
    try {
      const user = await this.db.select().from(users).where(eq(users.id, id));
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return user[0];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error retrieving user', {
        cause: error,
      });
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!user) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return user[0];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error retrieving user', {
        cause: error,
      });
    }
  }

  async createUser(data: any) {
    try {
      const existingUser = this.findUserByEmail(data.email);
      if (existingUser) {
        throw new ConflictException(
          `User with email ${data.email} already exists`,
        );
      }
      return await this.db.insert(users).values(data);
    } catch (error) {
      throw new InternalServerErrorException('Error creating user', {
        cause: error,
      });
    }
  }

  async updateUser(id: string, data: any) {
    try {
      await this.findUserById(id);
      return await this.db.update(users).set(data);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error updating user', {
        cause: error,
      });
    }
  }

  async deleteUser(id: string) {
    try {
      await this.findUserById(id);
      return await this.db.delete(users).where(eq(users.id, id));
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error deleting user', {
        cause: error,
      });
    }
  }

  // Additional methods can be added here
}
