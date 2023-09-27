const { ReadableStream } = require('node:stream/web');

const { setInterval: every } = require('node:timers/promises');

const { performance } = require('node:perf_hooks');

const SECOND = 1000;

// Create a readable stream
const readableStream = new ReadableStream({
  // A function that is called when the stream is started
  async start(controller) {
    for await (const _ of every(SECOND)) {
      controller.enqueue(`Start: ${performance.now()}`);
    }
  }
});

// Transform data in the stream
const transform = new TransformStream({
  async transform(chunk, controller) {
    controller.enqueue(chunk.toUpperCase());
  }
});

// Pipe the stream to the transform
const transformedStream = readableStream.pipeThrough(transform);

// Can not use `readableStream` after piping
// console.log(readableStream.locked);
// const reader = readableStream.getReader();
// console.log(reader.read());

(async () => {
  for await (const chunk of transformedStream) {
    console.log(chunk);
  }
})();
