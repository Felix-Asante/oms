import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { HTTP_ERROR_CODE } from 'src/constants/errors.constants';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import {
  Organization,
  OrganizationMember,
} from 'src/organizations/schema/organization.schema';
import { users } from './schema/user.schema';
import { User } from './types/users';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findUserById(id: string, removePassword = true) {
    try {
      const user = await this.db
        .select(this.#createFindUserReturningValue())
        .from(users)
        .leftJoin(OrganizationMember, eq(OrganizationMember.user, users.id))
        .leftJoin(
          Organization,
          eq(OrganizationMember.organization, Organization.id),
        )
        .where(eq(users.id, id));

      if (user.length === 0) {
        throw new NotFoundException({
          message: `User with ID ${id} not found`,
          code: HTTP_ERROR_CODE.NOT_FOUND,
        });
      }

      if (removePassword) {
        delete user[0].password;
      }
      return user[0];
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(email: string, removePassword = true) {
    try {
      const user = await this.db
        .select(this.#createFindUserReturningValue())
        .from(users)
        .leftJoin(OrganizationMember, eq(OrganizationMember.user, users.id))
        .leftJoin(
          Organization,
          eq(OrganizationMember.organization, Organization.id),
        )
        .where(eq(users.email, email));

      if (user.length === 0) {
        throw new NotFoundException({
          message: `User with email ${email} not found`,
          code: HTTP_ERROR_CODE.NOT_FOUND,
        });
      }

      if (removePassword) {
        delete user[0].password;
      }
      return user[0];
    } catch (error) {
      throw error;
    }
  }

  async createUser(data: CreateUserDto) {
    try {
      const [existingUser] = await this.db
        .select()
        .from(users)
        .where(eq(users.email, data.email));

      if (existingUser) {
        throw new ConflictException({
          message: `User with email ${data.email} already exists`,
          code: HTTP_ERROR_CODE.CONFLICT,
        });
      }
      const [newUser] = await this.db.insert(users).values(data).returning();
      const { password, ...user } = newUser;

      //   add user to organization
      return user;
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

  async deleteUser(id: string, user: User) {
    try {
      console.log(user);
      await this.findUserById(id);
      return await this.db.delete(users).where(eq(users.id, id));
    } catch (error) {
      throw error;
    }
  }

  #createFindUserReturningValue() {
    return {
      id: users.id,
      email: users.email,
      password: users.password,
      first_name: users.first_name,
      last_name: users.last_name,
      photo: users.photo,
      social_id: users.social_id,
      login_method: users.login_method,
      date_of_birth: users.date_of_birth,
      city: users.city,
      country: users.country,
      created_at: users.created_at,
      updated_at: users.updated_at,
      organization: {
        id: Organization.id,
        name: Organization.name,
        phone: Organization.phone,
        logo: Organization.logo,
        email: Organization.email,
        website: Organization.website,
        created_at: Organization.created_at,
        updated_at: Organization.updated_at,
        role: OrganizationMember.role,
      },
    };
  }
}
