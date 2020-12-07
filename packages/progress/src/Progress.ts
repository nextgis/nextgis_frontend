import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import { ProgressEvents } from './ProgressEvents';

export class Progress {
  readonly emitter: StrictEventEmitter<
    EventEmitter,
    ProgressEvents
  > = new EventEmitter();
  private loading = 0;
  private loaded = 0;

  get percent() {
    return (this.loaded / this.loading) * 100;
  }

  /**
   * Increment the count of loading tiles.
   */
  addLoading() {
    if (this.loading === 0) {
      this._emitStartEvent();
    }
    ++this.loading;
    this.update();
  }

  /**
   * Increment the count of loaded tiles.
   */
  addLoaded() {
    setTimeout(() => {
      ++this.loaded;
      this.update();
    }, 100);
  }

  /**
   * Update the progress bar.
   */
  update() {
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