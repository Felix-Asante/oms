import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateSignedUrlDto } from './dto/create-signedUrl.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('files')
@ApiTags('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  async getUploadUrl(@Body() body: CreateSignedUrlDto) {
    return this.filesService.generateUploadSignedUrl(body.key, body.folder);
  }
}
