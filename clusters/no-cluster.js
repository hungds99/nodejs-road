import http from 'node:http';

http
  .createServer((req, res) => {
    if (req.url === '/') {
      res.writeHead(200);
      res.end('hello world from home route\n');
    }

    if (req.url === '/blocking') {
      const start = Date.now();
      while (Date.now() - start < 5000) {}
      res.writeHead(200);
      res.end('hello world from blocking route\n');
    }
  })
  .listen(8000);
