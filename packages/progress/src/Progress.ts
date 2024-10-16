import { EventEmitter } from 'events';

import type StrictEventEmitter from 'strict-event-emitter-types';

import type { ProgressEvents } from './ProgressEvents';

export class Progress {
  readonly emitter: StrictEventEmitter<EventEmitter, ProgressEvents> =
    new EventEmitter();
  private loading = 0;
  private loaded = 0;

  get percent(): number {
    return (this.loaded / this.loading) * 100;
  }

  /**
   * Increment the count of loading tiles.
   */
  addLoading(): void {
    if (this.loading === 0) {
      this._emitStartEvent();
    }
    ++this.loading;
    this._emitAddEvent();
    this.update();
  }

  /**
   * Increment the count of loaded tiles.
   */
  addLoaded(): void {
    setTimeout(() => {
      ++this.loaded;
      this._emitRemoveEvent();
      this.update();
    }, 100);
  }

  /**
   * Update the progress bar.
   */
  update(): void {
    if (this.loading === this.loaded) {
      this.loading = 0;
      this.loaded = 0;
      setTimeout(() => {
        this._emitStopEvent();
      }, 200);
    }
  }

  private _emitStartEvent() {
    this.emitter.emit('start');
  }

  private _emitStopEvent() {
    this.emitter.emit('stop');
  }

  private _emitAddEvent() {
    this.emitter.emit('add');
  }

  private _emitRemoveEvent() {
    this.emitter.emit('remove');
  }
}
