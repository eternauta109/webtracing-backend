const express = require("express");
const router = express.Router();
const dbconfig = require("../config");
const mysql = require("mysql");
const ErrorHandler = require("../helper/ErrorHandler");

const con = mysql.createPool(dbconfig);

router.get("/find", (req, res) => {
  res.send("find home page");
  /* console.log(req.body); */
});

router.post("/find", (req, res, next) => {
  const toFind = req.body.toFind;
  /* console.log("tofind", toFind); */
  const sqlquery =
    "SELECT tracing.codfisc,tracing.agregate,tracing.phone,tracing.screen, tracing.showtime FROM tracing WHERE tracing.ticket=?;";
  /* console.log("query find", sqlquery); */
  try {
    con.query(sqlquery, [toFind], (err, result, fields) => {
      if (err) {
        next(new ErrorHandler(0, err));
        return;
      }
      if (result.length === 0) {
        /* console.log("result null"); */
        res.status(300).json(null);
        return;
      }
      res
        .status(200)
        .json(result[0]);
      return;
    });
  } catch (error) {
    next(
      new ErrorHandler(
        404,
        "errore nella try della query sul login: vedi server/login.js"
      )
    );
    return;
  }
});

module.exports = router;


/* {
    codfisc: result[0].codfisc,
    agregate: result[0].agregate,
    phone: result[0].phone,
    screen: result[0].screen,
    showtime: result[0].showtime,
  } */