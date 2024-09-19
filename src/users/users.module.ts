import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService],
  imports: [DrizzleModule],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
