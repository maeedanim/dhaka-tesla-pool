export default () => ({
  port: parseInt(process.env.PORT ?? '5000', 10),

  nodeEnv: process.env.NODE_ENV ?? 'development',

  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    name: process.env.DB_NAME ?? 'dhaka_tesla_pool',
    user: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    pool: {
      min: parseInt(process.env.DB_POOL_MIN ?? '2', 10),
      max: parseInt(process.env.DB_POOL_MAX ?? '10', 10),
    },
  },

  jwt: {
    secret: process.env.JWT_SECRET ?? '',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  },
});