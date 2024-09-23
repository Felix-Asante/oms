import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

export class CreateOrganizationDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @Transform(({ value }) => value?.toLowerCase())
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value?.toLowerCase())
  @IsUrl()
  website: string;

  @ApiProperty()
  @IsString()
  logo: string;
}
