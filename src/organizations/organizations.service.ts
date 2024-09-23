import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, exists } from 'drizzle-orm';
import { DRIZZLE } from 'src/drizzle/drizzle.module';
import { DrizzleDB } from 'src/drizzle/types/drizzle';
import { Organization, OrganizationMember } from './schema/organization.schema';
import { HTTP_ERROR_CODE } from 'src/constants/errors.constants';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { User } from 'src/users/types/users';
import { Roles } from 'src/common/enums/auth.enum';
import { Roles as RolesSchema } from 'src/users/schema/roles.schema';
import { generateRandomString, slugify } from 'src/common/helpers/index.helper';

@Injectable()
export class OrganizationsService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findOrganizationById(id: string) {
    try {
      const organization = await this.db.query.Organization.findFirst({
        where: eq(Organization.id, id),
      });

      if (!organization) {
        throw new NotFoundException({
          message: 'Organization not found',
          code: HTTP_ERROR_CODE.NOT_FOUND,
        });
      }
      return organization;
    } catch (error) {
      throw error;
    }
  }

  async findOrganizationByCode(code: string) {
    try {
      const organization = await this.db.query.Organization.findFirst({
        where: eq(Organization.code, code),
      });

      if (!organization) {
        throw new NotFoundException({
          message: 'Organization not found',
          code: HTTP_ERROR_CODE.NOT_FOUND,
        });
      }
      return organization;
    } catch (error) {
      throw error;
    }
  }

  async createOrganization(data: CreateOrganizationDto) {
    try {
      const { logo, ...payload } = data;
      const slug = `${slugify(payload.name)}-${generateRandomString(4)}`;
      // upload logo
      const [newOrganization] = await this.db
        .insert(Organization)
        .values({ ...payload, slug })
        .returning();
      return newOrganization;
    } catch (error) {
      throw error;
    }
  }

  async updateOrganization(id: string, data: UpdateOrganizationDto) {
    try {
      await this.findOrganizationById(id);

      await this.db
        .update(Organization)
        .set(data)
        .where(eq(Organization.id, id))
        .returning();
    } catch (error) {
      throw error;
    }
  }

  async updateByOrganizationAdmin(user: User, data: UpdateOrganizationDto) {
    try {
      const organization = await this.findOrganizationById(
        user.organization.id,
      );
      const organizationAdminRole = await this.db.query.Roles.findFirst({
        where: eq(RolesSchema.label, Roles.OrganizationAdmin),
      });
      // confirm user role in the organization
      const isAdmin = await this.db.query.OrganizationMember.findFirst({
        where: exists(
          and(
            eq(OrganizationMember.user, user.id),
            eq(OrganizationMember.role, organizationAdminRole.id),
            eq(OrganizationMember.organization, organization.id),
          ),
        ),
      });

      if (!isAdmin) {
        throw new ForbiddenException({
          message: 'You cannot modify this organization',
          code: HTTP_ERROR_CODE.FORBIDDEN,
        });
      }
      await this.db
        .update(Organization)
        .set(data)
        .where(eq(Organization.id, organization.id))
        .returning();
    } catch (error) {
      throw error;
    }
  }

  async deleteOrganization(id: string) {
    try {
      await this.findOrganizationById(id);
      await this.db.delete(Organization).where(eq(Organization.id, id));

      return {
        message: 'Organization deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
