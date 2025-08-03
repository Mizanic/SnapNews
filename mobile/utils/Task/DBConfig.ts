import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { DB_NAME, DB_LOCATION } from '../../globalConfig';

/**
 * Configuration for SQLite database connection.
 * Uses global configuration values if available, otherwise falls back to defaults.
 */
export const DB_CONFIG = {
  name: DB_NAME || 'tasks.db',
  location: DB_LOCATION || 'default',
};

/**
 * SQLite state management type definition.
 * Tracks availability, instance reference, and active connection.
 * @property {boolean} isAvailable - Whether SQLite is available on the device
 * @property {any} instance - Reference to the SQLite module
 * @property {any | null} connection - Active database connection if established
 */
export type SQLiteState = {
  isAvailable: boolean;
  instance: any;
  connection: any | null;
}

/**
 * SQLite initialization state.
 * Default state assumes SQLite is unavailable until proven otherwise.
 * This object is updated during runtime to reflect the current SQLite state.
 */
export const sqlite: SQLiteState = {
  isAvailable: false,
  instance: null,
  connection: null
};

// Initialize SQLite if available
try {
  // Dynamically load the SQLite module
  sqlite.instance = require('react-native-sqlite-storage');
  // Enable promise interface for better async/await support
  sqlite.instance.enablePromise(true);
  sqlite.isAvailable = true;
  console.log('SQLite module loaded successfully');
} catch (error) {
  console.warn('SQLite not available, using in-memory fallback', error);
}

/**
 * Opens a connection to the SQLite database or returns the existing connection.
 * Implements connection caching to avoid repeated connection attempts.
 * Includes connection validation with a test query.
 * 
 * @returns SQLite database connection or null if SQLite is not available
 * @throws Error if database connection fails
 */
export async function openDatabase(): Promise<SQLiteDatabase | null> {
  if (!sqlite.isAvailable) {
    console.log('Using in-memory database fallback');
    return null;
  }
  
  // Return existing connection if already established
  if (!sqlite.connection) {
    try {
      console.log('Opening SQLite database with config:', JSON.stringify(DB_CONFIG));
      
      // Attempt to open the database with the configured parameters
      sqlite.connection = await sqlite.instance.openDatabase(DB_CONFIG);
      console.log('SQLite database opened successfully');
      
      // Verify database is accessible with a simple query
      // This helps catch issues with the connection before attempting operations
      const testResult = await sqlite.connection.executeSql('SELECT 1 as test');
      console.log('Database connection verified with test query result:', 
                  testResult[0]?.rows?.item?.(0)?.test);
    } catch (error) {
      // Log detailed error information
      console.error('Error opening database:', error);
      
      // Mark SQLite as unavailable on connection failure
      // This triggers fallback to in-memory storage for the session
      sqlite.isAvailable = false;
      return null;
    }
  } else {
    console.log('Reusing existing SQLite connection');
  }
  
  // Return the active connection
  return sqlite.connection;
}