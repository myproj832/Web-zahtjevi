const oracledb = require('oracledb');

const dbConfig = {
    user: 'pro_zahtjevi',
    password: 'pro_zahtjevi',
    connectionString: '192.168.100.1:1521/finc'
};

async function getConnection() {
  return await oracledb.getConnection(dbConfig);
}

module.exports = { getConnection };
