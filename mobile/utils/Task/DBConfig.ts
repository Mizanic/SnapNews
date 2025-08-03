import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { DB_NAME, DB_LOCATION } from '../../globalConfig';

/**
 * Configuration for SQLite database connection
 */
export const DB_CONFIG = {
  name: DB_NAME || 'tasks.db',
  location: DB_LOCATION || 'default',
};

/**
 * SQLite state management type definition
 */
export type SQLiteState = {
  isAvailable: boolean;
  instance: any;
  connection: any | null;
}

/**
 * SQLite initialization state
 */
export const sqlite: SQLiteState = {
  isAvailable: false,
  instance: null,
  connection: null
};

// Initialize SQLite if available
try {
  sqlite.instance = require('react-native-sqlite-storage');
  sqlite.instance.enablePromise(true);
  sqlite.isAvailable = true;
  console.log('SQLite module loaded successfully');
} catch (error) {
  console.warn('SQLite not available, using in-memory fallback', error);
}

/**
 * Opens a connection to the SQLite database or returns the existing connection
 * @returns SQLite database connection or null if not available
 */
export async function openDatabase(): Promise<SQLiteDatabase | null> {
  if (!sqlite.isAvailable) {
    console.log('Using in-memory database fallback');
    return null;
  }
  
  if (!sqlite.connection) {
    try {
      console.log('Opening SQLite database with config:', JSON.stringify(DB_CONFIG));
      sqlite.connection = await sqlite.instance.openDatabase(DB_CONFIG);
      console.log('SQLite database opened successfully');
      
      // Verify database is accessible with a simple query
      const testResult = await sqlite.connection.executeSql('SELECT 1 as test');
      console.log('Database connection verified with test query result:', 
                  testResult[0]?.rows?.item?.(0)?.test);
    } catch (error) {
      console.error('Error opening database:', error);
      sqlite.isAvailable = false;
      return null;
    }
  }
  return sqlite.connection;
}