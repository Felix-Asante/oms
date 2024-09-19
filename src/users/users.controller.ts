import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { swaggerAuth } from 'src/common/decorators/swagger.decorator';
import { Roles } from 'src/common/enums/auth.enum';
import { RolesGuard } from 'src/auth/guards/role-guard.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from './types/users';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @Get('me')
  async findCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @Get(':id')
  async findUserById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.findUserById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @swaggerAuth(Roles.SuperAdmin, Roles.OrganizationAdmin)
  @ApiOperation({ summary: '(Super Admin,Org Admin)' })
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.usersService.deleteUser(id, user);
  }
}
