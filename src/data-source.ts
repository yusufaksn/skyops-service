import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'skyops_db',

  entities: [join(__dirname, '**/*.entity.{js,ts}')],
  migrations: [join(__dirname, 'database/migrations/*.{js,ts}')],

  synchronize: false,
});