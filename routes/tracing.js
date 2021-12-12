const express = require("express");
const router = express.Router();
const dbconfig = require("../config");
const mysql = require("mysql");

const con = mysql.createPool(dbconfig);

router.get("/tracing", (req, res) => {
  
  res.send("tracing page");
});

router.delete("/tracing",(req,res,next)=>{
  
  /* console.log(req.body.codTicket) */
  
  const sqlquery =
    "DELETE FROM tracing WHERE codfisc=?;";
    try {
      con.query(sqlquery,[req.body.elToDelete],(err,result,fields)=>{
        res.status(200).json(result)
      })
    } catch (error) {
      throw new ErrorHandler(
        404,
        "errore sulla query DELETE del tracing: vedi server/tracing.js"
      );
    }
 
})


router.post("/tracing", (req, res, next) => {
  /* console.log("tracing body", req.body); */
  const reg = req.body.registration;

  /* console.log("registration", reg.fiscale); */

  const sqlquery =
    "INSERT INTO tracing (cinema,codfisc,ticket,agregate,phone,date,screen,showtime) VALUES(?,?,?,?,?,?,?,?);";

  try {
    con.query(
      sqlquery,
      [
        reg.cinema,
        reg.fiscale,
        reg.ticket,
        reg.nameClient,
        reg.numberPhone,
        reg.date,
        reg.screen,
        reg.time
      ],
      (err, result, fields) => {
        if (err) next(new ErrorHandler(404,"errore db nel file tracing"));

        /* console.log(result); */
        if (!result) next(new ErrorHandler(404,"errore db nel file tracing"));

        res.status(200).json(result);
        return;
      }
    );
  } catch (error) {
    next(new ErrorHandler(404,"errore sulla query POST del tracing: vedi server/tracing.js"));
    
  }
});

module.exports = router;
