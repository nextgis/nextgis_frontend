import type { EventEmitter } from 'events';

export class Events<E = any> {
  private readonly _eventsStatus: { [key in keyof E]?: boolean } = {};

  constructor(private emitter: EventEmitter) {}

  setEventStatus(event: keyof E, status: boolean): void {
    this._eventsStatus[event] = status;
  }

  onLoad(event: keyof E | (keyof E)[]): Promise<this> {
    const events: (keyof E)[] = Array.isArray(event) ? event : [event];
    const promises = events.map(
      (x) =>
        new Promise((res) => {
          if (this.getEventStatus(x)) {
            res(this);
          } else {
            const e = x as string | symbol;
            this.emitter.once(e, () => {
              this.setEventStatus(x, true);
              res(this);
            });
          }
        }),
    );
    return Promise.all(promises).then(() => this);
  }

  getEventStatus(event: keyof E): boolean {
    // ugly hack to disable type checking error
    const _eventName = event as keyof E;
    const status = this._eventsStatus[_eventName];
    return status !== undefined ? !!status : false;
  }
}
