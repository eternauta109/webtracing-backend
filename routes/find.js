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

findElements = (elToFind) => {
  /* console.log("elToFind", elToFind); */
  pool = mysql.createPool(dbconfig);
  const sqlquery =
    "SELECT tracing.codfisc,tracing.agregate,tracing.phone,tracing.screen, tracing.showtime FROM tracing WHERE tracing.ticket=?;";
  return new Promise((resolve, reject) => {
    pool.query(sqlquery, elToFind, (error, elements) => {
      pool.end();
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
};



router.post("/find", async (req, res, next) => {
  const toFind = req.body.toFind;

  try {
    const resultElements = await findElements(toFind);
    console.log('res',resultElements,resultElements.length)
    if (resultElements.length === 0) {
      /* console.log("result null"); */
      return res.status(300).json(null);      
    }
    return res.status(200).json(resultElements[0]);
    
  } catch (error) {
    return next(
      new ErrorHandler(
        404,
        `errore nella try della query sul login: vedi server/login.js ${error}`
      )
    );
    
  }
});

module.exports = router;


