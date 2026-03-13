const app = require('./src/app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on port ${PORT}`);
});

server.on('close', () => {
  console.log('HTTP SERVER CLOSED!');
  console.trace();
});

