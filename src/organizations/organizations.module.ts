import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  imports: [DrizzleModule, FilesModule],
})
export class OrganizationsModule {}
