// auth/optional-jwt.guard.ts
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const req = context
      .switchToHttp()
      .getRequest<Request & { cookies?: any }>();
    const hasAuthHeader = !!req.headers?.authorization;
    const hasCookieToken = !!req.cookies?.['access_token'];

    // No token anywhere? Allow as guest.
    if (!hasAuthHeader && !hasCookieToken) {
      return true;
    }
    // Token provided -> run normal JWT guard flow
    return super.canActivate(context) as boolean | Promise<boolean>;
  }

  // Called only when super.canActivate runs (i.e., token was provided)
  handleRequest(err: any, user: any, info?: any) {
    if (err) throw err;
    if (info) {
      // Token was provided but invalid/expired
      throw new UnauthorizedException(info?.message ?? 'Invalid token');
    }
    // Valid token -> user object, otherwise null
    return user || null;
  }
}
