const express = require("express");

const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

const cors = require('cors');
const corsOptions ={
  origin: "*", 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use(express.json());
// Для парсинга application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Абсолютный путь к папке с картинками
app.use("/static", express.static(__dirname + "/assets"));


app.use("/api/makets", require("./routes/makets"));
app.use("/api/options", require("./routes/options"));
app.use("/api/likes", require("./routes/likes"));

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
// node --unhandled-rejections=strict server.js
// mongodb://localhost:27017

