import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { swaggerAuth } from 'src/common/decorators/swagger.decorator';
import { Roles } from 'src/common/enums/auth.enum';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/common/helpers/files.helper';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/types/users';
import { UpdateOrganizationDto } from './dtos/update-organization.dto';

@Controller('organizations')
@ApiTags('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOrganizationById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.organizationsService.findOrganizationById(id);
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  @UseGuards(JwtAuthGuard)
  @Get(':code')
  async findOrganizationByCode(@Param('code') code: string) {
    return await this.organizationsService.findOrganizationByCode(code);
  }

  @ApiBearerAuth()
  @swaggerAuth(Roles.SuperAdmin)
  @ApiOperation({ summary: '(Super Admin)' })
  @UseGuards(JwtAuthGuard)
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(
  //   FileInterceptor('logo', {
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  @Post()
  async createOrganization(@Body() data: CreateOrganizationDto) {
    return await this.organizationsService.createOrganization(data);
  }

  @ApiBearerAuth()
  @swaggerAuth(Roles.SuperAdmin)
  @ApiOperation({ summary: '(Super Admin)' })
  @UseGuards(JwtAuthGuard)
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(
  //   FileInterceptor('logo', {
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  @Put(':id')
  async updateOrganization(
    @Body() data: UpdateOrganizationDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.organizationsService.updateOrganization(id, data);
  }

  @ApiBearerAuth()
  @swaggerAuth(Roles.OrganizationAdmin)
  @ApiOperation({ summary: '(Organization Admin)' })
  @UseGuards(JwtAuthGuard)
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(
  //   FileInterceptor('logo', {
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  @Put()
  async updateOrganizationByAdmin(
    @Body() data: UpdateOrganizationDto,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return await this.organizationsService.updateByOrganizationAdmin(
      user,
      data,
    );
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: '(Super Admin)' })
  @UseGuards(JwtAuthGuard)
  @swaggerAuth(Roles.SuperAdmin)
  @Delete('id')
  async deleteOrganization(@Param('id', ParseUUIDPipe) id: string) {
    return await this.organizationsService.deleteOrganization(id);
  }
}
