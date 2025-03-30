import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {
  // reflector se usa para obtener la metadata (ver decorador SetMeadata)
  constructor(private readonly reflector: Reflector) {}

  /**
   * para que un guard sea válido debe implementar el método
   * canActivate
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      'roles',
      context.getHandler(),
    );

    console.log(validRoles);

    return true;
  }
}
