import { NgwError } from './NgwError';

import type { NgwExceptions } from '../interfaces';

/**
 * Thrown when ...
 */
export class ResourceNotFoundError extends NgwError {
  name = 'ResourceNotFoundError';
  exception: NgwExceptions = 'nextgisweb.resource.exception.ResourceNotFound';

  constructor(obj?: ResourceNotFoundError) {
    super(obj);
    Object.setPrototypeOf(this, ResourceNotFoundError.prototype);
  }
}
