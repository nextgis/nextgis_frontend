import { NgwError } from './NgwError';
import { NgwExceptions } from '../interfaces';

/**
 * Thrown when ...
 */
export class InsufficientPermissionsError extends NgwError {
  name = 'InsufficientPermissionsError';
  exception: NgwExceptions =
    'nextgisweb.core.exception.InsufficientPermissions';

  constructor(obj: InsufficientPermissionsError) {
    super(obj);
    Object.setPrototypeOf(this, InsufficientPermissionsError.prototype);
  }
}
