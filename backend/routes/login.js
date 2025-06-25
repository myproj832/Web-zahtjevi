// check_in.js
const express = require('express');
const router = express.Router();
const oracledb = require('oracledb');         
const { getConnection } = require('../db');

// Servis: check_in
router.post('/check_in', async (req, res) => {
  const { token_app, user_p, pass_p, ip_p } = req.body;

  const inputJson = JSON.stringify({ user_p, pass_p, ip_p });

  let conn;
  try {
    conn = await getConnection();

    const result = await conn.execute(
      `BEGIN PRO_ZAHTJEVI.PRIJAVA.check_in(:P_TOKEN_APP, :P_IN_AUTEN, :P_OUT_JSON, :P_OUT); END;`,
      {
        P_TOKEN_APP: token_app,
        P_IN_AUTEN: inputJson,
        P_OUT_JSON: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
        P_OUT: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      }
    );

    const pOut = result.outBinds.P_OUT;

    if (pOut === 'OK') {
      let outJson = await result.outBinds.P_OUT_JSON.getData();
      res.json({  P_OUT_JSON: JSON.parse(outJson) });
    } else {
      res.status(400).json({ error: pOut });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// Servis: check_in_2
router.post('/check_in_2', async (req, res) => {
  const { token_app, user_p, token_user, id_u, sifra_p } = req.body;
  const inputJson = JSON.stringify({ user_p, token_user, id_u, sifra_p });

  let conn;
  try {
    conn = await getConnection();

    const result = await conn.execute(
      `BEGIN PRO_ZAHTJEVI.PRIJAVA.check_in_2(:P_TOKEN_APP, :P_IN_AUTEN, :P_OUT_JSON, :P_OUT); END;`,
      {
        P_TOKEN_APP: token_app,
        P_IN_AUTEN: inputJson,
        P_OUT_JSON: { dir: oracledb.BIND_OUT, type: oracledb.CLOB },
        P_OUT: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      }
    );

    const pOut = result.outBinds.P_OUT;

    if (pOut === 'OK') {
      let outJson = await result.outBinds.P_OUT_JSON.getData();
      res.json({  P_OUT_JSON: JSON.parse(outJson) });
    } else {
      res.status(400).json({ error: pOut });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

// Servis: check_in_core
router.post('/check_in_core', async (req, res) => {
  const { token_app, token_user, kor_ime, id_ustanove, sifra_poslovnice } = req.body;

  let conn;
  try {
    conn = await getConnection();

    const result = await conn.execute(
      `BEGIN PRO_ZAHTJEVI.PRIJAVA.check_in_core(:P_TOKEN_APP, :P_TOKEN_USER, :P_USERNAME_U, :P_ID_INSTITUTION, :P_ID_UNIT, :P_OUT); END;`,
      {
        P_TOKEN_APP: token_app,
        P_TOKEN_USER: token_user,
        P_USERNAME_U: kor_ime,
        P_ID_INSTITUTION: id_ustanove,
        P_ID_UNIT: sifra_poslovnice,
        P_OUT: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
      }
    );

    const pOut = result.outBinds.P_OUT;

    if (pOut === 'OK') {
      res.json({ P_OUT: pOut });
    } else {
      res.status(400).json({ error: pOut });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) await conn.close();
  }
});

module.exports = router;