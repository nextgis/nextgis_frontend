import { interpolate } from './interpolate';
import { step } from './step';

import type {
  ExpressionFunc,
  InterpolationExpressionName,
} from '../../interfaces';

export const interpolationExpressions: Record<
  InterpolationExpressionName,
  ExpressionFunc
> = {
  step,
  interpolate,
};
