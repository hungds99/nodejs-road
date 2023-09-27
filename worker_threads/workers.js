const { parentPort, workerData, isMainThread } = require('worker_threads');

const blockingCountFn = (num) => {
  let count = 0;
  for (let i = 0; i < 10000000000; i++) {
    count++;
  }
  return count + num;
};

parentPort.on('message', () => {
  if (workerData) {
    console.log('Worker thread started');
    console.log('Is main thread?', isMainThread);
    const count = blockingCountFn(workerData);
    parentPort.postMessage(count);
  }
});
