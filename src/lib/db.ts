import sql from 'mssql';

const config: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true, // Ignora el certificado local
    serverName: 'localhost'       // 👈 Agrega esta línea mágica para quitar el error de la IP
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};
let poolPromise: Promise<sql.ConnectionPool> | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        console.log('⚡ Conectado exitosamente a SQL Server mediante SQL Authentication');
        return pool;
      })
      .catch(err => {
        poolPromise = null;
        console.error('❌ Error al conectar a SQL Server:', err);
        throw err;
      });
  }
  return poolPromise;
}

export { sql };