const express = require('express');
const { Worker, isMainThread } = require('worker_threads');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  console.log('Hello from the main thread!');

  res.send(`
  <div>
    <a href="/non-blocking">Non-blocking</a>
    <a href="/blocking">Blocking</a>
  </div>`);
});

app.get('/non-blocking', (req, res) => {
  console.log('Routing to non-blocking route');
  res.send('Hello from non-blocking route!');
});

app.get('/blocking', (req, res) => {
  console.log('Routing to blocking route');
  const worker = new Worker('./workers.js', { workerData: 10 });
  console.log('Is main thread?', isMainThread);
  worker.postMessage('count');
  worker.on('message', (count) => {
    res.send(`Hello from blocking route! ${count}`);
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
