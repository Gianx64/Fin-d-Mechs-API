import pg from "pg";
import config from "../../config.js";

const { Pool } = pg;
const pool = new Pool(config.pg);
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
