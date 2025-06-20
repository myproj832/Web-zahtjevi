// check_in.js
const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');         
const { getConnection } = require('../db');

// Servis: check_in
router.post('/check_in', async (req, res) => {
  const { user_p, pass_p, ip_p } = req.body;

  const inputJson = JSON.stringify({ user_p, pass_p, ip_p });
  const tokenApp = '2bc17d80-55fb-49ec-ac94-534421cbeb35';

  let conn;
  try {
     conn = await getConnection();

    const result = await conn.execute(
      `BEGIN PRIJAVA.check_in(:P_TOKEN_APP, :P_IN_AUTEN, :P_OUT_JSON, :P_OUT); END;`,
      {
        P_TOKEN_APP: tokenApp,
        P_IN_AUTEN: inputJson,
        P_OUT_JSON: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
        P_OUT: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      }
    );

    let outJson = await result.outBinds.P_OUT_JSON.getData();
    res.json({ P_OUT: result.outBinds.P_OUT, P_OUT_JSON: JSON.parse(outJson) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// Servis: check_in_2
router.post('/check_in_2', async (req, res) => {
  const { user_p, token_user, id_u, sifra_p } = req.body;
  const inputJson = JSON.stringify({ user_p, token_user, id_u, sifra_p });
  const tokenApp = '2bc17d80-55fb-49ec-ac94-534421cbeb35';

  let conn;
  try {
   conn = await getConnection();

    const result = await conn.execute(
      `BEGIN PRIJAVA.check_in_2(:P_TOKEN_APP, :P_IN_AUTEN, :P_OUT_JSON, :P_OUT); END;`,
      {
        P_TOKEN_APP: tokenApp,
        P_IN_AUTEN: inputJson,
        P_OUT_JSON: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
        P_OUT: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      }
    );

    let outJson = await result.outBinds.P_OUT_JSON.getData();
    res.json({ P_OUT: result.outBinds.P_OUT, P_OUT_JSON: JSON.parse(outJson) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// Servis: check_in_core
router.post('/check_in_core', async (req, res) => {
  const { token_user, kor_ime, id_ustanove, sifra_poslovnice } = req.body;
  const tokenApp = '2bc17d80-55fb-49ec-ac94-534421cbeb35';

  let conn;
  try {
   conn = await getConnection();

    const result = await conn.execute(
      `BEGIN PRIJAVA.check_in_core(:P_TOKEN_APP, :P_TOKEN_USER, :P_KOR_IME, :P_ID_USTANOVE, :P_SIFRA_POSLOVNICE, :P_OUT); END;`,
      {
        P_TOKEN_APP: tokenApp,
        P_TOKEN_USER: token_user,
        P_KOR_IME: kor_ime,
        P_ID_USTANOVE: id_ustanove,
        P_SIFRA_POSLOVNICE: sifra_poslovnice,
        P_OUT: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      }
    );

    res.json({ P_OUT: result.outBinds.P_OUT });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

module.exports = router;