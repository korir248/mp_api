import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@app/database';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
