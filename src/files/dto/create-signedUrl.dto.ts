import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { ASSETS_FOLDER } from 'src/common/enums/files.enum';

export class CreateSignedUrlDto {
  @IsString()
  @ApiProperty()
  key: string;

  @IsEnum(ASSETS_FOLDER)
  @ApiProperty({ enum: ASSETS_FOLDER })
  folder: ASSETS_FOLDER;
}
