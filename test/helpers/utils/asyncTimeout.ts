export function asyncTimeout(delay = 0): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, delay));
}

export default asyncTimeout;
