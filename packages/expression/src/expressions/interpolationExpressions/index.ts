import { step } from './step';
import { interpolate } from './interpolate';

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
