import { applyDecorators, SetMetadata } from '@nestjs/common';
import { Roles } from '../enums/auth.enum';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { authConstants } from 'src/constants/index.constants';

export function swaggerAuth(...roles: Roles[]) {
  return applyDecorators(
    SetMetadata(authConstants.roleMetaKey, roles),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiNotFoundResponse({ description: 'Ressource cannot be found' }),
    ApiBadRequestResponse({ description: 'Bad request' }),
    ApiInternalServerErrorResponse({ description: 'Internal server error' }),
  );
}
