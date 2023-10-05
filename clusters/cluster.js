import cluster from 'node:cluster';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import process from 'node:process';

const numCPUs = availableParallelism();

console.log(`Number of CPUs is ${numCPUs}`);

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < 2; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http
    .createServer((req, res) => {
      if (req.url === '/') {
        console.log(`Worker ${process.pid} is handling request`);
        res.writeHead(200);
        res.end('hello world from home route\n');
      }

      if (req.url === '/blocking') {
        console.log(`Worker ${process.pid} is handling request`);
        const start = Date.now();
        for (let i = 0; i < 1_000_000_000_000; i++) {}
        res.writeHead(200);
        res.end('hello world from blocking route\n');
      }
    })
    .listen(8000);

  console.log(`Worker ${process.pid} started`);
}
