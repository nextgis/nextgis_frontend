import { BaseProviderOptions } from './BaseProviderOptions';
import { BaseGeocoder } from '../BaseGeocoder';

export abstract class BaseProvider<
  O extends BaseProviderOptions = BaseProviderOptions,
> extends BaseGeocoder<O> {
  searchUrl?: string;
  label?: string;
}
