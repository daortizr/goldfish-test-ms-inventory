import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

// Load environment variables
dotenv.config();

// Get database configuration from environment variables
const dbConfig = {
  type: 'postgres' as const,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'goldfish_db',
  schema: 'inventario',
  synchronize: true, // Auto-sync schema in development
  logging: false,
  entities: [], // Add entities here when created
  migrations: [], // Add migrations here when created
};

const AppDataSource = new DataSource(dbConfig);

// Export for TypeORM CLI
export default AppDataSource;

let dataSource: DataSource | null = null;

export const connectDatabase = async (): Promise<DataSource> => {
  try {
    if (!dataSource) {
      dataSource = await AppDataSource.initialize();
      console.log('Database connected successfully');
    }
    return dataSource;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export const getDataSource = (): DataSource => {
  if (!dataSource) {
    throw new Error('Database not initialized. Call connectDatabase() first.');
  }
  return dataSource;
};

export const closeDatabase = async (): Promise<void> => {
  if (dataSource) {
    await dataSource.destroy();
    dataSource = null;
    console.log('Database connection closed');
  }
};
