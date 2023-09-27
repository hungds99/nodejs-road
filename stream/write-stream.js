import { once } from 'events';
import { createWriteStream } from 'fs';

const writeableStreamCustomer = async () => {
  const writeableStream = new WritableStream({
    write(chunk, controller) {
      console.log(chunk);
    }
  });

  const writer = writeableStream.getWriter();

  // Generate customer data
  Array.from({ length: 10 }, (_, i) => i + 1).forEach(async (i) => {
    await writer.write(`Customer ${i}`);
  });
};

const writeableStreamCustomerToFile = async () => {
  // Create a writeable stream to a file
  const writeableStream = createWriteStream('./data/customer.csv', {
    encoding: 'utf-8',
    highWaterMark: 16 * 1024
  });

  writeableStream.write('id,name\n');

  // Generate customer data
  for (let i = 0; i < 10e8; i++) {
    const dataWriteable = writeableStream.write(`${i},Customer ${i}\n`);
    if (!dataWriteable) {
      await once(writeableStream, 'drain');
    } else {
      process.nextTick(() => {
        console.log('nextTick');
      });
    }
  }

  writeableStream.end();
};

// writeableStreamCustomer();
writeableStreamCustomerToFile();
