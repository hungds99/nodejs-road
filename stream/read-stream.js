import { ReadableStream } from 'node:stream/web';
import { setInterval as every } from 'node:timers/promises';
import { performance } from 'node:perf_hooks';

// ReadableStream performance timer interval
const readStreamTimerInterval = async () => {
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

  // Read the transformed stream
  for await (const chunk of transformedStream) {
    console.log(chunk);
  }
};

readStreamTimerInterval();
