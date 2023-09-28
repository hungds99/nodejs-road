import express from 'express';
import { Worker, isMainThread } from 'worker_threads';
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  console.log('Hello from the main thread!');

  res.send(`
    <div>
      <a href="/non-blocking">Non-blocking</a>
      <a href="/blocking">Blocking</a>
      <a href="/worker-threads">Worker threads</a>
    </div>
  `);
});

app.get('/non-blocking', (req, res) => {
  console.log('Routing to non-blocking route');
  res.send('Hello from non-blocking route!');
});

app.get('/blocking', (req, res) => {
  console.log('Routing to blocking route');
  let count = 0;
  for (let i = 0; i < 10000000000; i++) {
    count++;
  }
  res.send(`Hello from blocking route! ${count + 1}`);
});

app.get('/worker-threads', (req, res) => {
  console.log('Routing to worker threads route');
  const worker = new Worker('./workers.js', { workerData: 10 });
  console.log('Is main thread?', isMainThread);
  worker.postMessage('count');
  worker.on('message', (count) => {
    res.send(`Hello from worker threads route! ${count}`);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
