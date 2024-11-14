import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
  host: process.env.POSTGRES_HOST
});
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  console.log("[DB err]:", err.code, err.message);
  process.exit(-1);
});

async function conpg() {
  pool.connect((err) => {
    if(err) {
      console.log("[DB err]:", err.code, err.message);
      setTimeout(conpg, 10000);
    } else {
      console.log("[DB suc]: connected.");
    }
  });
}

conpg();

function readWithId(table, id) {
  try {
    return new Promise((resolve) => {
      pool.query("SELECT * FROM $1 WHERE id = $2", [table, id], (err, result) => {
        return err ? resolve({error: parseInt(err.code)}) : resolve({data: result.rows[0]});
      });
    });
  } catch (err) {
    throw new Error(err);
  }
};

export default { pool, readWithId }
