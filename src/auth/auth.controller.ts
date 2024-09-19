import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SigninDto } from './dtos/sigin.dto';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiConflictResponse()
  async login(@Body() payload: SigninDto) {
    return await this.authService.loginWithEmailPassword(payload);
  }

  @Post('signin')
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @ApiConflictResponse()
  async signIn(@Body() payload: CreateUserDto) {
    return await this.authService.createUser(payload);
  }
}
