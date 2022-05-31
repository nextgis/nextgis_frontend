import { NgwExceptions } from '../interfaces';

/**
 * Thrown when...
 */
export class NgwError extends Error {
  name = 'NgwError';

  title!: string;
  message!: string;
  detail!: string;
  exception!: NgwExceptions;
  status_code!: number | 404 | 500;
  data?: Record<string, any>;
  guru_meditation!: string;

  constructor(er?: Partial<NgwError>) {
    super();
    Object.assign(this, er);
    Object.setPrototypeOf(this, NgwError.prototype);
  }
}
