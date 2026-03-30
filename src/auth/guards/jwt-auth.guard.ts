import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { catchError, of, Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    const parentResult = super.canActivate(context);

    if (isPublic) {
      if (parentResult instanceof Promise) {
        return parentResult.catch(() => true);
      } else if (parentResult instanceof Observable) {
        return parentResult.pipe(catchError(() => of(true)));
      }
      return parentResult;
    }

    return super.canActivate(context);
  }
}
