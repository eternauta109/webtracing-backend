const express = require("express");
const router = express.Router();
const db = require("../config");
const ErrorHandler = require("../helper/ErrorHandler");
const mysql = require("mysql");

router.get(["/", "/login"], (req, res) => {
  res.send("login home page");
  /* console.log(req.body); */
});

getAllElements = (username) => {
  console.log("username", username);
  pool=mysql.createPool(db)
  const sqlquery =
    "SELECT login.password,login.cinema,login.screen FROM login WHERE login.username=?;";
  return new Promise((resolve, reject) => {
    pool.query(sqlquery, username, (error, elements) => {
      pool.end();
      if (error) {
        return reject(error);
      }      
      return resolve(elements);
    });
  });
};

router.post(["/", "/login"], async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const resultElements = await getAllElements(username);
    /* console.log(resultElements,resultElements.length) */
    if (resultElements.length === 0) {
      next (new ErrorHandler(404, "username non presente nel db"));
      return;
    }
    if (resultElements[0].password === password) {
      return res
        .status(200)
        .json({
          cinema: resultElements[0].cinema,
          screen: resultElements[0].screen,
        });
    }
    next(new ErrorHandler(404, "password errata"));
    return;   
  } catch (e) {
    next(
      new ErrorHandler(
        404,
        `database disconnesso: vedi server/login.js  ${e}`
      )
    );
    return;
  }
});

module.exports = router;

