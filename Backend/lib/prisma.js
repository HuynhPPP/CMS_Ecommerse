require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Determine which connection string to use based on the environment.
// If NODE_ENV is production, it prioritizes DATABASE_URL_INTERNAL.
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = (isProduction && process.env.DATABASE_URL_INTERNAL) 
    ? process.env.DATABASE_URL_INTERNAL 
    : process.env.DATABASE_URL;

// Check if we are using Render's external URL to enable SSL
const isExternalRenderDb = connectionString && connectionString.includes('.render.com');

// Create a PostgreSQL connection pool with SSL if needed
const pool = new Pool({
    connectionString: connectionString,
    ssl: isExternalRenderDb ? { rejectUnauthorized: false } : false
});

// Create the Prisma adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;