const express = require("express");
const app = express();
const cors = require("cors");
const login=require("./routes/login");
const tracing=require("./routes/tracing");
const find=require("./routes/find")
const _404=require("./routes/404");
const appError=require("./middleware/error")

PORT=process.env.PORT||3001;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);


app.use(cors());

app.use(login);
app.use(tracing);
app.use(find);
app.use(_404);
app.use(appError);


app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
