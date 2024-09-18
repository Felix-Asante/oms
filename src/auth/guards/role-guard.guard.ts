import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Roles } from 'src/common/enums/auth.enum';
import { authConstants } from 'src/constants/index.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Roles[]>(
      authConstants.roleMetaKey,
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const user = context.switchToHttp().getRequest().user;

    return roles.some((role) => user.role.label === role);
  }
}
