import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { jwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { DrizzleModule } from 'src/drizzle/drizzle.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, jwtStrategy],
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig), // partial registration of jwtConfig. accessible only in this module
    UsersModule,
    DrizzleModule,
  ],
})
export class AuthModule {}
