import path from 'path';

import dotenvSafe from 'dotenv-safe';

const cwd = process.cwd();

const root = path.join.bind(cwd);

dotenvSafe.config({
	path: root('.env'),
	sample: root('.env.example'),
});

const ENV = process.env;

const config = {
	PORT: ENV.PORT ?? 4000,
	MONGO_URI: ENV.MONGO_URI ?? '',
	DB_NAME: 'w-challenge',
	SECRET_KEY_JWT: ENV.SECRET_KEY_JWT ?? '',
	W_CHALLENGE: 'w-challenge',
	NODE_ENV: 'development',
};

export { config };
