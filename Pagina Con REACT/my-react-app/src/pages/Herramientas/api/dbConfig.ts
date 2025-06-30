// src/pages/Herramientas/api/dbConfig.ts
import mysql from 'mysql2/promise';

interface DBConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
}

export const connectToDB = async () => {
  const config: DBConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fablabBDD',
    port: 3307
  };
  return await mysql.createConnection(config);
};