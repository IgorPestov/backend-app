const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const router = require("./src/Routes/routes");
const cors = require("cors");
const fileUpload = require("express-fileupload");
app.use(cors());
app.use(fileUpload());
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: true }));
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Database is connected successfully");
  })
  .catch((err) => {
    console.log("Error with connecting to database");
  });
app.use(bodyParser.json());
app.set('view engine', 'jade')
app.use("/user", router);
// app.use("/", router,function (req, res) {
//   //render the index.jade file - input forms for humans
//   res.render("index", function (err, html) {
//     if (err) {
//       // log any error to the console for debug
//       console.log(err);
//     } else {
//       //no error, so send the html to the browser
//       res.send(html);
//     }
//   });
// });
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
