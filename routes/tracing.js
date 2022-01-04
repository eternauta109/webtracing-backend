const express = require("express");
const router = express.Router();
const dbconfig = require("../config");
const mysql = require("mysql");
const con = mysql.createPool(dbconfig);
const ErrorHandler = require("../helper/ErrorHandler");

router.get("/tracing", (req, res) => {
  
  res.send("tracing page");

});


postElements = (reg) => {
  /* console.log("reg", reg); */
  pool=mysql.createPool(dbconfig)
  const sqlquery =
    "INSERT INTO tracing (cinema,codfisc,ticket,agregate,phone,date,screen,showtime) VALUES(?,?,?,?,?,?,?,?);";
  return new Promise((resolve, reject) => {
    pool.query(sqlquery, [
      reg.cinema,
      reg.fiscale,
      reg.ticket,
      reg.nameClient,
      reg.numberPhone,
      reg.date,
      reg.screen,
      reg.time
    ], (error, elements) => {
      pool.end();
      if (error) {
        return reject(error);
      }      
      return resolve(elements);
    });
  });
};

deleteElement=(codfiscale)=>{
  /* console.log("tick",codfiscale); */
  pool=mysql.createPool(dbconfig);  
  const sqlquery =
    "DELETE FROM tracing WHERE codfisc=?;";
  return new Promise((resolve,reject)=>{
    pool.query(sqlquery,codfiscale,(error,element)=>{
      pool.end();
      if (error){
        return reject(error);
      }
      return resolve(element)
    })
  })

}


router.delete("/tracing",async (req,res,next)=>{
  
  /* console.log("req body",req.body.elToDelete)  */
  
    try {
      const element= await deleteElement(req.body.elToDelete)
     /*  console.log('selete element', element) */
      res.status(200).json(element)
    } catch (error) {
      next(new ErrorHandler(
        404,
        `database problematico: vedi server/tarcing.js delete  ${error}`
      ));
    }
 
})


router.post("/tracing", async (req, res, next) => {
  /* console.log("tracing body", req.body); */
  
  const reg = req.body.registration;
  /* console.log(reg) */

 /*  if (reg=== undefined){
    next(new ErrorHandler(
    404,
    `elemento inviato al server non valido: vedi server/tarcing.js post`
  ));} */
  try {
    const resultElements= await postElements(reg);
   /*  console.log('elements',resultElements,resultElements.length); */
    return res.status(200).json(resultElements);
  } catch (error) {
    next(new ErrorHandler(
      404,
      `database problematico: vedi server/tarcing.js post  ${error}`
    ));
  }  
});

module.exports = router;
