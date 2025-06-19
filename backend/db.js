const oracledb = require('oracledb');

async function getConnection() {
  return await oracledb.getConnection({
    user: 'pro_zahtjevi',
    password: 'pro_zahtjevi',
    connectionString: '192.168.100.1:1521/finc'
  });
}

module.exports = { getConnection };
