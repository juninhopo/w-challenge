import mongoose from 'mongoose';

import { config } from './config';

async function connectDatabase() {
	// eslint-disable-next-line
	mongoose.connection.on('close', () =>
		console.log('Database connection closed.')
	);

  await mongoose.connect(config.MONGO_URI, {
    dbName: config.DB_NAME,
  });
}

export { connectDatabase };
