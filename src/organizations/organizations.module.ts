import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  imports: [DrizzleModule],
})
export class OrganizationsModule {}
