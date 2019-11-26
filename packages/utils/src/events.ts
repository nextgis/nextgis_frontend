import { EventEmitter } from 'events';

export class Events<E = any> {
  private readonly _eventsStatus: { [key in keyof E]?: boolean } = {};

  constructor(private emitter: EventEmitter) {}

  onLoad(event: keyof E): Promise<this> {
    return new Promise(res => {
      if (this.getEventStatus(event)) {
        res(this);
      } else {
        const e = event as string | symbol;
        this.emitter.once(e, () => {
          res(this);
        });
      }
    });
  }

  getEventStatus(event: keyof E): boolean {
    // ugly hack to disable type checking error
    const _eventName = event as keyof E;
    const status = this._eventsStatus[_eventName];
    return status !== undefined ? !!status : false;
  }
}
