// import pg from 'pg';

// const pool = new pg.Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// pool.on('connect', (client) => {
//   console.log('Connected to database');
// });

// pool.on('error', (err, client) => {
//   console.error('Unexpected error on idle client', err);
//   process.exit(-1);
// });

// export default pool;
import pg from 'pg';

const isProduction = process.env.NODE_ENV === 'production';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? {
    rejectUnauthorized: true, // Verify SSL certificate in production
  } : {
    rejectUnauthorized: false // Allow self-signed certificates in development
  }
});

pool.on('connect', (client) => {
  console.log('Connected to database');
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;