# Queue

![version](https://img.shields.io/npm/v/@nextgis/queue)

A promise-based request queue for JavaScript and TypeScript. `@nextgis/queue`
limits concurrent asynchronous tasks, delays the initial start of a batch,
and supports cancellation through `AbortSignal`.

Features:

- Limit the number of concurrent requests.
- Debounce the start of a batch without delaying the next request when a slot becomes available.
- Cancel queued and active requests.
- Replace outdated requests using a unique `id`.
- Set request timeouts.
- Pause and resume processing.
- Wait until all tasks have finished.
- Keep compatibility with the previous `concurrency`, `delay`, and `add(task, abortFn)` API.

## Installation

### Node.js and bundlers

```bash
npm install @nextgis/queue
```

```ts
import Queue from '@nextgis/queue';
```

### In Browser

Include the built global bundle to use `Queue` as a global variable:

```html
<script src="../lib/queue.global.js"></script>
```

Or use a CDN:

#### unpkg

```html
<script src="https://unpkg.com/@nextgis/queue"></script>
```

#### jsDelivr

```html
<script src="https://cdn.jsdelivr.net/npm/@nextgis/queue"></script>
```

For production applications, pin a specific package version (for example, `@nextgis/queue@4.0.2`)
and verify that the selected build includes the APIs described below.

## Usage

### Basic queue

```ts
import Queue from '@nextgis/queue';

const queue = new Queue({ limit: 3, debounce: 150 });

queue.add(async () => {
  const response = await fetch('https://api.example.com/data');
  return response.json();
});

await queue.waitAll();
```

`add()` enqueues a task and returns `void`; it does not return the task result.
Handle the result inside the task or provide your own promise if you need its value.

### AbortSignal and request replacement

Every task receives an `AbortSignal`.
Requests with the same `id` replace the previous queued or active request.

```ts
const queue = new Queue({ limit: 6, debounce: 150 });

function loadImage(url: string, id: string) {
  queue.add(
    async ({ signal }) => {
      const response = await fetch(url, { signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      // Handle the blob here.
      return blob;
    },
    { id },
  );
}

loadImage('/api/image?view=1', 'map-image');
loadImage('/api/image?view=2', 'map-image'); // Cancels/replaces view=1.

queue.remove('map-image'); // Cancel this request if it is still pending or active.
```

Handle expected abort errors inside tasks when appropriate.
The queue handles rejected task promises internally so they
do not prevent subsequent tasks from starting.

### Pause, resume, and wait for completion

```ts
const queue = new Queue({ limit: 4, debounce: 150 });

queue.pause();        // Stops starting new tasks; active tasks continue.
queue.add(async ({ signal }) => fetch('/api/data', { signal }));
queue.resume();       // Starts queued tasks.

await queue.waitAll(); // Resolves when neither queued nor active tasks remain.
```

Use `queue.pause(150)` to resume automatically after 150 ms.

### Cancel requests

```ts
queue.remove('request-id'); // Cancel one queued or active request.
queue.clearQueue();         // Cancel waiting requests only.
queue.abort();              // Cancel both waiting and active requests.
```

Calling `abort()` signals cancellation,
but the underlying operation must support `AbortSignal`
or supply its own abort handler to stop its work.

### Timeouts and concurrency

```ts
const queue = new Queue({ limit: 6, debounce: 150, timeout: 10_000 });

queue.add(
  ({ signal }) => fetch('/api/slow-resource', { signal }),
  { id: 'slow-resource', timeout: 5_000 },
);

queue.setLimit(3); // Change the concurrency limit at runtime.
```

A timeout aborts the corresponding task and frees its slot in the queue.
The task should observe its signal to stop its own execution.

### Legacy API

Existing calls using `concurrency`, `delay`,
and a separate abort function remain supported:

```ts
const queue = new Queue({ concurrency: 2, delay: 100 });

const controller = new AbortController();
queue.add(
  () => fetch('https://api.example.com/data', { signal: controller.signal }),
  () => controller.abort(),
);

// A task may also return a [promise, abort] tuple.
queue.add(() => {
  const controller = new AbortController();
  return [
    fetch('https://api.example.com/other', { signal: controller.signal }),
    () => controller.abort(),
  ];
});
```

For new code, prefer the signal supplied to the task and `{ id, timeout }` options.

## API reference

| API | Description |
| --- | --- |
| `new Queue({ limit, debounce, timeout })` | Create a queue; all options are optional. |
| `new Queue({ concurrency, delay })` | Backward-compatible option names. |
| `queue.add(task, options?)` | Enqueue a task receiving `{ signal }`; optional `{ id, abort, timeout }`. Returns `void`. |
| `queue.remove(id)` | Cancel queued or active requests matching `id`. |
| `queue.abort()` | Cancel all queued and active requests. |
| `queue.clearQueue()` | Cancel only requests waiting to start. |
| `queue.pause(duration?)` | Pause new requests, optionally resuming after `duration` milliseconds. |
| `queue.resume()` | Resume processing. |
| `queue.waitAll()` | Return a promise that resolves when the queue becomes idle. |
| `queue.setLimit(limit)` | Set the maximum concurrent requests. |
| `queue.debounce` | Read-only configured debounce delay in milliseconds. |

## Commercial support

Need to fix a bug or add a feature to `@nextgis/queue`? We provide custom development and support for this software. [Contact us](http://nextgis.com/contact/) to discuss options!

[![http://nextgis.com](https://nextgis.com/img/nextgis.png)](http://nextgis.com)
