export default {
  apps: [
    {
      name: 'worker_threads',
      script: 'index.js',
      watch: '.',
      ignore_watch: 'node_modules',
      instances: 'max',
      exec_mode: 'cluster',
      out_file: './scripts.txt',
      error_file: './error.txt'
    }
  ]
};
